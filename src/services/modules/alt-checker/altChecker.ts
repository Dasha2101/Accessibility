import type { CheerioAPI } from 'cheerio';
import type {
  ModuleCheckResult,
  CheckStatus,
} from '../../../types/types';
import { isAltSuspicious } from '../../../utils/alt/alt';

const GENERIC_ALT_VALUES = ['image', 'photo', 'picture', 'img'];

export const checkAltAtributes = (
  $: CheerioAPI,
): ModuleCheckResult[] => {
  const allImages = $('img');
  const results: ModuleCheckResult[] = [];

  allImages.each((_, img) => {
    const alt = $(img).attr('alt');
    const src = $(img).attr('src') ?? 'Не указан src';

    if (alt === undefined) {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'Отсутствует атрибут alt',
        status: 'error' as CheckStatus,
      });
      return;
    }

    const altTrim = alt.trim().toLowerCase();

    if (altTrim === '') {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'Пустой alt',
        status: 'error' as CheckStatus,
      });
      return;
    }

    if (GENERIC_ALT_VALUES.includes(altTrim)) {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'Неинформативный alt',
        status: 'warning' as CheckStatus,
      });
      return;
    }

    if (altTrim.length < 3 && !/^[a-z]{2}$/i.test(altTrim)) {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'alt слишком короткий, возможно неинформативный',
        status: 'warning' as CheckStatus,
      });
    }

    if (altTrim.length >= 3) {
      const suspicious =
        src !== 'Не указан src' && isAltSuspicious(altTrim, src);

      if (suspicious) {
        results.push({
          moduleName: 'Альтернативный текст',
          item: src,
          issue: 'alt может не соответствовать содержимому изображения',
          status: 'warning' as CheckStatus,
        });
      }
    }
  });
  if (results.length === 0) {
    results.push({
      moduleName: 'Альтернативный текст',
      item: 'Все изображения',
      issue: 'Ошибки не найдены',
      status: 'success' as CheckStatus,
    });
  }

  return results;
};
