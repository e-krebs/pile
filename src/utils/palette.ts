import type { Palette as VibrantPalette } from 'node-vibrant/lib/color';

export type RGB = [number, number, number];
export interface Palette {
  vibrant?: RGB;
  muted?: RGB;
  darkVibrant?: RGB;
  darkMuted?: RGB;
  lightVibrant?: RGB;
  lightMuted?: RGB;
}

export const defaultRgb: RGB = [1, 1, 1];

export const getRgba = ([r, g, b]: RGB, a: number): string =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

export const resolvePalette = (input: VibrantPalette): Palette => {
  return {
    vibrant: input.Vibrant?.getRgb(),
    muted: input.Muted?.getRgb(),
    darkVibrant: input.DarkVibrant?.getRgb(),
    darkMuted: input.DarkMuted?.getRgb(),
    lightVibrant: input.LightVibrant?.getRgb(),
    lightMuted: input.LightMuted?.getRgb(),
  };
};
