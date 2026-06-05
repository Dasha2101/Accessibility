import { Page } from 'puppeteer';
import type { ModuleCheckResult, CheckStatus } from '../../../types/types';

export const checkStructure = async (
  page: Page,
): Promise<ModuleCheckResult[]> => {
  try {
    const results = await page.evaluate(() => {
      const results: ModuleCheckResult[] = [];
      const seenItems = new Set<string>();

      const addResult = (item: string, issue: string, status: CheckStatus) => {
        const key = `${item}-${issue}`;
        if (!seenItems.has(key)) {
          results.push({
            moduleName: 'Структура интерфейса',
            item,
            issue,
            status,
          });
          seenItems.add(key);
        }
      };

      const elements = Array.from(
        document.body.querySelectorAll<HTMLElement>('body *'),
      );
      const headers = elements.filter((el) => /^H[1-6]$/.test(el.tagName));

      let lastLevel: number | null = null;

      headers.forEach((el) => {
        const level = parseInt(el.tagName[1]);
        const text = el.textContent?.trim() || '';

        if (!text) {
          addResult(el.tagName.toLowerCase(), 'Заголовок пустой', 'error');
        }

        if (lastLevel !== null && level - lastLevel > 1) {
          addResult(
            el.tagName.toLowerCase(),
            `Пропущен уровень заголовка (предыдущий h${lastLevel})`,
            'warning',
          );
        }

        lastLevel = level;
      });

      ['main', 'header', 'footer', 'nav'].forEach((tag) => {
        if (!document.querySelector(tag)) {
          addResult('body', `Отсутствует тег <${tag}>`, 'warning');
        }
      });

      const lists = elements.filter((el) => ['UL', 'OL'].includes(el.tagName));

      lists.forEach((list) => {
        Array.from(list.children).forEach((li) => {
          if (li.tagName.toLowerCase() !== 'li') {
            addResult(
              list.tagName.toLowerCase(),
              'Список содержит элемент, не являющийся <li>',
              'error',
            );
          }
        });
      });

      const tables = elements.filter((el) => el.tagName === 'TABLE');

      tables.forEach((table) => {
        if (!table.querySelector('thead') || !table.querySelector('tbody')) {
          addResult(
            'table',
            'Таблица должна содержать <thead> и <tbody>',
            'warning',
          );
        }

        if (table.querySelectorAll('th').length === 0) {
          addResult(
            'table',
            'Таблица должна содержать хотя бы один <th>',
            'warning',
          );
        }
      });
      const inputs = elements.filter((el) =>
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName),
      );

      inputs.forEach((input) => {
        const id = input.getAttribute('id');

        const hasLabel =
          (id && document.querySelector(`label[for="${id}"]`)) ||
          input.closest('label');

        if (!hasLabel) {
          addResult(
            input.tagName.toLowerCase(),
            'Поле формы без связанного <label>',
            'error',
          );
        }
      });
      const ariaElements = elements.filter(
        (el) =>
          el.hasAttribute('role') ||
          el.hasAttribute('aria-label') ||
          el.hasAttribute('aria-labelledby') ||
          el.hasAttribute('aria-hidden'),
      );

      ariaElements.forEach((el) => {
        const role = el.getAttribute('role');

        if (role === 'presentation' && el.children.length > 0) {
          addResult(
            el.tagName.toLowerCase(),
            'role="presentation" с вложенными элементами может скрывать контент',
            'warning',
          );
        }
      });
      if (results.length === 0) {
        results.push({
          moduleName: 'Структура интерфейса',
          item: 'Все элементы',
          issue: 'Ошибки не найдены',
          status: 'success',
        });
      }

      return results;
    });

    return results;
  } catch (error) {
    return [
      {
        moduleName: 'Структура интерфейса',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку структуры интерфейса',
        status: 'error',
      },
    ];
  }
};
