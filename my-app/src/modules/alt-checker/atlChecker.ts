import type { ModuleCheckResult } from '../../types';

export const checkAltAttributes = (): ModuleCheckResult[] => {
  const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];

   return images.map(img => {
    const alt = img.getAttribute('alt');
    if (alt === null) {
      return {
        moduleName: 'Альтернативная текст',
        item: img.src,
        issue: 'Отсутствует атрибут alt',
        status: 'error',
      };
    }

    if (alt === '') {
        return {
          moduleName: 'Альтернативная текст',
          item: img.src,
          issue: 'Пустой alt',
          status: 'error',
      };
    }

    return {
      moduleName: 'Альтернативная текст',
      item: img.src,
      issue: 'OK',
      status: 'ok',
    };
  });
};