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
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
};

const app = express();
app.use(cors());
app.use(express.json());

let currentPage: Page | null = null;

app.post('/api/check-all', async (req, res) => {
  console.log('🔥 REQUEST START');
  const { url } = req.body;
  console.log('🌐 URL:', url);
  if (!url) return res.status(400).json({ error: 'URL не указан' });

  const results: ModuleCheckResult[] = [];
  await initBrowser();
  console.log('🧠 browser ready');
  if (currentPage) {
    try {
      await currentPage.close();
    } catch (err) {
      console.warn('Не удалось закрыть старую страницу', err);
    }
  }

  currentPage = await browser.newPage();
  console.log('📄 new page created')

  try {
    const { data: html } = await axios.get(url, { timeout: 60000 });
    const $ = cheerio.load(html);
    console.log('🚀 before safeGoto');

    await safeGoto(currentPage, url);
    console.log('✅ after safeGoto');
    const limits = await getPageLimits(currentPage);
    const options: CheckOptions = { limits };


console.log('🧪 alt');
results.push(...checkAltAtributes($, options));
console.log('✅ alt done');

console.log('🧪 aria');
results.push(...checkARIAAttributes($, options));
console.log('✅ aria done');

console.log('🧪 contrast');
results.push(...await checkContrast(currentPage, options));
console.log('✅ contrast done');

console.log('🧪 keyboard');
results.push(...await checkKeyBoard(currentPage, options));
console.log('✅ keyboard done');

console.log('🧪 structure');
results.push(...await checkStructure(currentPage, options));
console.log('✅ structure done');

console.log('🧪 scalability');
results.push(...await checkScalability(currentPage, options));
console.log('✅ scalability done');
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
