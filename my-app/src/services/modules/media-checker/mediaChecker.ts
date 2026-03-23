import { Page } from 'puppeteer';
import type {
  ModuleCheckResult,
  CheckStatus,
  CheckOptions,
} from '../../../types/types';

export const checkMedia = async (
  page: Page,
  options?: CheckOptions,
): Promise<ModuleCheckResult[]> => {
  try {
    const totalData = await page.evaluate(() => {
      const mediaCount =
        document.querySelectorAll('video').length +
        document.querySelectorAll('audio').length;
      const visibleElements = Array.from(
        document.body.querySelectorAll<HTMLElement>('body *'),
      ).filter((el) => el.offsetParent !== null).length;

      return { mediaCount, visibleElements };
    });

    const results: ModuleCheckResult[] = await page.evaluate(
      (totalMedia: number) => {
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
        );

        const audios = Array.from(
          document.querySelectorAll<HTMLAudioElement>('audio'),
        );

        videos.forEach((video) => {
          const tracks = video.querySelectorAll(
            'track[kind="subtitles"], track[kind="captions"]',
          );

          if (!tracks.length) {
            addResult(
              video.id ? `video#${video.id}` : 'video',
              'Нет субтитров/закрытых титров',
              'warning',
            );
          }
        });

        audios.forEach((audio) => {
          const hasTranscription =
            audio.getAttribute('aria-describedby') ||
            audio.nextElementSibling?.tagName.toLowerCase() === 'div';

          if (!hasTranscription) {
            addResult(
              audio.id ? `audio#${audio.id}` : 'audio',
              'Нет транскрипта/описания аудио',
              'warning',
            );
          }
        });

        if (results.length === 0 && totalMedia > 0) {
          results.push({
            moduleName: 'Доступность мультимедиа',
            item: 'Все элементы',
            issue: 'Ошибки не найдены',
            status: 'success',
          });
        }

        return results;
      },
      totalData.mediaCount,
    );

    return results;
  } catch (error) {
    return [
      {
        moduleName: 'Доступность мультимедиа',
        item: 'Ошибка',
        issue: 'Не удалось выполнить проверку',
        status: 'error',
      },
    ];
  }
};
