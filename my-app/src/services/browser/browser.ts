import puppeteer from 'puppeteer';

export const createPage = async (url: string) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 10000,
  });

  return { browser, page };
};