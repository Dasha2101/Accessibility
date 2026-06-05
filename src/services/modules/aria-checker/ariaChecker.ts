import type { CheerioAPI } from 'cheerio';
import type { ModuleCheckResult, CheckStatus } from '../../../types/types';

export const checkARIAAttributes = ($: CheerioAPI): ModuleCheckResult[] => {
  const selector = 'a[href], button, input, select, textarea, [role]';

  const allElements = $(selector);
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

  allElements.each((_, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();

    const role = $el.attr('role');
    const ariaLabel = $el.attr('aria-label');
    const textContent = $el.text().trim().replace(/\s+/g, ' ');

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
    const ariaLabelledBy = $el.attr('aria-labelledby');

    const hasName = Boolean(ariaLabel || textContent || ariaLabelledBy);

    if (!hasName) {
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
