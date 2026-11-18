import * as THREE from 'three';

/*
 * The studio environment (reflections on the gold and glass) is prefiltered offline by
 * `npm run bake:environment` and shipped as a PNG. Filtering it in the browser linked four extra
 * shaders synchronously and ran some thirty render passes before the first frame, which froze
 * the page on phones. Loading the finished map costs one image decode instead.
 */

/** Edge of one cube face in the baked map. It is heavily blurred, so phones take the smaller one. */
export const ENVIRONMENT_SIZES = { phone: 128, desktop: 256 } as const;
export type EnvironmentSize = (typeof ENVIRONMENT_SIZES)[keyof typeof ENVIRONMENT_SIZES];
export const environmentUrl = (size: EnvironmentSize) => `/environment/studio-${size}.png`;

/** Brightest value in the map: the white studio panels are exactly 1. */
const PEAK = 1;
/** Filtering can overshoot the peak by rounding; anything beyond this means the room got brighter than the encoding allows. */
const PEAK_TOLERANCE = 0.01;
const BYTE_MAX = 255;
const CHANNELS = 4;

/*
 * Light is stored square-root coded, so the dark reflections keep their precision in 8 bits.
 * Rows are kept in GPU order (bottom row first) on both sides, so the PNG looks upside down.
 */
const decodeLight = (byte: number) => (byte / BYTE_MAX) ** 2 * PEAK;

/** Half-float RGBA pixels read back from the filtered map → PNG bytes. Used by the bake script. */
export function encodeEnvironment(halfFloats: Uint16Array) {
  const bytes = new Uint8ClampedArray(halfFloats.length);
  for (let i = 0; i < halfFloats.length; i++) {
    if (i % CHANNELS === CHANNELS - 1) {
      bytes[i] = BYTE_MAX;
      continue;
    }
    const light = THREE.DataUtils.fromHalfFloat(halfFloats[i]);
    if (light > PEAK * (1 + PEAK_TOLERANCE)) throw new Error(`Environment value ${light} is brighter than the encoded peak ${PEAK}`);
    bytes[i] = Math.round(Math.sqrt(Math.min(light, PEAK) / PEAK) * BYTE_MAX);
  }
  return bytes;
}

function decodeEnvironment(bytes: Uint8ClampedArray, width: number, height: number) {
  const halfByByte = Uint16Array.from({ length: BYTE_MAX + 1 }, (_, byte) => THREE.DataUtils.toHalfFloat(decodeLight(byte)));
  const opaque = THREE.DataUtils.toHalfFloat(1);
  const halfFloats = new Uint16Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) halfFloats[i] = i % CHANNELS === CHANNELS - 1 ? opaque : halfByByte[bytes[i]];
  // Same layout and sampling as the texture three's PMREMGenerator produces.
  const texture = new THREE.DataTexture(halfFloats, width, height, THREE.RGBAFormat, THREE.HalfFloatType);
  texture.mapping = THREE.CubeUVReflectionMapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** Fetches and decodes the baked studio environment. Rejects on a failed request or an aborted signal. */
export async function loadStudioEnvironment(size: EnvironmentSize, signal: AbortSignal) {
  const url = environmentUrl(size);
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Studio environment ${url} failed to load: HTTP ${response.status}`);
  // The bytes are data, not colour: no premultiplying, no colour-profile conversion.
  const bitmap = await createImageBitmap(await response.blob(), { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Studio environment could not be decoded: no 2D canvas context');
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return decodeEnvironment(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
}
