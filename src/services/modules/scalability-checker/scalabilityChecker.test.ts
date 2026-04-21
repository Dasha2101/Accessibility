import { checkScalability } from './scalabilityChecker';
import type { ModuleCheckResult } from '../../../types/types';
import type { Page } from 'puppeteer';

describe('checkScalability', () => {
  const mockPage = {
    evaluate: jest.fn(),
  } as unknown as Page;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вернуть success если нет проблем с масштабированием', async () => {
    (mockPage.evaluate as jest.Mock)
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async (fn, scaleFactors, totalElements) => {
        const results: ModuleCheckResult[] = [];
        results.push({
          moduleName: 'Масштабируемость',
          item: 'Все элементы',
          issue: 'Ошибки не найдены',
          status: 'success',
        });
        return results;
      });

    const results = await checkScalability(mockPage);

    expect(results[0].status).toBe('success');
    expect(results[0].issue).toBe('Ошибки не найдены');
  });

  it('должен вернуть warning если элемент обрезается при масштабе 150%', async () => {
    (mockPage.evaluate as jest.Mock)
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async (fn, scaleFactors, totalElements) => {
        return [
          {
            moduleName: 'Масштабируемость',
            item: 'div#container',
            issue: 'Элемент может обрезаться при масштабе 150%',
            status: 'warning',
          },
        ];
      });

    const results = await checkScalability(mockPage);

    expect(results[0].status).toBe('warning');
    expect(results[0].issue).toBe('Элемент может обрезаться при масштабе 150%');
  });

  it('должен вернуть warning если элемент обрезается при масштабе 200%', async () => {
    (mockPage.evaluate as jest.Mock)
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async (fn, scaleFactors, totalElements) => {
        return [
          {
            moduleName: 'Масштабируемость',
            item: 'button',
            issue: 'Элемент может обрезаться при масштабе 200%',
            status: 'warning',
          },
        ];
      });

    const results = await checkScalability(mockPage);

    expect(results[0].status).toBe('warning');
    expect(results[0].issue).toBe('Элемент может обрезаться при масштабе 200%');
  });

  it('должен вернуть error при ошибке выполнения', async () => {
    (mockPage.evaluate as jest.Mock).mockRejectedValue(
      new Error('Puppeteer error'),
    );

    const results = await checkScalability(mockPage);

    expect(results[0]).toEqual({
      moduleName: 'Масштабируемость',
      item: 'Ошибка',
      issue: 'Не удалось выполнить проверку масштабируемости',
      status: 'error',
    });
  });
});
