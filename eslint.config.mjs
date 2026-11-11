import next from 'eslint-config-next';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'scripts/**', 'data/**'] },
  ...next,
];

export default config;
