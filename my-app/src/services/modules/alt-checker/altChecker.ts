import type { CheerioAPI } from 'cheerio';
import type {
  ModuleCheckResult,
  CheckStatus,
  CheckOptions,
} from '../../../types/types';

const DEFAULT_MAX = 50;
const HEAVY_PAGE_MAX = 30;

const GENERIC_ALT_VALUES = ['image', 'photo', 'picture', 'img'];

export const checkAltAtributes = (
  $: CheerioAPI,
  options?: CheckOptions,
): ModuleCheckResult[] => {
  const allImages = $('img');
  const totalImages = allImages.length;

  const maxElements =
    options?.maxElements ?? (totalImages > 1000 ? HEAVY_PAGE_MAX : DEFAULT_MAX);

  const limitedImages = allImages.slice(0, maxElements);

  const results: ModuleCheckResult[] = [];

  limitedImages.each((_, img) => {
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

    if (altTrim.length < 3) {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'alt слишком короткий, возможно неинформативный',
        status: 'warning' as CheckStatus,
      });
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
