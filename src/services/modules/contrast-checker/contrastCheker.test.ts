import { checkContrast } from './contrastCheker';
import * as contrastUtils from '../../../utils/contrast/contrast';
import type { Page } from 'puppeteer';

jest.mock('../../../utils/contrast/contrast');

describe('checkContrast', () => {
  const mockPage = {
    evaluate: jest.fn(),
  } as unknown as Page;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('возвращает success при хорошем контрасте', async () => {
     (mockPage.evaluate as jest.Mock).mockResolvedValue([
      {
        tag: 'P',
        textColor: 'rgb(0, 0, 0)',
        bgColor: 'rgb(255, 255, 255)',
        fontSize: '16px',
        fontWeight: 'normal',
      },
    ]);
    
    (contrastUtils.getContrastRatio as jest.Mock).mockReturnValue(21);
    (contrastUtils.rgbToHex as jest.Mock).mockImplementation((rgb: string) => '#000000');

    const results = await checkContrast(mockPage);
    
    expect(results[0].status).toBe('success');
  });

  it('возвращает warning при низком контрасте', async () => {
     (mockPage.evaluate as jest.Mock).mockResolvedValue([
      {
        tag: 'P',
        textColor: 'rgb(100, 100, 100)',
        bgColor: 'rgb(110, 110, 110)',
        fontSize: '16px',
        fontWeight: 'normal',
      },
    ]);
    
    (contrastUtils.getContrastRatio as jest.Mock).mockReturnValue(1.2);
    (contrastUtils.rgbToHex as jest.Mock).mockImplementation((rgb: string) => '#000000');

    const results = await checkContrast(mockPage);
    
    expect(results[0].status).toBe('warning');
    expect(results[0].issue).toContain('Контраст');
  });
});