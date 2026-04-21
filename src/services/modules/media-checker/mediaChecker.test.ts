import { checkMedia } from "./mediaChecker";
import type { ModuleCheckResult } from '../../../types/types';
import type { Page } from 'puppeteer';

describe('checkMedia', () => {
  const mockPage = {
    evaluate: jest.fn(),
} as unknown as Page;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вернуть success если нет видео и аудио', async () => {
    (mockPage.evaluate as jest.Mock)
      .mockResolvedValueOnce({ mediaCount: 0, visibleElements: 10 })
      .mockImplementationOnce(async (fn, totalMedia) => {
        const results: ModuleCheckResult[] = [];
        results.push({
          moduleName: 'Доступность мультимедиа',
          item: 'Все элементы',
          issue: 'Ошибки не найдены',
          status: 'success',
        });
        return results;
      });

    const results = await checkMedia(mockPage);
    
    expect(results[0].status).toBe('success');
    expect(results[0].issue).toBe('Ошибки не найдены');
  });

  it('должен вернуть warning для видео без субтитров', async () => {
    (mockPage.evaluate as jest.Mock)
      .mockResolvedValueOnce({ mediaCount: 1, visibleElements: 10 })
      .mockImplementationOnce(async (fn, totalMedia) => {
        return [{
          moduleName: 'Доступность мультимедиа',
          item: 'video',
          issue: 'Нет субтитров/закрытых титров',
          status: 'warning',
        }];
      });

    const results = await checkMedia(mockPage);
    
    expect(results[0].status).toBe('warning');
    expect(results[0].issue).toBe('Нет субтитров/закрытых титров');
  });

  it('должен вернуть warning для аудио без транскрипта', async () => {
    (mockPage.evaluate as jest.Mock)
      .mockResolvedValueOnce({ mediaCount: 1, visibleElements: 10 })
      .mockImplementationOnce(async (fn, totalMedia) => {
        return [{
          moduleName: 'Доступность мультимедиа',
          item: 'audio',
          issue: 'Нет транскрипта/описания аудио',
          status: 'warning',
        }];
      });

    const results = await checkMedia(mockPage);
    
    expect(results[0].status).toBe('warning');
    expect(results[0].issue).toBe('Нет транскрипта/описания аудио');
  });

  it('должен вернуть error при ошибке выполнения', async () => {
    (mockPage.evaluate as jest.Mock).mockRejectedValue(new Error('Puppeteer error'));

    const results = await checkMedia(mockPage);
    
    expect(results[0]).toEqual({
      moduleName: 'Доступность мультимедиа',
      item: 'Ошибка',
      issue: 'Не удалось выполнить проверку',
      status: 'error',
    });
  });
});