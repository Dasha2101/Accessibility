import puppeteer from 'puppeteer';
let browser = null;
let launching = null;
let restarting = false;
const MAX_PAGES = 5;
let activePages = 0;
export const initBrowser = async () => {
  if (browser) return browser;
  if (launching) return launching;
  launching = puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
  browser = await launching;
  launching = null;
  browser.on('disconnected', () => {
    if (restarting) return;
    restarting = true;
    browser = null;
    setTimeout(() => {
      initBrowser()
        .catch((err) => console.error('Failed to restart browser:', err))
        .finally(() => {
          restarting = false;
        });
    }, 2000);
  });
  return browser;
};
const decreasePages = () => {
  activePages = Math.max(0, activePages - 1);
};
export const createPage = async () => {
  const instance = await initBrowser();
  if (!instance) {
    throw new Error('Browser is not initialized');
  }
  if (activePages >= MAX_PAGES) {
    throw new Error('Too many active pages');
  }
  let page;
  try {
    page = await instance.newPage();
  } catch (err) {
    browser = null;
    throw new Error('Failed to create page (browser crashed)');
  }
  activePages++;
  page.on('close', decreasePages);
  page.on('error', decreasePages);
  return page;
};
export const safeGoto = async (page, url) => {
  const navigationPromise = page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Page load timeout'));
    }, 15000);
  });
  await Promise.race([navigationPromise, timeoutPromise]);
};
