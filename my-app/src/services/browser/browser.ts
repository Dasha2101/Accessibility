import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser;

export const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
};

export const createPage = async (): Promise<Page> => {
  if (!browser) throw new Error('Браузер не запущен');
  const page = await browser.newPage();
  return page;
};

export const safeGoto = async (page: Page, url: string) => {
  await Promise.race([
    page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout page load')), 15000)
    ),
  ]);
};