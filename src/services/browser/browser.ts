import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser | null = null;
let launching: Promise<Browser> | null = null;

const MAX_PAGES = 5;
let activePages = 0;

export const initBrowser = async (): Promise<Browser> => {
  if (browser) return browser;

  if (launching) return launching;

  launching = puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--window-size=1920,1080',
    ],
  });

  browser = await launching;
  launching = null;
  return browser;
};

const decreasePages = () => {
  activePages = Math.max(0, activePages - 1);
};

export const createPage = async (): Promise<Page> => {
  const instance = await initBrowser();

  if (!instance) {
    throw new Error('Браузер не инициализирован');
  }

  if (activePages >= MAX_PAGES) {
    throw new Error('Превышено максимальное количество активных страниц');
  }

  let page: Page;

  try {
    page = await instance.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.setExtraHTTPHeaders({
      'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });
  } catch (err) {
    browser = null;
    throw new Error('Failed to create page (browser crashed)');
  }

  activePages++;

  page.on('close', decreasePages);
  page.on('error', decreasePages);

  return page;
};

export const safeGoto = async (page: Page, url: string): Promise<void> => {
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
  } catch (err) {
    throw new Error('Страница недоступна для автоматизированного анализа');
  }
};
