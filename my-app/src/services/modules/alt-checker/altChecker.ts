import type { CheerioAPI } from 'cheerio';
import type { ModuleCheckResult, CheckStatus } from '../../../types';

export const checkAltAtributes = ($: CheerioAPI): ModuleCheckResult[] => {
  const images = $('img');
  return images
    .map((_, img) => {
      const alt = $(img).attr('alt') ?? '';
      const src = $(img).attr('src') ?? 'Не указан src';

      if (alt === undefined) {
        return {
          moduleName: 'Альтернативный текст',
          item: src ?? 'Не указан src',
          issue: 'Отсутствует атрибут alt',
          status: 'error' as CheckStatus,
        };
      }

      if (alt.trim() === '') {
        const role = $(img).attr('role');
        const ariaHidden = $(img).attr('aria-hidden');
        const decorative = role === 'presentation' || ariaHidden === 'true';
        return {
          moduleName: 'Альтернативный текст',
          item: src,
          issue: decorative
            ? 'Декоративное изображение — пустой alt допустим'
            : 'Пустой alt',
          status: decorative ? ('ok' as CheckStatus) : ('error' as CheckStatus),
        };
      }

      if (alt.trim().length < 3) {
        return {
          moduleName: 'Альтернативный текст',
          item: src,
          issue: 'alt слишком короткий, возможно неинформативный',
          status: 'warning' as CheckStatus,
        };
      }

      return {
        moduleName: 'Альтернативный текст',
        item: src ?? 'Альтернатива',
        issue: 'OK',
        status: 'ok' as CheckStatus,
      };
    })
    .get();
};
