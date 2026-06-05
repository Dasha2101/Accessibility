import { Page } from 'puppeteer';
import type {
  ModuleCheckResult,
  CheckStatus,
} from '../../../types/types';
import { INTERACTIVE_SELECTORS } from '../../../utils/keyboard/keyboard';

export const checkKeyBoard = async (
  page: Page,
): Promise<ModuleCheckResult[]> => {
  try {
    const results: ModuleCheckResult[] = await page.evaluate(
      (selectors: string[]) => {
        const results: ModuleCheckResult[] = [];
        const seenItems = new Set<string>();

        const addResult = (
          item: string,
          issue: string,
          status: CheckStatus,
        ) => {
          const key = `${item}-${issue}-${status}`;
          if (!seenItems.has(key)) {
            results.push({
              moduleName: 'Клавиатурная навигация',
              item,
              issue,
              status,
            });
            seenItems.add(key);
          }
        };

        const isHidden = (el: HTMLElement): boolean => {
          const style = window.getComputedStyle(el);
          return (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.opacity === '0' ||
            el.hasAttribute('hidden')
          );
        };

        const isNaturallyFocusable = (el: HTMLElement): boolean => {
          const tag = el.tagName.toLowerCase();
          return ['a', 'button', 'input', 'select', 'textarea'].includes(tag);
        };

        const hasFocusableTabIndex = (el: HTMLElement): boolean => {
          const tabindex = el.getAttribute('tabindex');
          return tabindex !== null && Number(tabindex) >= 0;
        };

        const hasPositiveTabIndex = (el: HTMLElement): boolean => {
          const tabindex = el.getAttribute('tabindex');
          return tabindex !== null && Number(tabindex) > 0;
        };

        const elements = Array.from(
          document.querySelectorAll(selectors.join(',')),
        ) as HTMLElement[];

        elements.forEach((el) => {
          const identifier =
            el.getAttribute('aria-label') ||
            el.getAttribute('id') ||
            el.tagName.toLowerCase() ||
            'unknown element';

          const style = window.getComputedStyle(el);

          if (
            isHidden(el) &&
            (isNaturallyFocusable(el) || hasFocusableTabIndex(el))
          ) {
            addResult(
              identifier,
              'Элемент скрыт, но доступен для фокуса',
              'error',
            );
          }

          const isInteractive =
            isNaturallyFocusable(el) ||
            hasFocusableTabIndex(el) ||
            el.getAttribute('role') === 'button' ||
            el.getAttribute('role') === 'link';

          if (
            isInteractive &&
            !hasFocusableTabIndex(el) &&
            !isNaturallyFocusable(el)
          ) {
            addResult(identifier, 'Элемент недоступен с клавиатуры', 'error');
          }

          if (hasPositiveTabIndex(el)) {
            addResult(
              identifier,
              'tabindex > 0 нарушает порядок фокуса',
              'warning',
            );
          }

          if (style.outlineStyle === 'none' && style.boxShadow === 'none') {
            addResult(
              identifier,
              'Фокус не имеет видимого индикатора',
              'warning',
            );
          }
        });

        if (results.length === 0) {
          results.push({
            moduleName: 'Клавиатурная навигация',
            item: 'Все элементы',
            issue: 'Ошибки не найдены',
            status: 'success',
          });
        }

        return results;
      },
      INTERACTIVE_SELECTORS,
    );

    return results;
  } catch (error) {
    return [
      {
        moduleName: 'Клавиатурная навигация',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку клавиатурной навигации',
        status: 'error',
      },
    ];
  }
};
