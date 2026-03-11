import type { ModuleCheckResult, CheckStatus } from '../../../types/types';
import puppeteer from 'puppeteer';

export const SCALE_FACTORS = [1.5, 2];

export const checkScalability = async (
  url: string,
): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const results: ModuleCheckResult[] = await page.evaluate(
    (scaleFactors: number[]) => {
      const results: ModuleCheckResult[] = [];
      const elements = Array.from(
        document.body.querySelectorAll<HTMLElement>('body *'),
      ).filter((el) => el.offsetParent !== null);

      scaleFactors.forEach((scale) => {
        elements.forEach((el) => {
          const originalTransform = el.style.transform;
          el.style.transformOrigin = 'top left';
          el.style.transform = `scale(${scale})`;

          const scaledRect = el.getBoundingClientRect();
          const parent = el.parentElement;

          if (
            parent &&
            (scaledRect.width > parent.clientWidth ||
              scaledRect.height > parent.clientHeight)
          ) {
            results.push({
              moduleName: 'Масштабируемость',
              item: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
              issue: `Элемент может обрезаться при масштабе ${scale * 100}%`,
              status: 'warning' as CheckStatus,
            });
          }

          el.style.transform = originalTransform;
        });
      });

      return results;
    },
    SCALE_FACTORS,
  );

  await browser.close();
  return results;
};
