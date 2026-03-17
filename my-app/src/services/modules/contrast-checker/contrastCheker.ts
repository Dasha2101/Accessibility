import { getContrastRatio, rgbToHex } from '../../../utils/contrast/contrast';
import puppeteer from 'puppeteer';
import type {
  CheckStatus,
  ModuleCheckResult,
  CheckOptions,
} from '../../../types/types.ts';

const DEFAULT_MAX = 15;
const HEAVY_PAGE_MAX = 10;

const MIN_CONTRAST_RATIO_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_RATIO_LARGE_TEXT = 3;

export const checkContrast = async (
  url: string,
  options?: CheckOptions,
): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    const totalElements = await page.evaluate(
      () =>
        document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button')
          .length,
    );

    const maxElements =
      options?.maxElements ??
      (totalElements > 1000 ? HEAVY_PAGE_MAX : DEFAULT_MAX);

    const elementsData = await page.evaluate((max) => {
      const elements = Array.from(
        document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button'),
      ).slice(0, max) as HTMLElement[];

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
    }, maxElements);

    const results: ModuleCheckResult[] = [];
    const seenItems = new Set<string>();

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
            status: 'warning' as CheckStatus,
          });
          seenItems.add(key);
        }
      }
    });

    if (totalElements > maxElements) {
      results.push({
        moduleName: 'Цветовая контрастность',
        item: 'Общий результат',
        issue: `Проверено только ${maxElements} из ${totalElements} элементов`,
        status: 'warning' as CheckStatus,
      });
    }

    if (results.length === 0) {
      results.push({
        moduleName: 'Цветовая контрастность',
        item: 'Все элементы',
        issue: 'Ошибки не найдены',
        status: 'success',
      });
    }

    return results;
  } catch (error) {
    return [
      {
        moduleName: 'Цветовая контрастность',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку контрастности',
        status: 'error' as CheckStatus,
      },
    ];
  } finally {
    await browser.close();
  }
};
