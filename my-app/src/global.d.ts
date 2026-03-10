export {};

declare global {
  interface Window {
    getContrastRatio: (color1: string, color2: string) => number;
  }
}
