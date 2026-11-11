import next from 'eslint-config-next';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'scripts/**', 'data/**', 'test-results/**', 'playwright-report/**'] },
  ...next,
  {
    // three.js scenes mutate scene-graph objects every frame inside useFrame, which is how R3F is meant to be used.
    files: ['src/components/three/**'],
    rules: { 'react-hooks/immutability': 'off' },
  },
];

export default config;
