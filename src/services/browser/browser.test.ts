import { safeGoto } from './browser';
import type { Page } from 'puppeteer';

jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

describe('Browser module', () => {
  let mockPage: {
    goto: jest.Mock;
    on: jest.Mock;
    close: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockPage = {
      goto: jest.fn(),
      on: jest.fn(),
      close: jest.fn(),
    };
  });

  describe('safeGoto', () => {
    it('должен успешно перейти по URL', async () => {
      mockPage.goto.mockResolvedValue(undefined);

      await safeGoto(mockPage as unknown as Page, 'https://example.com');

      expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
    });

    it('должен выбросить ошибку при таймауте', async () => {
      mockPage.goto.mockImplementation(() => new Promise(() => {}));

      const promiseResult = safeGoto(
        mockPage as unknown as Page,
        'https://example.com',
      );

      await expect(promiseResult).rejects.toThrow('Page load timeout');
    }, 20000);
  });
});
