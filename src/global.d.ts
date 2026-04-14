export {};

declare global {
  interface Window {
    getContrastRatio: (color1: string, color2: string) => number;
  }
}

declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
