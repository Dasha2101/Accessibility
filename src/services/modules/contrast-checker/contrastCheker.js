import { getContrastRatio, rgbToHex } from '../../../utils/contrast/contrast';
const MIN_CONTRAST_RATIO_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_RATIO_LARGE_TEXT = 3;
export const checkContrast = async (page, options) => {
  try {
    const elementsData = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button'),
      );
      return elements.map((el) => {
        const style = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          id: el.id,
          className: el.className,
          textColor: style.color,
          bgColor: style.backgroundColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
        };
      });
    });
    const results = [];
    const seenItems = new Set();
    elementsData.forEach((el) => {
      const ratio = getContrastRatio(
        rgbToHex(el.textColor),
        rgbToHex(el.bgColor),
      );
      const fontSize = parseFloat(el.fontSize);
      const isLargeText =
        fontSize >= 18 || (fontSize >= 14 && el.fontWeight === 'bold');
      const required = isLargeText
        ? MIN_CONTRAST_RATIO_LARGE_TEXT
        : MIN_CONTRAST_RATIO_NORMAL_TEXT;
      if (ratio < required) {
        const key =
          el.tag.toLowerCase() +
          (el.id ? `#${el.id}` : '') +
          (el.className ? `.${el.className}` : '');
        if (!seenItems.has(key)) {
          results.push({
            moduleName: 'Цветовая контрастность',
            item: key,
            issue: `Контраст ${ratio.toFixed(2)} (норма ≥ ${required})`,
            status: 'warning',
          });
          seenItems.add(key);
        }
      }
    });
    if (results.length === 0) {
      results.push({
        moduleName: 'Цветовая контрастность',
        item: 'Все элементы',
        issue: 'Ошибки не найдены',
        status: 'success',
      });
    }
    return results;
  } catch {
    return [
      {
        moduleName: 'Цветовая контрастность',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку контрастности',
        status: 'error',
      },
    ];
  }
};
