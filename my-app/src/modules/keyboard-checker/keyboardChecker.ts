import type { ModuleCheckResult } from '../../types';
import {
  INTERACTIVE_SELECTORS,
  isHidden,
  isNaturallyFocusable,
  hasFocusableTabIndex,
  hasPositiveTabIndex
} from '../../utils/keyboard/keyboard';

export const checkKeyBoard = (): ModuleCheckResult[] => {
  const elements = Array.from(
    document.querySelectorAll(INTERACTIVE_SELECTORS.join(','))
  ) as HTMLElement[];

const results: ModuleCheckResult[] = [];

elements.forEach(el => {
  const identifier = el.getAttribute('aria-label') || el.getAttribute('id') || el.tagName.toLowerCase();

  if (isHidden(el) && (isNaturallyFocusable(el) || hasFocusableTabIndex(el)))
    results.push({
      moduleName: 'Клавиатурная навигация',
      item: identifier,
      issue: 'Элемент скрыт но доступен для фокуса',
      status: 'error',
});


  if (!isNaturallyFocusable(el) && !hasFocusableTabIndex(el)) {
    results.push({
      moduleName: 'Клавиатурная навигация',
      item: identifier,
      issue: 'tabindex="-1" делает элемент недоступным',
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

  const style = window.getComputedStyle(el);
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
};
