import { getContrastRatio } from '../../../utils/contrast/contrast';
import puppeteer from 'puppeteer';
import type { CheckStatus, ModuleCheckResult } from '../../../types';

const MIN_CONTRAST_RATIO_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_RATIO_LARGE_TEXT = 3;

export const checkContrast = async (url: string): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.exposeFunction('getContrastRatio', getContrastRatio);

  const results: ModuleCheckResult[] = await page.evaluate(
    (minNormal, minLarge) => {
      const elements = Array.from(
        document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button')
      ) as HTMLElement[];

      return elements.map(el => {
        const style = window.getComputedStyle(el);
        const textColor = style.color;
        const bgColor = style.backgroundColor;

        const fontSize = parseFloat(style.fontSize);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && style.fontWeight === 'bold');
        const required = isLargeText ? minLarge : minNormal;

        const ratio = window.getContrastRatio(textColor, bgColor);

        const passed = ratio >= required;

        return {
          moduleName: 'Цветовая контрастность',
          item:
            el.tagName.toLowerCase() +
            (el.id ? `#${el.id}` : '') +
            (el.className ? `.${el.className}` : ''),
          issue: `Контраст ${ratio.toFixed(2)} (норма ≥ ${required})`,
          status: (passed ? 'ok' : 'warning') as CheckStatus,
        };
      });
    },
    MIN_CONTRAST_RATIO_NORMAL_TEXT,
    MIN_CONTRAST_RATIO_LARGE_TEXT
  );

  await browser.close();
  return results;
};