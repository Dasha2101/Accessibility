import type { ModuleCheckResult } from '../../types';
import { mockImg } from '../mock-data/mockData';

export const checkAltAttributes = (): ModuleCheckResult[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(mockImg, 'text/html');
  const images = Array.from(doc.querySelectorAll('img'));

  return images.map(img => {
    const alt = img.getAttribute('alt');
    if (!alt) {
      return {
        moduleName: 'AltChecker',
        item: img.src,
        issue: alt === null ? 'Отсутствует атрибут alt' : 'Пустой alt',
        status: 'error' as const,
      };
    }
    return {
      moduleName: 'AltChecker',
      item: img.src,
      issue: 'OK',
      status: 'ok' as const,
    };
  });
};
