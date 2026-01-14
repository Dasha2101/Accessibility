import type { ModuleCheckResult } from '../../types';

export const checkStructure = (): ModuleCheckResult[] => {
  const results: ModuleCheckResult[] = [];

  const headers = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  headers.forEach(el => {
    const level = parseInt(el.tagName[1], 10);
    const text = el.textContent?.trim() || '[пустой заголовок]';

    if (!text) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: el.tagName.toLowerCase(),
        issue: 'Заголовок пустой',
        status: 'error',
      });
    }

    if (lastLevel && level - lastLevel > 1) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: el.tagName.toLowerCase(),
        issue: `Пропущен уровень заголовка (предыдущий h${lastLevel})`,
        status: 'warning',
      });
    }
    lastLevel = level
  });

  if (!document.querySelector('h1')) {
    results.push({
      moduleName: 'Структура интерфейса',
      item: 'body',
      issue: 'Нет заголовка h1 на странице',
      status: 'error',
    });
  }

  ['main', 'header', 'footer', 'nav'].forEach(tag => {
    const el = document.querySelector(tag);
    if (!el) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: 'body',
        issue: `Отсутствует тег <${tag}>`,
        status: 'warning',
      });
    }
  });

  const lists = Array.from(document.querySelectorAll('ul, ol'));
  lists.forEach(list => {
    const item = Array.from(list.children);
    item.forEach(li => {
      if (li.tagName.toLowerCase() !== 'li') {
        results.push({
          moduleName: 'Структура интерфейса',
          item: list.tagName.toLowerCase(),
          issue: 'Список содержит элемент, не являющийся <li>',
          status: 'error',
        });
      }
    });
  });

  const tables = Array.from(document.querySelectorAll('table'));
  tables.forEach(table => {
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: 'table',
        issue: 'Таблица должна содержать <thead> и <tbody>',
        status: 'warning',
      });
    }

    const ths = table.querySelectorAll('th');
    if (ths.length === 0) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: 'table',
        issue: 'Таблица должна содержать хотя бы один <th>',
        status: 'warning',
      });
    }
  });

  const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const hasLabel = id && document.querySelector(`label[for="${id}"]`) || input.closest('label');
    if (!hasLabel) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: input.tagName.toLowerCase(),
        issue: 'Поле формы без связанного <label>',
        status: 'error',
      });
    }
  });

  const ariaElements = Array.from(document.querySelectorAll('[role], [aria-label], [aria-labelledby], [aria-hidden]'));
  ariaElements.forEach(el => {
    const role = el.getAttribute('role');
    if (role === 'presentation' && el.children.length > 0) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: el.tagName.toLowerCase(),
        issue: 'role="presentation" с вложенными элементами может скрывать контент',
        status: 'warning',
      });
    }
  });

  return results;
}