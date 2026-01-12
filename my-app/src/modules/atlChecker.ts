import type { ModuleCheckResult } from '../types';

export const checkAltAttributes = (): ModuleCheckResult[] => {
  const mockHtml = `
    <html>
      <body>
        <img src="logo.png" alt="Company Logo" />
        <img src="banner.jpg" />
        <img src="icon.svg" alt="" />
      </body>
    </html>
  `;
  const parser = new DOMParser();
  const doc = parser.parseFromString(mockHtml, 'text/html');
  const images = Array.from(doc.querySelectorAll('img'));

  return images.map(img => {
    const alt = img.getAttribute('alt');
    if (!alt) {
      return {
        moduleName: 'AltChecker',
        item: img.src,
        issue: alt === null ? 'Отсутствует атрибут alt' : 'Пустой alt',
        status: 'error' as const,
      };
    }
    return {
      moduleName: 'AltChecker',
      item: img.src,
      issue: 'OK',
      status: 'ok' as const,
    };
  });
};
