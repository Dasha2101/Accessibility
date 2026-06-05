import { Page } from 'puppeteer';
import type { ModuleCheckResult, CheckStatus } from '../../../types/types';

export const SCALE_FACTORS = [1.5, 2];
export const checkScalability = async (
  page: Page,
): Promise<ModuleCheckResult[]> => {
  try {
    const results: ModuleCheckResult[] = await page.evaluate(
      (scaleFactors: number[]) => {
        const results: {
          moduleName: string;
          item: string;
          issue: string;
          status: 'success' | 'warning' | 'error';
        }[] = [];

        const seenItems = new Set<string>();

        const addResult = (
          item: string,
          issue: string,
          status: 'success' | 'warning' | 'error',
        ) => {
          const key = `${item}-${issue}-${status}`;

          if (!seenItems.has(key)) {
            results.push({
              moduleName: 'Масштабируемость',
              item,
              issue,
              status,
            });

            seenItems.add(key);
          }
        };
        const elements = Array.from(
          document.body.querySelectorAll<HTMLElement>('body *'),
        ).filter((el) => el.offsetParent !== null);

        scaleFactors.forEach((scale) => {
          elements.forEach((element) => {
            const originalTransform = element.style.transform;
            const originalTransformOrigin = element.style.transformOrigin;

            element.style.transformOrigin = 'top left';
            element.style.transform = `scale(${scale})`;

            const rect = element.getBoundingClientRect();
            const parent = element.parentElement;

            if (parent) {
              const parentStyle = window.getComputedStyle(parent);

              const hasClipping =
                parentStyle.overflow === 'hidden' ||
                parentStyle.overflowX === 'hidden' ||
                parentStyle.overflowY === 'hidden';

              if (
                hasClipping &&
                (rect.width > parent.clientWidth ||
                  rect.height > parent.clientHeight)
              ) {
                addResult(
                  element.tagName.toLowerCase() +
                    (element.id ? `#${element.id}` : ''),
                  `Элемент может обрезаться при масштабе ${scale * 100}%`,
                  'warning',
                );
              }
            }

            element.style.transform = originalTransform;
            element.style.transformOrigin = originalTransformOrigin;
          });
        });
        if (results.length === 0) {
          results.push({
            moduleName: 'Масштабируемость',
            item: 'Все элементы',
            issue: 'Ошибки не найдены',
            status: 'success',
          });
        }

        return results;
      },
      SCALE_FACTORS,
    );

    return results;
  } catch {
    return [
      {
        moduleName: 'Масштабируемость',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку масштабируемости',
        status: 'error',
      },
    ];
  }
};
