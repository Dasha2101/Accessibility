import { INTERACTIVE_SELECTORS } from '../../../utils/keyboard/keyboard';
export const checkKeyBoard = async (page, options) => {
    try {
        const results = await page.evaluate((selectors) => {
            const results = [];
            const seenItems = new Set();
            const addResult = (item, issue, status) => {
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
            const isHidden = (el) => {
                const style = window.getComputedStyle(el);
                return (style.display === 'none' ||
                    style.visibility === 'hidden' ||
                    style.opacity === '0');
            };
            const isNaturallyFocusable = (el) => {
                const tag = el.tagName.toLowerCase();
                return ['a', 'button', 'input', 'select', 'textarea'].includes(tag);
            };
            const hasFocusableTabIndex = (el) => {
                const tabindex = el.getAttribute('tabindex');
                return tabindex !== null && Number(tabindex) >= 0;
            };
            const hasPositiveTabIndex = (el) => {
                const tabindex = el.getAttribute('tabindex');
                return tabindex !== null && Number(tabindex) > 0;
            };
            const elements = Array.from(document.querySelectorAll(selectors.join(',')));
            elements.forEach((el) => {
                const identifier = el.getAttribute('aria-label') ||
                    el.getAttribute('id') ||
                    el.tagName.toLowerCase() ||
                    'unknown element';
                const style = window.getComputedStyle(el);
                if (isHidden(el) &&
                    (isNaturallyFocusable(el) || hasFocusableTabIndex(el))) {
                    addResult(identifier, 'Элемент скрыт, но доступен для фокуса', 'error');
                }
                if (!isNaturallyFocusable(el) && !hasFocusableTabIndex(el)) {
                    addResult(identifier, 'Элемент недоступен с клавиатуры', 'error');
                }
                if (hasPositiveTabIndex(el)) {
                    addResult(identifier, 'tabindex > 0 нарушает порядок фокуса', 'warning');
                }
                if (style.outlineStyle === 'none' || style.outlineWidth === '0px') {
                    addResult(identifier, 'Фокус не имеет видимого индикатора', 'warning');
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
        }, INTERACTIVE_SELECTORS);
        return results;
    }
    catch (error) {
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
