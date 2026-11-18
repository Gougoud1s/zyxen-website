'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type * as THREE from 'three';
import { ENVIRONMENT_SIZES, loadStudioEnvironment } from './environment';
import { LIGHT_K, sceneTextures } from './kit';
import { nextIdle } from './schedule';

/** Frames drawn before the poster fades out; the first one can still be filling GPU buffers. */
const FRAMES_BEFORE_READY = 2;
/** Longest the scene waits for its environment map before giving up and keeping the poster. */
const ENVIRONMENT_TIMEOUT_MS = 15_000;

/**
 * Key light plus everything the first frame needs, prepared before the frame loop starts.
 * Linking the shaders and uploading the textures used to land in the first frame and freeze the
 * page (worst on phones, where linking a shader takes longest). Now each step runs in its own
 * idle task, the shaders link off the main thread and the environment arrives prefiltered.
 */
function Studio({ onPrepared, onError }: { onPrepared: () => void; onError: (error: unknown) => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    let cancelled = false;
    let env: THREE.Texture | undefined;
    const loading = new AbortController();
    const timeout = setTimeout(() => loading.abort(new Error('Studio environment timed out')), ENVIRONMENT_TIMEOUT_MS);
    const prepare = async () => {
      const size = matchMedia('(pointer: coarse)').matches ? ENVIRONMENT_SIZES.phone : ENVIRONMENT_SIZES.desktop;
      env = await loadStudioEnvironment(size, loading.signal);
      clearTimeout(timeout);
      if (cancelled) return;
      scene.environment = env;
      await nextIdle();
      if (cancelled) return;
      await gl.compileAsync(scene, camera);
      for (const texture of [env, ...sceneTextures(scene)]) {
        await nextIdle();
        if (cancelled) return;
        gl.initTexture(texture);
      }
      if (!cancelled) onPrepared();
    };
    prepare().catch((error: unknown) => {
      if (!cancelled) onError(error);
    });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      loading.abort();
      scene.environment = null;
      env?.dispose();
    };
  }, [gl, scene, camera, onPrepared, onError]);

  return <directionalLight color={0xffffff} intensity={0.6 * LIGHT_K} position={[-5, 6, 6]} />;
}

/** Reports once real frames have been drawn, so the poster only fades over a finished picture. */
function FirstFrames({ onDrawn }: { onDrawn: () => void }) {
  const drawn = useRef(0);
  // useFrame runs before each render, so on call n there are n frames on screen.
  useFrame(() => {
    if (drawn.current === FRAMES_BEFORE_READY) onDrawn();
    if (drawn.current <= FRAMES_BEFORE_READY) drawn.current += 1;
  });
  return null;
}

type Props = {
  children: ReactNode;
  /** false pauses rendering (off-screen or hidden tab). */
  running: boolean;
  poster?: boolean;
  camera?: { fov?: number; position?: [number, number, number] };
  onReady: () => void;
};

/** The shared WebGL canvas: studio environment, key light, capped DPR, pause when not running. */
export default function Stage({ children, running, poster, camera, onReady }: Props) {
  const [prepared, setPrepared] = useState(false);
  const [, rethrow] = useState<null>(null);
  const markPrepared = useCallback(() => setPrepared(true), []);
  // Thrown during render so the error boundary in SceneCanvas keeps the poster.
  const failPreparation = useCallback(
    (error: unknown) =>
      rethrow(() => {
        throw error;
      }),
    [],
  );

  return (
    <Canvas
      legacy
      dpr={poster ? [1, 2] : [1, 1.75]}
      frameloop={!prepared ? 'never' : running ? 'always' : 'demand'}
      camera={{ fov: camera?.fov ?? 32, position: camera?.position ?? [0, 0, 12], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!poster }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Studio onPrepared={markPrepared} onError={failPreparation} />
      {children}
      {prepared && <FirstFrames onDrawn={onReady} />}
    </Canvas>
  );
}
