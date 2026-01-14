import type { ModuleCheckResult } from '../../types';
import { getContrastRatio } from '../../utils/contrast/contrast';

const MIN_CONTRAST_RATIO_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_RATIO_LARGE_TEXT = 3;

export const checkContrast = (): ModuleCheckResult[] => {
  const elements = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button')) as HTMLElement[];
   return elements.map(el => {
    const style = window.getComputedStyle(el);
    const textColor = style.color;
    const backgroundColor = style.backgroundColor;

     const rgbToHex = (rgb: string) => {
      const match = rgb.match(/\d+/g);
      if (!match) return '#000000';
      const [r, g, b] = match.map(Number);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const textHex = rgbToHex(textColor);
    const bgHex = rgbToHex(backgroundColor);

    const fontSize = parseFloat(style.fontSize);
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && style.fontWeight === 'bold');

    const required = isLargeText ? MIN_CONTRAST_RATIO_LARGE_TEXT : MIN_CONTRAST_RATIO_NORMAL_TEXT;

    const ratio = getContrastRatio(textHex, bgHex);
    const passed = ratio >= required;

    return {
      moduleName: 'Цветовая контрастность',
      item: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className}` : ''),
      issue: `Контраст ${ratio.toFixed(2)} (норма ≥ ${required})`,
      status: passed ? 'ok' : 'warning',
    };
  });
};