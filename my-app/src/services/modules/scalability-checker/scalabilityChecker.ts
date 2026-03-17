// import type {
//   ModuleCheckResult,
//   CheckStatus,
//   CheckOptions,
// } from '../../../types/types';
// import puppeteer from 'puppeteer';

// export const SCALE_FACTORS = [1.5, 2];

// const DEFAULT_MAX = 20;
// const HEAVY_PAGE_MAX = 10;

// export const checkScalability = async (
//   url: string,
//   options?: CheckOptions,
// ): Promise<ModuleCheckResult[]> => {
//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });

//   try {
//     const page = await browser.newPage();

//     await page.goto(url, {
//       waitUntil: 'domcontentloaded',
//       timeout: 30000,
//     });
//     const totalElements = await page.evaluate(() => {
//       return Array.from(
//         document.body.querySelectorAll<HTMLElement>('body *'),
//       ).filter((el) => el.offsetParent !== null).length;
//     });

//     const maxElements =
//       options?.maxElements ??
//       (totalElements > 1000 ? HEAVY_PAGE_MAX : DEFAULT_MAX);

//     const results: ModuleCheckResult[] = await page.evaluate(
//       (scaleFactors: number[], max: number) => {
//         const results: ModuleCheckResult[] = [];
//         const seenItems = new Set<string>();
//         const addResult = (
//           item: string,
//           issue: string,
//           status: CheckStatus,
//         ) => {
//           const key = `${item}-${issue}`;
//           if (!seenItems.has(key)) {
//             results.push({
//               moduleName: 'Масштабируемость',
//               item,
//               issue,
//               status,
//             });
//             seenItems.add(key);
//           }
//         };

//         const elements = Array.from(
//           document.body.querySelectorAll<HTMLElement>('body *'),
//         )
//           .filter((el) => el.offsetParent !== null)
//           .slice(0, max);

//         scaleFactors.forEach((scale) => {
//           elements.forEach((el) => {
//             const originalTransform = el.style.transform;
//             el.style.transformOrigin = 'top left';
//             el.style.transform = `scale(${scale})`;

//             const scaledRect = el.getBoundingClientRect();
//             const parent = el.parentElement;

//             if (
//               parent &&
//               (scaledRect.width > parent.clientWidth ||
//                 scaledRect.height > parent.clientHeight)
//             ) {
//               addResult(
//                 el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
//                 `Элемент может обрезаться при масштабе ${scale * 100}%`,
//                 'warning',
//               );
//             }

//             el.style.transform = originalTransform;
//           });
//         });

//         if (elements.length < totalElements) {
//           addResult(
//             'Общий результат',
//             `Проверено только ${elements.length} из ${totalElements} элементов`,
//             'warning',
//           );
//         }

//         if (results.length === 0) {
//           results.push({
//             moduleName: 'Масштабируемость',
//             item: 'Все элементы',
//             issue: 'Ошибки не найдены',
//             status: 'success',
//           });
//         }

//         return results;
//       },
//       SCALE_FACTORS,
//       maxElements,
//     );

//     return results;
//   } catch (error) {
//     return [
//       {
//         moduleName: 'Масштабируемость',
//         item: 'Ошибка',
//         issue: 'Не удалось выполнить проверку масштабируемости',
//         status: 'error' as CheckStatus,
//       },
//     ];
//   } finally {
//     await browser.close();
//   }
// };
