import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
// import fs from 'fs';
// import path from 'path';

import { checkAltAtributes } from './modules/alt-checker/altChecker.ts';
import { checkContrast } from './modules/contrast-checker/contrastCheker.ts';
import { checkKeyBoard } from './modules/keyboard-checker/keyboardChecker.ts';
import { checkStructure } from './modules/structure-checker/structureChecker.ts';
import { checkScalability } from './modules/scalability-checker/scalabilityChecker.ts';
import { checkARIAAttributes } from './modules/aria-checker/ariaChecker.ts';
import { checkMedia } from './modules/media-checker/mediaChecker.ts';
import type { ModuleCheckResult } from '../types';

const app = express();
app.use(cors());
app.use(express.json());

// const toCSV = (results: ModuleCheckResult[]) => {
//   const headers = ['moduleName', 'item', 'issue', 'status'];
//   const rows = results.map(r => [
//     r.moduleName,
//     `"${r.item.replace(/"/g, '""')}"`,
//     `"${r.issue.replace(/"/g, '""')}"`,
//     r.status
//   ].join(','));
//   return [headers.join(','), ...rows].join('\n');
// };

app.post('/api/check-all', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL не указан' });

  const results: ModuleCheckResult[] = [];

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    results.push(...checkAltAtributes($));
    results.push(...(await checkContrast(url)));
    results.push(...(await checkKeyBoard(url)));
    results.push(...(await checkStructure(url)));
    results.push(...(await checkScalability(url)));
    results.push(...(await checkMedia(url)));
    results.push(...(await checkARIAAttributes(url)));

    // const jsonPath = path.join(process.cwd(), 'results.json');
    // fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');

    // const csvPath = path.join(process.cwd(), 'results.csv');
    // fs.writeFileSync(csvPath, toCSV(results), 'utf-8');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка проверки страницы' });
  }
});

app.listen(3001, () => {});
