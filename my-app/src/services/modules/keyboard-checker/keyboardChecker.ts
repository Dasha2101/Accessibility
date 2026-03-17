import type {
  ModuleCheckResult,
  CheckStatus,
  CheckOptions,
} from '../../../types/types';
import puppeteer from 'puppeteer';
import { INTERACTIVE_SELECTORS } from '../../../utils/keyboard/keyboard';

const DEFAULT_MAX = 20;
const HEAVY_PAGE_MAX = 10;

export const checkKeyBoard = async (
  url: string,
  options?: CheckOptions,
): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    const totalElements = await page.evaluate((selectors: string[]) => {
      return document.querySelectorAll(selectors.join(',')).length;
    }, INTERACTIVE_SELECTORS);

    const maxElements =
      options?.maxElements ?? (totalElements > 1000 ? HEAVY_PAGE_MAX : DEFAULT_MAX);

    const elementsData: ModuleCheckResult[] = await page.evaluate(
      (selectors: string[], max: number) => {
        const isHidden = (el: HTMLElement): boolean => {
          const style = window.getComputedStyle(el);
          return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
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

        const elements = Array.from(document.querySelectorAll(selectors.join(','))).slice(0, max) as HTMLElement[];

        const results: ModuleCheckResult[] = [];
        const seenItems = new Set<string>();

        elements.forEach((el) => {
          const identifier =
            el.getAttribute('aria-label') ||
            el.getAttribute('id') ||
            el.tagName.toLowerCase() ||
            'unknown element';

          if (seenItems.has(identifier)) return;
          seenItems.add(identifier);

          const style = window.getComputedStyle(el);

          if (isHidden(el) && (isNaturallyFocusable(el) || hasFocusableTabIndex(el))) {
            results.push({
              moduleName: 'Клавиатурная навигация',
              item: identifier,
              issue: 'Элемент скрыт, но доступен для фокуса',
              status: 'error',
            });
          }

          if (!isNaturallyFocusable(el) && !hasFocusableTabIndex(el)) {
            results.push({
              moduleName: 'Клавиатурная навигация',
              item: identifier,
              issue: 'Элемент недоступен с клавиатуры',
              status: 'error',
            });
          }

          if (hasPositiveTabIndex(el)) {
            results.push({
              moduleName: 'Клавиатурная навигация',
              item: identifier,
              issue: 'tabindex > 0 нарушает порядок фокуса',
              status: 'warning',
            });
          }

          if (style.outlineStyle === 'none' || style.outlineWidth === '0px') {
            results.push({
              moduleName: 'Клавиатурная навигация',
              item: identifier,
              issue: 'Фокус не имеет видимого индикатора',
              status: 'warning',
            });
          }
        });

        return results;
      },
      INTERACTIVE_SELECTORS,
      maxElements,
    );

    // // Если проверили не всех элементов
    // if (totalElements > maxElements) {
    //   elementsData.push({
    //     moduleName: 'Клавиатурная навигация',
    //     item: 'Общий результат',
    //     issue: `Проверено только ${maxElements} из ${totalElements} элементов`,
    //     status: 'warning',
    //   });
    // }

    if (elementsData.length === 0) {
      elementsData.push({
        moduleName: 'Клавиатурная навигация',
        item: 'Все элементы',
        issue: 'Ошибки не найдены',
        status: 'success',
      });
    }

    return elementsData;
  } catch (error) {
    return [
      {
        moduleName: 'Клавиатурная навигация',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку клавиатурной навигации',
        status: 'error' as CheckStatus,
      },
    ];
  } finally {
    await browser.close();
  }
};