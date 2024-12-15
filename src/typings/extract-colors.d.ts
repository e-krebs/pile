import 'extract-colors';

declare module 'extract-colors' {
  export type FinalColor = {
    hex: string;
    red: number;
    green: number;
    blue: number;
    area: number;
    hue: number;
    saturation: number;
    lightness: number;
    intensity: number;
  };
}
