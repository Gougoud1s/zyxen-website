export type SceneProps = {
  running: boolean;
  poster: boolean;
  onReady: () => void;
  [key: string]: unknown;
};
