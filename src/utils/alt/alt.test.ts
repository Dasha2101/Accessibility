import { extractFromUrl, isAltSuspicious } from './alt';

describe('extractFromUrl', () => {
  test('возвращает null если нет src', () => {
    expect(extractFromUrl()).toBeNull();
  });

  test('достаёт название файла из url', () => {
    expect(extractFromUrl('https://site.com/img/cat-photo.jpg')).toBe(
      'cat photo',
    );
  });
});

describe('isAltSuspicious', () => {
  test('false если нет src', () => {
    expect(isAltSuspicious('кот', undefined)).toBe(false);
  });

  test('false если alt совпадает с url', () => {
    expect(
      isAltSuspicious(
        'cat photo',
        'https://site.com/img/cat-photo.jpg',
      ),
    ).toBe(false);
  });

  test('true если alt не совпадает с url', () => {
    expect(
      isAltSuspicious(
        'dog running',
        'https://site.com/img/cat-photo.jpg',
      ),
    ).toBe(true);
  });
});