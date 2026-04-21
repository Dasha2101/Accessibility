import { load } from 'cheerio';
import { checkAltAtributes } from './altChecker';

describe('checkAltAtributes', () => {
  it('должен вернуть error если alt отсутствует', () => {
    const $ = load('<img src="test.jpg">');
    const results = checkAltAtributes($);
    
    expect(results[0]).toEqual({
      moduleName: 'Альтернативный текст',
      item: 'test.jpg',
      issue: 'Отсутствует атрибут alt',
      status: 'error',
    });
  });

  it('должен вернуть error если alt пустой', () => {
    const $ = load('<img src="test.jpg" alt="">');
    const results = checkAltAtributes($);
    
    expect(results[0]).toEqual({
      moduleName: 'Альтернативный текст',
      item: 'test.jpg',
      issue: 'Пустой alt',
      status: 'error',
    });
  });

  it('должен вернуть warning для неинформативного alt', () => {
    const $ = load('<img src="test.jpg" alt="image">');
    const results = checkAltAtributes($);
    
    expect(results[0]).toEqual({
      moduleName: 'Альтернативный текст',
      item: 'test.jpg',
      issue: 'Неинформативный alt',
      status: 'warning',
    });
  });

  it('должен вернуть success если все alt корректны', () => {
    const $ = load('<img src="test.jpg" alt="корректное описание">');
    const results = checkAltAtributes($);
    
    expect(results[0]).toEqual({
      moduleName: 'Альтернативный текст',
      item: 'Все изображения',
      issue: 'Ошибки не найдены',
      status: 'success',
    });
  });
});