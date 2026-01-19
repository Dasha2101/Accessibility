import type { ModuleCheckResult } from '../../types';

export const checkMedia = (): ModuleCheckResult[] => {
  const results: ModuleCheckResult[] = [];

  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video'));
  videos.forEach(video => {
    const tracks = Array.from(video.querySelectorAll('track[kind="subtitles"], track[kind="captions"]'));
    if (tracks.length === 0) {
      results.push({
        moduleName: 'Доступность мультимедиа',
        item: video.id ? `video#${video.id}` : 'video',
        issue: 'Нет субтитров/закрытых титров для видео',
        status: 'warning',
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
        status: 'warning',
      });
    }
  });

  return results;
}