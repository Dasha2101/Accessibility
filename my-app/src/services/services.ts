import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { checkAltAtributes } from './modules/alt-checker/altChecker';
import { checkContrast } from './modules/contrast-checker/contrastCheker';
import { checkKeyBoard } from './modules/keyboard-checker/keyboardChecker';
// import { checkStructure } from './modules/structure-checker/structureChecker';
// import { checkScalability } from './modules/scalability-checker/scalabilityChecker';
import { checkARIAAttributes } from './modules/aria-checker/ariaChecker';
import { checkFullPageDynamic } from './modules/media-checker/mediaChecker';
import type { ModuleCheckResult } from '../types/types.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/check-all', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL не указан' });

  const results: ModuleCheckResult[] = [];

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 60000,
    });
    const $ = cheerio.load(html);
    results.push(...checkAltAtributes($));
    results.push(...(await checkContrast(url)));
    results.push(...(await checkKeyBoard(url)));
    // results.push(...(await checkStructure(url)));
    // results.push(...(await checkScalability(url)));
    results.push(...(await checkFullPageDynamic(url)));
    results.push(...(await checkARIAAttributes($)));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка проверки страницы' });
  }
});

app.listen(3001, () => {
  console.log('dkkdkd');
});
