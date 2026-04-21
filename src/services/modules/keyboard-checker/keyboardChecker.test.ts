import { checkKeyBoard } from "./keyboardChecker";
import { ModuleCheckResult } from "../../../types/types";
import type { Page } from 'puppeteer';

jest.mock('../../../utils/keyboard/keyboard', () => ({
  INTERACTIVE_SELECTORS: [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[onclick]',
  ],
}));

describe('checkKeyBoard', () => {
  const mockPage = {
    evaluate: jest.fn(),
  } as unknown as jest.Mocked<Page>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вернуть success если нет ошибок', async () => {
    (mockPage.evaluate as jest.Mock).mockImplementation(async (fn, selectors) => {
      const results: ModuleCheckResult[] = [];
      results.push({
        moduleName: 'Клавиатурная навигация',
        item: 'Все элементы',
        issue: 'Ошибки не найдены',
        status: 'success',
      });
      return results;
    });

    const results = await checkKeyBoard(mockPage);
    
    expect(results[0].status).toBe('success');
    expect(results[0].issue).toBe('Ошибки не найдены');
  });

  it('должен вернуть error если скрытый элемент доступен для фокуса', async () => {
    (mockPage.evaluate as jest.Mock).mockImplementation(async (fn, selectors) => {
      return [{
        moduleName: 'Клавиатурная навигация',
        item: 'hidden-button',
        issue: 'Элемент скрыт, но доступен для фокуса',
        status: 'error',
      }];
    });

    const results = await checkKeyBoard(mockPage);
    
    expect(results[0].status).toBe('error');
    expect(results[0].issue).toBe('Элемент скрыт, но доступен для фокуса');
  });

  it('должен вернуть error если элемент недоступен с клавиатуры', async () => {
    (mockPage.evaluate as jest.Mock).mockImplementation(async (fn, selectors) => {
      return [{
        moduleName: 'Клавиатурная навигация',
        item: 'div',
        issue: 'Элемент недоступен с клавиатуры',
        status: 'error',
      }];
    });

    const results = await checkKeyBoard(mockPage);
    
    expect(results[0].status).toBe('error');
    expect(results[0].issue).toBe('Элемент недоступен с клавиатуры');
  });

  it('должен вернуть warning для tabindex > 0', async () => {
    (mockPage.evaluate as jest.Mock).mockImplementation(async (fn, selectors) => {
      return [{
        moduleName: 'Клавиатурная навигация',
        item: 'element',
        issue: 'tabindex > 0 нарушает порядок фокуса',
        status: 'warning',
      }];
    });

    const results = await checkKeyBoard(mockPage);
    
    expect(results[0].status).toBe('warning');
  });

  it('должен вернуть warning если нет видимого индикатора фокуса', async () => {
    (mockPage.evaluate as jest.Mock).mockImplementation(async (fn, selectors) => {
      return [{
        moduleName: 'Клавиатурная навигация',
        item: 'button',
        issue: 'Фокус не имеет видимого индикатора',
        status: 'warning',
      }];
    });

    const results = await checkKeyBoard(mockPage);
    
    expect(results[0].status).toBe('warning');
  });

  it('должен вернуть error при ошибке выполнения', async () => {
    (mockPage.evaluate as jest.Mock).mockRejectedValue(new Error('Puppeteer error'));

    const results = await checkKeyBoard(mockPage);
    
    expect(results[0]).toEqual({
      moduleName: 'Клавиатурная навигация',
      item: 'Ошибка',
      issue: 'Не удалось выполнить проверку клавиатурной навигации',
      status: 'error',
    });
  });
});