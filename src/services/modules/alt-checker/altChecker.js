const GENERIC_ALT_VALUES = ['image', 'photo', 'picture', 'img'];
export const checkAltAtributes = ($, options) => {
  const allImages = $('img');
  const results = [];
  allImages.each((_, img) => {
    const alt = $(img).attr('alt');
    const src = $(img).attr('src') ?? 'Не указан src';
    if (alt === undefined) {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'Отсутствует атрибут alt',
        status: 'error',
      });
      return;
    }

    const altTrim = alt.trim().toLowerCase();
    if (altTrim === '') {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'Пустой alt',
        status: 'error',
      });
      return;
    }
    if (GENERIC_ALT_VALUES.includes(altTrim)) {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'Неинформативный alt',
        status: 'warning',
      });
      return;
    }
    if (altTrim.length < 3) {
      results.push({
        moduleName: 'Альтернативный текст',
        item: src,
        issue: 'alt слишком короткий, возможно неинформативный',
        status: 'warning',
      });
    }
  });
  if (results.length === 0) {
    results.push({
      moduleName: 'Альтернативный текст',
      item: 'Все изображения',
      issue: 'Ошибки не найдены',
      status: 'success',
    });
  }
  return results;
};
