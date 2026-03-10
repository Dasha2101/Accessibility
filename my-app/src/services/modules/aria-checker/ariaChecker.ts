import type { CheerioAPI } from 'cheerio';
import type { ModuleCheckResult, CheckStatus } from '../../../types';

export const checkARIAAttributes = ($: CheerioAPI): ModuleCheckResult[] => {
  const interactiveElements = $('a[href], button, input, select, textarea, [role]');

  return interactiveElements
    .map((_, el) => {
      const $el = $(el);
      const tag = el.tagName.toLowerCase();
      const role = $el.attr('role');
      const ariaLabel = $el.attr('aria-label');
      const ariaHidden = $el.attr('aria-hidden');
      const textContent = $el.text().trim();

      const identifier = ariaLabel || $el.attr('id') || tag;

      const results: ModuleCheckResult[] = [];

      if (ariaHidden === 'true') {
        results.push({
          moduleName: 'ARIA атрибуты',
          item: identifier,
          issue: 'Элемент скрыт от скринридеров (aria-hidden="true")',
          status: 'ok' as CheckStatus,
        });
        return results;
      }

      const needsRole =
        !['a', 'button', 'input', 'select', 'textarea'].includes(tag);
      if (needsRole && !role) {
        results.push({
          moduleName: 'ARIA атрибуты',
          item: identifier,
          issue: 'Элемент интерактивный, но role не указан',
          status: 'error' as CheckStatus,
        });
      }

      if (!textContent && !ariaLabel && tag !== 'input') {
        results.push({
          moduleName: 'ARIA атрибуты',
          item: identifier,
          issue: 'Элемент интерактивный, но нет aria-label или видимого текста',
          status: 'error' as CheckStatus,
        });
      }

      const allLabels = Array.from(
        $('a[href], button, input, select, textarea, [role]').map((_, e) =>
          $(e).attr('aria-label'),
        ),
      );
      if (ariaLabel && allLabels.filter((l) => l === ariaLabel).length > 1) {
        results.push({
          moduleName: 'ARIA атрибуты',
          item: identifier,
          issue: `Дублирующий aria-label="${ariaLabel}"`,
          status: 'warning' as CheckStatus,
        });
      }

      if (results.length === 0) {
        results.push({
          moduleName: 'ARIA атрибуты',
          item: identifier,
          issue: 'OK',
          status: 'ok' as CheckStatus,
        });
      }

      return results;
    })
    .get()
    .flat();
};