import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { initBrowser, createPage, safeGoto } from './browser/browser';

import { checkAltAtributes } from './modules/alt-checker/altChecker';
import { checkContrast } from './modules/contrast-checker/contrastCheker';
import { checkKeyBoard } from './modules/keyboard-checker/keyboardChecker';
import { checkStructure } from './modules/structure-checker/structureChecker';
import { checkScalability } from './modules/scalability-checker/scalabilityChecker';
import { checkARIAAttributes } from './modules/aria-checker/ariaChecker';
import { checkMedia } from './modules/media-checker/mediaChecker';

import type { ModuleCheckResult, CheckOptions } from '../types/types';
import { getPageLimits } from '../utils/limits/limits';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/check-all', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL не указан' });
  }

  let page = null;
  const results: ModuleCheckResult[] = [];

  try {
    await initBrowser();

    page = await createPage();

    const { data: html } = await axios.get(url, { timeout: 60000 });
    const $ = cheerio.load(html);

    await safeGoto(page, url);

    const limits = await getPageLimits(page);
    const options: CheckOptions = { limits };

    results.push(...checkAltAtributes($, options));
    results.push(...checkARIAAttributes($, options));
    results.push(...(await checkContrast(page, options)));
    results.push(...(await checkKeyBoard(page, options)));
    results.push(...(await checkStructure(page, options)));
    results.push(...(await checkScalability(page, options)));

    await page
      .waitForSelector('video, audio', { timeout: 5000 })
      .catch(() => {});
    results.push(...(await checkMedia(page, options)));

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
