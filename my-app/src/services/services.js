import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import puppeteer from 'puppeteer';
import { checkAltAtributes } from './modules/alt-checker/altChecker';
import { checkContrast } from './modules/contrast-checker/contrastCheker';
import { checkKeyBoard } from './modules/keyboard-checker/keyboardChecker';
import { checkStructure } from './modules/structure-checker/structureChecker';
import { checkScalability } from './modules/scalability-checker/scalabilityChecker';
import { checkARIAAttributes } from './modules/aria-checker/ariaChecker';
import { checkMedia } from './modules/media-checker/mediaChecker';
import { getPageLimits } from '../utils/limits/limits';
let browser;
const initBrowser = async () => {
    if (!browser) {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log('Браузер запущен');
    }
    return browser;
};
const safeGoto = async (page, url) => {
    await Promise.race([
        page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout page load')), 15000)),
    ]);
};
const app = express();
app.use(cors());
app.use(express.json());
let currentPage = null;
app.post('/api/check-all', async (req, res) => {
    console.log('🔥 REQUEST START');
    const { url } = req.body;
    console.log('🌐 URL:', url);
    if (!url)
        return res.status(400).json({ error: 'URL не указан' });
    const results = [];
    await initBrowser();
    console.log('🧠 browser ready');
    if (currentPage) {
        try {
            await currentPage.close();
        }
        catch (err) {
            console.warn('Не удалось закрыть старую страницу', err);
        }
    }
    currentPage = await browser.newPage();
    console.log('📄 new page created')
    try {
        const { data: html } = await axios.get(url, {
    timeout: 60000,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
        const $ = cheerio.load(html);
        console.log('🚀 before safeGoto');
        const safeGoto = async (page, url) => {
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
    });
};
        console.log('✅ after safeGoto');
        const limits = await getPageLimits(currentPage);
        const options = { limits };
        console.log('🧪 starting checks');
        results.push(...checkAltAtributes($, options));
        results.push(...checkARIAAttributes($, options));
        results.push(...(await checkContrast(currentPage, options)));
        results.push(...(await checkKeyBoard(currentPage, options)));
        results.push(...(await checkStructure(currentPage, options)));
        results.push(...(await checkScalability(currentPage, options)));
        await currentPage
            .waitForSelector('video, audio', { timeout: 5000 })
            .catch(() => { });
        results.push(...(await checkMedia(currentPage, options)));
        res.json(results);
    }
 catch (err) {
    console.error('FULL ERROR:', err);
    res.status(500).json({
        error: 'Ошибка проверки страницы',
        message: err?.message,
        stack: err?.stack,
    });
}
});
app.listen(3001, () => {
    console.log('Сервер запущен на порту 3001');
});
