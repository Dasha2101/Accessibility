import type { ModuleCheckResult } from '../../types';
import { mockContrastElements } from '../mock-data/mockData';
import { getContrastRatio } from '../../utils/contrast/Contrast';

const MIN_CONTRAST_RATIO_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_RATIO_LARGE_TEXT = 3;

export const checkContrast = (): ModuleCheckResult[] => {
  return mockContrastElements.map(el => {
    const ratio = getContrastRatio(el.textColor, el.backgroundColor);

    const required = el.isLargeText
      ? MIN_CONTRAST_RATIO_LARGE_TEXT
      : MIN_CONTRAST_RATIO_NORMAL_TEXT;

    const passed = ratio >= required;

    return {
      moduleName: 'Цветовая контрастность',
      item: el.selector,
      issue: `Контраст ${ratio.toFixed(2)} (норма ≥ ${required})`,
      status: passed ? 'ok' : 'error',
    };
  });
};