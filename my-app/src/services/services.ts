import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';

import { checkAltAtributes } from './modules/alt-checker/altChecker';
import { checkContrast } from './modules/contrast-checker/contrastCheker';
import { checkKeyBoard } from './modules/keyboard-checker/keyboardChecker';
import { checkStructure } from './modules/structure-checker/structureChecker';
import { checkScalability } from './modules/scalability-checker/scalabilityChecker';
import { checkARIAAttributes } from './modules/aria-checker/ariaChecker';
import { checkMedia } from './modules/media-checker/mediaChecker';
import type { ModuleCheckResult, CheckOptions } from '../types/types.ts';
import { getPageLimits } from '../utils/limits/limits';

let browser: Browser;

const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Браузер запущен');
  }
  return browser;
};

const safeGoto = async (page: Page, url: string) => {
  await Promise.race([
    page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout page load')), 15000),
    ),
  ]);
};

const app = express();
app.use(cors());
app.use(express.json());

let currentPage: Page | null = null;

app.post('/api/check-all', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL не указан' });

  const results: ModuleCheckResult[] = [];
  await initBrowser();
  if (currentPage) {
    try {
      await currentPage.close();
    } catch (err) {
      console.warn('Не удалось закрыть старую страницу', err);
    }
  }

  currentPage = await browser.newPage();

  try {
    const { data: html } = await axios.get(url, { timeout: 60000 });
    const $ = cheerio.load(html);

    await safeGoto(currentPage, url);
    const limits = await getPageLimits(currentPage);
    const options: CheckOptions = { limits };

    results.push(...checkAltAtributes($, options));
    results.push(...checkARIAAttributes($, options));
    results.push(...(await checkContrast(currentPage, options)));
    results.push(...(await checkKeyBoard(currentPage, options)));
    results.push(...(await checkStructure(currentPage, options)));
    results.push(...(await checkScalability(currentPage, options)));
    await currentPage
      .waitForSelector('video, audio', { timeout: 5000 })
      .catch(() => {});
    results.push(...(await checkMedia(currentPage, options)));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка проверки страницы' });
  }
});

app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});
