import { Page } from 'puppeteer';
import type {
  ModuleCheckResult,
  CheckStatus,
  CheckOptions,
} from '../../../types/types';
import { INTERACTIVE_SELECTORS } from '../../../utils/keyboard/keyboard';

const DEFAULT_MAX = 20;
const HEAVY_PAGE_MAX = 10;

export const checkKeyBoard = async (
  page: Page,
  options?: CheckOptions,
): Promise<ModuleCheckResult[]> => {
  try {
    const totalElements = await page.evaluate((selectors: string[]) => {
      return document.querySelectorAll(selectors.join(',')).length;
    }, INTERACTIVE_SELECTORS);

    const maxElements =
      options?.maxElements ??
      (totalElements > 1000 ? HEAVY_PAGE_MAX : DEFAULT_MAX);

    const results: ModuleCheckResult[] = await page.evaluate(
      (selectors: string[], max: number, total: number) => {
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
            style.opacity === '0'
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
        ).slice(0, max) as HTMLElement[];

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

          if (!isNaturallyFocusable(el) && !hasFocusableTabIndex(el)) {
            addResult(identifier, 'Элемент недоступен с клавиатуры', 'error');
          }

          if (hasPositiveTabIndex(el)) {
            addResult(
              identifier,
              'tabindex > 0 нарушает порядок фокуса',
              'warning',
            );
          }

          if (style.outlineStyle === 'none' || style.outlineWidth === '0px') {
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
      maxElements,
      totalElements,
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
