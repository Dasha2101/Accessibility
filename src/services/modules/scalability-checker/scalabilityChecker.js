export const SCALE_FACTORS = [1.5, 2];
export const checkScalability = async (page, options) => {
    try {
        const totalElements = await page.evaluate(() => {
            return Array.from(document.body.querySelectorAll('body *')).filter((el) => el.offsetParent !== null).length;
        });
        const results = await page.evaluate((scaleFactors) => {
            const results = [];
            const seenItems = new Set();
            const addResult = (item, issue, status) => {
                const key = `${item}-${issue}-${status}`;
                if (!seenItems.has(key)) {
                    results.push({
                        moduleName: 'Масштабируемость',
                        item,
                        issue,
                        status,
                    });
                    seenItems.add(key);
                }
            };
            const elements = Array.from(document.body.querySelectorAll('body *')).filter((el) => el.offsetParent !== null);
            scaleFactors.forEach((scale) => {
                elements.forEach((el) => {
                    const originalTransform = el.style.transform;
                    el.style.transformOrigin = 'top left';
                    el.style.transform = `scale(${scale})`;
                    const rect = el.getBoundingClientRect();
                    const parent = el.parentElement;
                    if (parent &&
                        (rect.width > parent.clientWidth ||
                            rect.height > parent.clientHeight)) {
                        addResult(el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''), `Элемент может обрезаться при масштабе ${scale * 100}%`, 'warning');
                    }
                    el.style.transform = originalTransform;
                });
            });
            if (results.length === 0) {
                results.push({
                    moduleName: 'Масштабируемость',
                    item: 'Все элементы',
                    issue: 'Ошибки не найдены',
                    status: 'success',
                });
            }
            return results;
        }, SCALE_FACTORS, totalElements);
        return results;
    }
    catch (error) {
        return [
            {
                moduleName: 'Масштабируемость',
                item: 'Ошибка',
                issue: 'Не удалось выполнить проверку масштабируемости',
                status: 'error',
            },
        ];
    }
};
