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
import type { ModuleCheckResult } from '../types/types.ts';

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
      setTimeout(() => reject(new Error('Timeout page load')), 15000)
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

    results.push(...checkAltAtributes($));
    results.push(...checkARIAAttributes($));

    await safeGoto(currentPage, url);

    results.push(...(await checkContrast(currentPage)));
    results.push(...(await checkKeyBoard(currentPage)));
    results.push(...(await checkStructure(currentPage)));
    results.push(...(await checkScalability(currentPage)));
    results.push(...(await checkMedia(currentPage)));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка проверки страницы' });
  } 
});

app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});