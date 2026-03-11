import {
  getContrastRatio,
  rgbToHex,
} from '../../../utils/contrast/contrast.ts';
import puppeteer from 'puppeteer';
import type { CheckStatus, ModuleCheckResult } from '../../../types';

const MIN_CONTRAST_RATIO_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_RATIO_LARGE_TEXT = 3;

export const checkContrast = async (
  url: string,
): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  const elementsData = await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button'),
    ) as HTMLElement[];

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

  await browser.close();

  const results: ModuleCheckResult[] = elementsData.map((el) => {
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
    const passed = ratio >= required;

    return {
      moduleName: 'Цветовая контрастность',
      item:
        el.tag.toLowerCase() +
        (el.id ? `#${el.id}` : '') +
        (el.className ? `.${el.className}` : ''),
      issue: `Контраст ${ratio.toFixed(2)} (норма ≥ ${required})`,
      status: (passed ? 'ok' : 'warning') as CheckStatus,
    };
  });

  return results;
};
