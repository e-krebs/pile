import { FinalColor } from 'extract-colors';

export type RGB = [number, number, number];

export const getRgba = (rgb?: RGB, a = 1): string | undefined => {
  if (!rgb) return;
  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const getRgb = (color?: FinalColor): RGB | undefined =>
  color ? [color.red, color.green, color.blue] : undefined;
