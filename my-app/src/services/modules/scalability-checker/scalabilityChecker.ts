import { Page } from 'puppeteer';
import type {
  ModuleCheckResult,
  CheckStatus,
  CheckOptions,
} from '../../../types/types';

export const SCALE_FACTORS = [1.5, 2];
export const checkScalability = async (
  page: Page,
  options?: CheckOptions,
): Promise<ModuleCheckResult[]> => {
  try {
    const totalElements = await page.evaluate(() => {
      return Array.from(
        document.body.querySelectorAll<HTMLElement>('body *'),
      ).filter((el) => el.offsetParent !== null).length;
    });
    const results: ModuleCheckResult[] = await page.evaluate(
      (scaleFactors: number[]) => {
        const results: ModuleCheckResult[] = [];
        const seenItems = new Set<string>();

        const addResult = (
          item: string,
          issue: string,
          status: CheckStatus,
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
          elements.forEach((el) => {
            const originalTransform = el.style.transform;

            el.style.transformOrigin = 'top left';
            el.style.transform = `scale(${scale})`;

            const rect = el.getBoundingClientRect();
            const parent = el.parentElement;

            if (
              parent &&
              (rect.width > parent.clientWidth ||
                rect.height > parent.clientHeight)
            ) {
              addResult(
                el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
                `Элемент может обрезаться при масштабе ${scale * 100}%`,
                'warning',
              );
            }

            el.style.transform = originalTransform;
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
      totalElements,
    );

    return results;
  } catch (error) {
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
