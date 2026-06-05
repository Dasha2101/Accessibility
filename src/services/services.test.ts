import request from 'supertest';
import { initBrowser, createPage, safeGoto } from './browser/browser';
import { checkAltAtributes } from './modules/alt-checker/altChecker';
import { checkARIAAttributes } from './modules/aria-checker/ariaChecker';
import { checkContrast } from './modules/contrast-checker/contrastCheker';
import { checkKeyBoard } from './modules/keyboard-checker/keyboardChecker';
import { checkStructure } from './modules/structure-checker/structureChecker';
import { checkScalability } from './modules/scalability-checker/scalabilityChecker';
import { checkMedia } from './modules/media-checker/mediaChecker';
import axios from 'axios';
import * as cheerio from 'cheerio';

jest.mock('./browser/browser');
jest.mock('./modules/alt-checker/altChecker');
jest.mock('./modules/aria-checker/ariaChecker');
jest.mock('./modules/contrast-checker/contrastCheker');
jest.mock('./modules/keyboard-checker/keyboardChecker');
jest.mock('./modules/structure-checker/structureChecker');
jest.mock('./modules/scalability-checker/scalabilityChecker');
jest.mock('./modules/media-checker/mediaChecker');
jest.mock('axios');
jest.mock('cheerio');
jest.mock('../utils/limits/limits', () => ({
  getPageLimits: jest.fn().mockResolvedValue({ maxElements: 100 }),
}));

import { app } from './services';

describe('Server API', () => {
  const mockPage = {
    close: jest.fn().mockResolvedValue(undefined),
    waitForSelector: jest.fn().mockRejectedValue(new Error('Not found')),
    evaluate: jest.fn().mockResolvedValue({ maxElements: 100 }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (initBrowser as jest.Mock).mockResolvedValue(undefined);
    (createPage as jest.Mock).mockResolvedValue(mockPage);
    (safeGoto as jest.Mock).mockResolvedValue(undefined);
    (axios.get as jest.Mock).mockResolvedValue({ data: '<html></html>' });
    (cheerio.load as jest.Mock).mockReturnValue({});

    (checkAltAtributes as jest.Mock).mockReturnValue([]);
    (checkARIAAttributes as jest.Mock).mockReturnValue([]);
    (checkContrast as jest.Mock).mockResolvedValue([]);
    (checkKeyBoard as jest.Mock).mockResolvedValue([]);
    (checkStructure as jest.Mock).mockResolvedValue([]);
    (checkScalability as jest.Mock).mockResolvedValue([]);
    (checkMedia as jest.Mock).mockResolvedValue([]);
  });

  describe('POST /api/check-all', () => {
    it('должен вернуть ошибку если URL не указан', async () => {
      const response = await request(app).post('/api/check-all').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('URL не указан');
    });

    it('должен успешно проверить страницу', async () => {
      const response = await request(app)
        .post('/api/check-all')
        .send({ url: 'https://example.com' });

      expect(response.status).toBe(200);
      expect(axios.get).toHaveBeenCalledWith('https://example.com', {
        timeout: 60000,
      });
      expect(initBrowser).toHaveBeenCalled();
      expect(createPage).toHaveBeenCalled();
      expect(safeGoto).toHaveBeenCalledWith(mockPage, 'https://example.com');
    });

    it('должен вызвать все проверки', async () => {
      await request(app)
        .post('/api/check-all')
        .send({ url: 'https://example.com' });

      expect(checkAltAtributes).toHaveBeenCalled();
      expect(checkARIAAttributes).toHaveBeenCalled();
      expect(checkContrast).toHaveBeenCalled();
      expect(checkKeyBoard).toHaveBeenCalled();
      expect(checkStructure).toHaveBeenCalled();
      expect(checkScalability).toHaveBeenCalled();
      expect(checkMedia).toHaveBeenCalled();
    });

    it('должен вернуть ошибку 500 при проблеме', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .post('/api/check-all')
        .send({ url: 'https://example.com' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Ошибка проверки страницы');
    });

    it('должен закрыть страницу после проверки', async () => {
      await request(app)
        .post('/api/check-all')
        .send({ url: 'https://example.com' });

      expect(mockPage.close).toHaveBeenCalled();
    });
  });
});
