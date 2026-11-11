'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useLayoutEffect, type ReactNode } from 'react';
import { LIGHT_K, studioEnvironment } from './kit';

function Studio() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    // The environment is heavily blurred, so half resolution on phones looks the same and builds faster.
    const env = studioEnvironment(gl, matchMedia('(pointer: coarse)').matches ? 128 : 256);
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);
  return <directionalLight color={0xffffff} intensity={0.6 * LIGHT_K} position={[-5, 6, 6]} />;
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
  return (
    <Canvas
      legacy
      dpr={poster ? [1, 2] : [1, 1.75]}
      frameloop={running ? 'always' : 'demand'}
      camera={{ fov: camera?.fov ?? 32, position: camera?.position ?? [0, 0, 12], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!poster }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        // Fade in once real frames have been drawn.
        requestAnimationFrame(() => requestAnimationFrame(onReady));
      }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Studio />
      {children}
    </Canvas>
  );
}
