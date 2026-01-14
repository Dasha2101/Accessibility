import type { ModuleCheckResult } from '../../types';

export const SCALE_FACTORS = [1.5, 2];

export const checkScalability = (): ModuleCheckResult[] => {
  const results: ModuleCheckResult[] = [];
  const scaleFactors = SCALE_FACTORS;
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>('body *')).filter(el => el.offsetParent !== null);

  scaleFactors.forEach(scale => {
    elements.forEach(el => {
      const originalTransform = el.style.transform;
      el.style.transformOrigin = 'top left';
      el.style.transform = `scale(${scale})`;

      const scaledRect = el.getBoundingClientRect();
      const parent = el.parentElement;

      if (parent && (scaledRect.width > parent.clientWidth || scaledRect.height > parent.clientHeight)) {
        results.push({
          moduleName: 'Масштабируемость',
          item: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
          issue: `Элемент может обрезаться при масштабе ${scale * 100}%`,
          status: 'warning',
        });
      }
      el.style.transform = originalTransform;
    })
  })
  return results;
}