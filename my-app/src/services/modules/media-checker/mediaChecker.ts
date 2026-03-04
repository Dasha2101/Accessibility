import type { ModuleCheckResult, CheckStatus } from '../../../types';
import puppeteer from 'puppeteer';

export const checkMedia = async (url: string): Promise<ModuleCheckResult[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const results: ModuleCheckResult[] = await page.evaluate(() => {
    const results: ModuleCheckResult[] = [];
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video'));
    videos.forEach(video => {
      const tracks = Array.from(video.querySelectorAll('track[kind="subtitles"], track[kind="captions"]'));
      if (tracks.length === 0) {
        results.push({
          moduleName: 'Доступность мультимедиа',
          item: video.id ? `video#${video.id}` : 'video',
          issue: 'Нет субтитров/закрытых титров для видео',
          status: 'warning' as CheckStatus,
        });
      }
    });

    const audios = Array.from(document.querySelectorAll<HTMLAudioElement>('audio'));
    audios.forEach(audio => {
      const hasTranscription =
        audio.getAttribute('aria-describedby') ||
        audio.nextElementSibling?.tagName.toLowerCase() === 'div';
      if (!hasTranscription) {
        results.push({
          moduleName: 'Доступность мультимедиа',
          item: audio.id ? `audio#${audio.id}` : 'audio',
          issue: 'Нет транскрипта/описания аудио',
          status: 'warning' as CheckStatus,
        });
      }
    });

    return results;
  });

  await browser.close();
  return results;
};