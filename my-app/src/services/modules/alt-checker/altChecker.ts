import type { CheerioAPI } from 'cheerio';
import type { ModuleCheckResult, CheckStatus } from '../../../types';

export const checkAltAtributes = ($: CheerioAPI): ModuleCheckResult[] => {
   const images = $('img')
   return images.map((_, img) => {
    const alt = $(img).attr('alt');
    const src = $(img).attr('src');

    if (alt === undefined) {
      return {
        moduleName: 'Альтернативная текст',
        item: src ?? 'Не указан src',
        issue: 'Отсутствует атрибут alt',
        status: 'error' as CheckStatus,
      };
    }

    if (alt === '') {
        return {
          moduleName: 'Альтернативная текст',
          item: src ?? 'Пусто',
          issue: 'Пустой alt',
          status: 'error' as CheckStatus,
      };
    }

    return {
      moduleName: 'Альтернативный текст',
      item: src ?? 'Альтернатива',
      issue: 'OK',
      status: 'ok' as CheckStatus,
    }
  }).get();;
};
