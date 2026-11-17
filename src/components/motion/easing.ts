/** Easing shared by the scripted parts of the motion system (the CSS side uses --ease-expo). */
export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
