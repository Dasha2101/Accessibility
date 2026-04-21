import { checkStructure } from './structureChecker';
import type { ModuleCheckResult } from '../../../types/types';
import type { Page } from 'puppeteer';

describe('checkStructure', () => {
  const mockPage = {
    evaluate: jest.fn(),
  } as unknown as jest.Mocked<Page>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вернуть success если нет ошибок', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        const results: ModuleCheckResult[] = [];
        results.push({
          moduleName: 'Структура интерфейса',
          item: 'Все элементы',
          issue: 'Ошибки не найдены',
          status: 'success',
        });
        return results;
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('success');
  });

  it('должен вернуть error для пустого заголовка', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        return [
          {
            moduleName: 'Структура интерфейса',
            item: 'h1',
            issue: 'Заголовок пустой',
            status: 'error',
          },
        ];
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('error');
    expect(results[0].issue).toBe('Заголовок пустой');
  });

  it('должен вернуть warning при пропуске уровня заголовка', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        return [
          {
            moduleName: 'Структура интерфейса',
            item: 'h3',
            issue: 'Пропущен уровень заголовка (предыдущий h1)',
            status: 'warning',
          },
        ];
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('warning');
  });

  it('должен вернуть warning при отсутствии тега main', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        return [
          {
            moduleName: 'Структура интерфейса',
            item: 'body',
            issue: 'Отсутствует тег <main>',
            status: 'warning',
          },
        ];
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('warning');
    expect(results[0].issue).toBe('Отсутствует тег <main>');
  });

  it('должен вернуть error если список содержит не li', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        return [
          {
            moduleName: 'Структура интерфейса',
            item: 'ul',
            issue: 'Список содержит элемент, не являющийся <li>',
            status: 'error',
          },
        ];
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('error');
  });

  it('должен вернуть warning если таблица без thead/tbody', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        return [
          {
            moduleName: 'Структура интерфейса',
            item: 'table',
            issue: 'Таблица должна содержать <thead> и <tbody>',
            status: 'warning',
          },
        ];
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('warning');
  });

  it('должен вернуть warning если таблица без th', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        return [
          {
            moduleName: 'Структура интерфейса',
            item: 'table',
            issue: 'Таблица должна содержать хотя бы один <th>',
            status: 'warning',
          },
        ];
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('warning');
  });

  it('должен вернуть error если поле формы без label', async () => {
    mockPage.evaluate
      .mockResolvedValueOnce(10)
      .mockImplementationOnce(async () => {
        return [
          {
            moduleName: 'Структура интерфейса',
            item: 'input',
            issue: 'Поле формы без связанного <label>',
            status: 'error',
          },
        ];
      });

    const results = await checkStructure(mockPage);

    expect(results[0].status).toBe('error');
  });

  it('должен вернуть error при ошибке выполнения', async () => {
    mockPage.evaluate.mockRejectedValue(new Error('Puppeteer error'));

    const results = await checkStructure(mockPage);

    expect(results[0]).toEqual({
      moduleName: 'Структура интерфейса',
      item: 'Ошибка',
      issue: 'Не удалось выполнить проверку структуры интерфейса',
      status: 'error',
    });
  });
});
