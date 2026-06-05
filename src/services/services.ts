import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
export { app };

import { initBrowser, createPage, safeGoto } from './browser/browser';

import { checkAltAtributes } from './modules/alt-checker/altChecker';
import { checkContrast } from './modules/contrast-checker/contrastCheker';
import { checkKeyBoard } from './modules/keyboard-checker/keyboardChecker';
import { checkStructure } from './modules/structure-checker/structureChecker';
import { checkScalability } from './modules/scalability-checker/scalabilityChecker';
import { checkARIAAttributes } from './modules/aria-checker/ariaChecker';
import { checkMedia } from './modules/media-checker/mediaChecker';

import type { ModuleCheckResult } from '../types/types';


const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/check', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL не указан' });
  }

  let page = null;
  const results: ModuleCheckResult[] = [];

  let htmlDOM = null;

  try {
    await initBrowser();
    page = await createPage();

    try {
      const { data: html } = await axios.get(url, {
        timeout: 60000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36',
        },
      });

      htmlDOM = cheerio.load(html);
    } catch {
      htmlDOM = null;
    }

    try {
      await safeGoto(page, url);
    } catch {
      return res.status(200).json([
        {
          moduleName: 'Доступность страницы',
          item: url,
          issue: 'Страница недоступна для автоматизированного анализа',
          status: 'warning',
        },
      ]);
    }
    if (htmlDOM) {
      results.push(...checkAltAtributes(htmlDOM));
      results.push(...checkARIAAttributes(htmlDOM));
    }

    results.push(...(await checkContrast(page)));
    results.push(...(await checkKeyBoard(page)));
    results.push(...(await checkStructure(page)));
    results.push(...(await checkScalability(page)));

    try {
      await page.waitForSelector('video, audio', { timeout: 5000 });
    } catch {}

    results.push(...(await checkMedia(page)));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка проверки страницы' });
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
});

app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});
