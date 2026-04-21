import { rgbToHex, getContrastRatio } from './contrast';

describe('rgbToHex', () => {
  it('конвертирует rgb в hex', () => {
    expect(rgbToHex('rgb(255, 0, 0)')).toBe('#ff0000');
    expect(rgbToHex('rgb(0, 255, 0)')).toBe('#00ff00');
    expect(rgbToHex('rgb(0, 0, 255)')).toBe('#0000ff');
  });

  it('возвращает черный при неправильном формате', () => {
    expect(rgbToHex('invalid')).toBe('#000000');
  });
});

describe('getContrastRatio', () => {
  it('возвращает 1 для одинаковых цветов', () => {
    expect(getContrastRatio('#000000', '#000000')).toBe(1);
  });

  it('возвращает высокое значение для черного и белого', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeGreaterThan(20);
    expect(ratio).toBeLessThan(22);
  });
});
