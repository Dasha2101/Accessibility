import { getPageLimits } from './limits';
import type { Page } from 'puppeteer';

describe('getPageLimits', () => {
  let mockPage: {
    evaluate: jest.Mock;
  };

  beforeEach(() => {
    mockPage = {
      evaluate: jest.fn(),
    };
  });

  it('должен вернуть базовые лимиты для страницы с < 1500 элементов', async () => {
    mockPage.evaluate.mockResolvedValue({
      total: 1000,
      textElements: 100,
      images: 50,
      totalVideos: 0,
      totalAudios: 0,
    });

    const limits = await getPageLimits(mockPage as unknown as Page);

    expect(limits).toEqual({
      contrast: 120,
      keyboard: 72,
      structure: 60,
      scalability: 48,
      media: 0,
    });
  });

  it('должен вернуть лимиты для страницы с 1500-3000 элементами', async () => {
    mockPage.evaluate.mockResolvedValue({
      total: 2000,
      textElements: 200,
      images: 100,
      totalVideos: 0,
      totalAudios: 0,
    });

    const limits = await getPageLimits(mockPage as unknown as Page);

    expect(limits.contrast).toBe(100);
    expect(limits.keyboard).toBe(60);
    expect(limits.structure).toBe(50);
    expect(limits.scalability).toBe(40);
  });

  it('должен вернуть лимиты для страницы с 3000-5000 элементами', async () => {
    mockPage.evaluate.mockResolvedValue({
      total: 4000,
      textElements: 400,
      images: 200,
      totalVideos: 0,
      totalAudios: 0,
    });

    const limits = await getPageLimits(mockPage as unknown as Page);

    expect(limits.contrast).toBe(80);
    expect(limits.keyboard).toBe(48);
    expect(limits.structure).toBe(40);
    expect(limits.scalability).toBe(32);
  });

  it('должен вернуть лимиты для страницы с > 5000 элементами', async () => {
    mockPage.evaluate.mockResolvedValue({
      total: 6000,
      textElements: 600,
      images: 300,
      totalVideos: 0,
      totalAudios: 0,
    });

    const limits = await getPageLimits(mockPage as unknown as Page);

    expect(limits.contrast).toBe(60);
    expect(limits.keyboard).toBe(36);
    expect(limits.structure).toBe(30);
    expect(limits.scalability).toBe(24);
  });

  it('должен ограничить media лимит по количеству видео/аудио', async () => {
    mockPage.evaluate.mockResolvedValue({
      total: 1000,
      textElements: 100,
      images: 50,
      totalVideos: 100,
      totalAudios: 50,
    });

    const limits = await getPageLimits(mockPage as unknown as Page);
    expect(limits.media).toBe(60);
  });

  it('должен ограничить media по количеству элементов', async () => {
    mockPage.evaluate.mockResolvedValue({
      total: 1000,
      textElements: 100,
      images: 50,
      totalVideos: 10,
      totalAudios: 5,
    });

    const limits = await getPageLimits(mockPage as unknown as Page);
    expect(limits.media).toBe(15);
  });
});
