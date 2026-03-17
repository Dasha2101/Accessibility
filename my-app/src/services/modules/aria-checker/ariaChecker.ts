import type { CheerioAPI } from 'cheerio';
import type {
  ModuleCheckResult,
  CheckStatus,
  CheckOptions,
} from '../../../types/types';

const DEFAULT_MAX = 40;
const HEAVY_PAGE_MAX = 25;

export const checkARIAAttributes = (
  $: CheerioAPI,
  options?: CheckOptions,
): ModuleCheckResult[] => {
  const selector = 'a[href], button, input, select, textarea, [role]';

  const allElements = $(selector);
  const totalElements = allElements.length;

  const maxElements =
    options?.maxElements ??
    (totalElements > 1000 ? HEAVY_PAGE_MAX : DEFAULT_MAX);

  const limitedElements = allElements.slice(0, maxElements);
  const results: ModuleCheckResult[] = [];
  const seenItems = new Set<string>();

  const addResult = (
    identifier: string,
    issue: string,
    status: CheckStatus,
  ) => {
    const key = `${identifier}-${issue}`;
    if (!seenItems.has(key)) {
      results.push({
        moduleName: 'ARIA атрибуты',
        item: identifier,
        issue,
        status,
      });
      seenItems.add(key);
    }
  };

  const allLabels = allElements
    .map((_, el) => $(el).attr('aria-label'))
    .get()
    .filter(Boolean);

  limitedElements.each((_, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();

    const role = $el.attr('role');
    const ariaLabel = $el.attr('aria-label');
    const textContent = $el.text().trim();

    const identifier = ariaLabel || $el.attr('id') || tag;

    const isNativeInteractive = [
      'a',
      'button',
      'input',
      'select',
      'textarea',
    ].includes(tag);

    if (!isNativeInteractive && !role) {
      addResult(
        identifier,
        'Элемент интерактивный, но role не указан',
        'error',
      );
    }

    if (!textContent && !ariaLabel && tag !== 'input') {
      addResult(identifier, 'Нет aria-label или видимого текста', 'error');
    }

    if (ariaLabel) {
      const duplicates = allLabels.filter((l) => l === ariaLabel).length;

      if (duplicates > 1) {
        addResult(
          identifier,
          `Дублирующий aria-label="${ariaLabel}"`,
          'warning',
        );
      }
    }
  });
  return results;
};
