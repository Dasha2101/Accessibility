"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageLimits = void 0;
const getPageLimits = async (page) => {
    const stats = await page.evaluate(() => {
        return {
            total: document.querySelectorAll('*').length,
            textElements: document.querySelectorAll('p, span, h1, h2, h3, a, button')
                .length,
            images: document.querySelectorAll('img').length,
            totalVideos: document.querySelectorAll('video').length,
            totalAudios: document.querySelectorAll('audio').length,
        };
    });
    let baseLimit = 100;
    if (stats.total > 5000)
        baseLimit = 60;
    else if (stats.total > 3000)
        baseLimit = 80;
    else if (stats.total > 1500)
        baseLimit = 100;
    else
        baseLimit = 120;
    return {
        contrast: baseLimit,
        keyboard: Math.floor(baseLimit * 0.6),
        structure: Math.floor(baseLimit * 0.5),
        scalability: Math.floor(baseLimit * 0.4),
        media: Math.min(stats.totalVideos + stats.totalAudios, Math.floor(baseLimit * 0.5)),
    };
};
exports.getPageLimits = getPageLimits;
