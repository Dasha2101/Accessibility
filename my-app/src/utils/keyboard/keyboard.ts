export const INTERACTIVE_SELECTORS = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[role="link"]',
  '[onclick]',
];

export const isHidden = (el: HTMLElement): boolean => {
  const style = window.getComputedStyle(el);
  return (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  );
};

export const isNaturallyFocusable = (el: HTMLElement): boolean => {
  const tag = el.tagName.toLowerCase();
  return ['a', 'button', 'input', 'select', 'textarea'].includes(tag);
};

export const hasFocusableTabIndex = (el: HTMLElement): boolean => {
  const tabindex = el.getAttribute('tabindex');
  return tabindex !== null && Number(tabindex) >= 0;
};

export const hasPositiveTabIndex = (el: HTMLElement): boolean => {
  const tabindex = el.getAttribute('tabindex');
  return tabindex !== null && Number(tabindex) > 0;
};