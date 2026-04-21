import { load } from 'cheerio';
import { checkARIAAttributes } from './ariaChecker';

describe('checkARIAAttributes', () => {
  it('должен вернуть error если у элемента с role нет текста', () => {
    const $ = load('<div role="button"></div>');
    const results = checkARIAAttributes($);
    
    expect(results[0]).toEqual({
      moduleName: 'ARIA атрибуты',
      item: 'div',
      issue: 'Нет aria-label или видимого текста',
      status: 'error',
    });
  });
  it('должен вернуть error если нет aria-label и видимого текста', () => {
    const $ = load('<button></button>');
    const results = checkARIAAttributes($);
    
    expect(results[0]).toEqual({
      moduleName: 'ARIA атрибуты',
      item: 'button',
      issue: 'Нет aria-label или видимого текста',
      status: 'error',
    });
  });

  it('должен вернуть warning для дублирующегося aria-label', () => {
    const $ = load(`
      <button aria-label="Закрыть">X</button>
      <button aria-label="Закрыть">Close</button>
    `);
    const results = checkARIAAttributes($);
    
    expect(results[0]).toEqual({
      moduleName: 'ARIA атрибуты',
      item: 'Закрыть',
      issue: 'Дублирующий aria-label="Закрыть"',
      status: 'warning',
    });
  });
});