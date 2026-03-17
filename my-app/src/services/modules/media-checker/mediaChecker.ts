import type {
  ModuleCheckResult,
  CheckStatus,
  CheckOptions,
} from '../../../types/types';
import puppeteer from 'puppeteer';

export const SCALE_FACTORS = [1.5, 2];

const DEFAULT_MAX = 50;
const HEAVY_PAGE_MAX = 20;

export const checkFullPageDynamic = async (
  url: string,
  options?: CheckOptions,
): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Получаем количество элементов и медиа на странице
    const totalElements = await page.evaluate(() => {
      const mediaCount =
        document.querySelectorAll('video').length +
        document.querySelectorAll('audio').length;

      const visibleElements = Array.from(
        document.body.querySelectorAll<HTMLElement>('body *'),
      ).filter((el) => el.offsetParent !== null).length;

      return { mediaCount, visibleElements };
    });

    const maxElements =
      options?.maxElements ??
      (totalElements.visibleElements > 1000 ? HEAVY_PAGE_MAX : DEFAULT_MAX);

    const results: ModuleCheckResult[] = [];

    // --- 1. Проверка структуры интерфейса ---
    try {
      const structureResults: ModuleCheckResult[] = await page.evaluate(
        (max: number) => {
          const results: ModuleCheckResult[] = [];
          const seenItems = new Set<string>();
          const addResult = (
            item: string,
            issue: string,
            status: CheckStatus,
          ) => {
            const key = `${item}-${issue}`;
            if (!seenItems.has(key)) {
              results.push({
                moduleName: 'Структура интерфейса',
                item,
                issue,
                status,
              });
              seenItems.add(key);
            }
          };

          const elements = Array.from(
            document.body.querySelectorAll<HTMLElement>('body *'),
          ).slice(0, max);

          // Заголовки
          let lastLevel = 0;
          elements
            .filter((el) => /^H[1-6]$/.test(el.tagName))
            .forEach((el) => {
              const level = parseInt(el.tagName[1], 10);
              const text = el.textContent?.trim() || '[пустой заголовок]';
              if (!text)
                addResult(
                  el.tagName.toLowerCase(),
                  'Заголовок пустой',
                  'error',
                );
              if (lastLevel && level - lastLevel > 1)
                addResult(
                  el.tagName.toLowerCase(),
                  `Пропущен уровень заголовка (предыдущий h${lastLevel})`,
                  'warning',
                );
              lastLevel = level;
            });

          // Основные семантические теги
          ['main', 'header', 'footer', 'nav'].forEach((tag) => {
            if (!document.querySelector(tag))
              addResult('body', `Отсутствует тег <${tag}>`, 'warning');
          });

          // Списки
          elements
            .filter((el) => ['UL', 'OL'].includes(el.tagName))
            .forEach((list) => {
              Array.from(list.children).forEach((li) => {
                if (li.tagName.toLowerCase() !== 'li')
                  addResult(
                    list.tagName.toLowerCase(),
                    'Список содержит элемент, не являющийся <li>',
                    'error',
                  );
              });
            });

          // Таблицы
          elements
            .filter((el) => el.tagName === 'TABLE')
            .forEach((table) => {
              if (
                !table.querySelector('thead') ||
                !table.querySelector('tbody')
              )
                addResult(
                  'table',
                  'Таблица должна содержать <thead> и <tbody>',
                  'warning',
                );
              if (table.querySelectorAll('th').length === 0)
                addResult(
                  'table',
                  'Таблица должна содержать хотя бы один <th>',
                  'warning',
                );
            });

          // Поля форм
          elements
            .filter((el) =>
              ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName),
            )
            .forEach((input) => {
              const id = input.getAttribute('id');
              const hasLabel =
                (id && document.querySelector(`label[for="${id}"]`)) ||
                input.closest('label');
              if (!hasLabel)
                addResult(
                  input.tagName.toLowerCase(),
                  'Поле формы без связанного <label>',
                  'error',
                );
            });

          // ARIA элементы
          elements
            .filter(
              (el) =>
                el.hasAttribute('role') ||
                el.hasAttribute('aria-label') ||
                el.hasAttribute('aria-labelledby') ||
                el.hasAttribute('aria-hidden'),
            )
            .forEach((el) => {
              const role = el.getAttribute('role');
              if (role === 'presentation' && el.children.length > 0)
                addResult(
                  el.tagName.toLowerCase(),
                  'role="presentation" с вложенными элементами может скрывать контент',
                  'warning',
                );
            });

          if (results.length === 0)
            results.push({
              moduleName: 'Структура интерфейса',
              item: 'Все элементы',
              issue: 'Ошибки не найдены',
              status: 'success',
            });

          return results;
        },
        maxElements,
      );

      results.push(...structureResults);
    } catch (err) {
      results.push({
        moduleName: 'Структура интерфейса',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку',
        status: 'error',
      });
    }

    // --- 2. Проверка медиа ---
    try {
      const mediaResults: ModuleCheckResult[] = await page.evaluate(
        (max: number) => {
          const results: ModuleCheckResult[] = [];
          const seenItems = new Set<string>();
          const addResult = (
            item: string,
            issue: string,
            status: CheckStatus,
          ) => {
            const key = `${item}-${issue}`;
            if (!seenItems.has(key)) {
              results.push({
                moduleName: 'Доступность мультимедиа',
                item,
                issue,
                status,
              });
              seenItems.add(key);
            }
          };

          const videos = Array.from(
            document.querySelectorAll<HTMLVideoElement>('video'),
          ).slice(0, max);
          videos.forEach((video) => {
            const tracks = Array.from(
              video.querySelectorAll(
                'track[kind="subtitles"], track[kind="captions"]',
              ),
            );
            if (tracks.length === 0)
              addResult(
                video.id ? `video#${video.id}` : 'video',
                'Нет субтитров/закрытых титров для видео',
                'warning',
              );
          });

          const audios = Array.from(
            document.querySelectorAll<HTMLAudioElement>('audio'),
          ).slice(0, max);
          audios.forEach((audio) => {
            const hasTranscription =
              audio.getAttribute('aria-describedby') ||
              audio.nextElementSibling?.tagName.toLowerCase() === 'div';
            if (!hasTranscription)
              addResult(
                audio.id ? `audio#${audio.id}` : 'audio',
                'Нет транскрипта/описания аудио',
                'warning',
              );
          });

          if (videos.length === 0 && audios.length === 0)
            addResult('Все элементы', 'Ошибки не найдены', 'success');

          return results;
        },
        maxElements,
      );

      results.push(...mediaResults);
    } catch (err) {
      results.push({
        moduleName: 'Доступность мультимедиа',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку',
        status: 'error',
      });
    }

    // --- 3. Проверка масштабируемости ---
    try {
      const scaleResults: ModuleCheckResult[] = await page.evaluate(
        (scaleFactors: number[], max: number) => {
          const results: ModuleCheckResult[] = [];
          const seenItems = new Set<string>();
          const addResult = (
            item: string,
            issue: string,
            status: CheckStatus,
          ) => {
            const key = `${item}-${issue}`;
            if (!seenItems.has(key))
              (results.push({
                moduleName: 'Масштабируемость',
                item,
                issue,
                status,
              }),
                seenItems.add(key));
          };

          const elements = Array.from(
            document.body.querySelectorAll<HTMLElement>('body *'),
          )
            .filter((el) => el.offsetParent !== null)
            .slice(0, max);

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
              )
                addResult(
                  el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
                  `Элемент может обрезаться при масштабе ${scale * 100}%`,
                  'warning',
                );

              el.style.transform = originalTransform;
            });
          });

          if (!results.length)
            results.push({
              moduleName: 'Масштабируемость',
              item: 'Все элементы',
              issue: 'Ошибки не найдены',
              status: 'success',
            });
          return results;
        },
        SCALE_FACTORS,
        maxElements,
      );

      results.push(...scaleResults);
    } catch (err) {
      results.push({
        moduleName: 'Масштабируемость',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку',
        status: 'error',
      });
    }

    return results;
  } catch (error) {
    return [
      {
        moduleName: 'FullPageDynamic',
        item: 'Ошибка',
        issue: 'Не удалось открыть страницу',
        status: 'error' as CheckStatus,
      },
    ];
  } finally {
    await browser.close();
  }
};
