import type { ModuleCheckResult, CheckStatus } from '../../../types';
import puppeteer from 'puppeteer';
import { INTERACTIVE_SELECTORS } from '../../../utils/keyboard/keyboard.ts';

export const checkKeyBoard = async (url: string): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const results: ModuleCheckResult[] = await page.evaluate((selectors: string[]) => {

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

  const elements = Array.from(document.querySelectorAll(selectors.join(','))) as HTMLElement[];
  const results: ModuleCheckResult[] = [];

  elements.forEach(el => {
    const identifier = el.getAttribute('aria-label') || el.getAttribute('id') || el.tagName.toLowerCase();
    const style = window.getComputedStyle(el);

  if (isHidden(el) && (isNaturallyFocusable(el) || hasFocusableTabIndex(el)))
    results.push({
      moduleName: 'Клавиатурная навигация',
      item: identifier,
      issue: 'Элемент скрыт но доступен для фокуса',
      status: 'error' as CheckStatus,
});


  if (!isNaturallyFocusable(el) && !hasFocusableTabIndex(el)) {
    results.push({
      moduleName: 'Клавиатурная навигация',
      item: identifier,
      issue: 'tabindex="-1" делает элемент недоступным',
      status: 'error' as CheckStatus,
    });
  }

  if (hasPositiveTabIndex(el)) {
    results.push({
      moduleName: 'Клавиатурная навигация',
      item: identifier,
      issue: 'tabindex > 0 нарушает порядок фокуса',
      status: 'warning' as CheckStatus,
    });
  }

  if (style.outlineStyle === 'none' || style.outlineWidth === '0px') {
    results.push({
      moduleName: 'Клавиатурная навигация',
      item: identifier,
      issue: 'Фокус не имеет видимого индикатора',
      status: 'warning' as CheckStatus,
    });
  }
});
  return results;
}, INTERACTIVE_SELECTORS);
  await browser.close();
  return results;
};