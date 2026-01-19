import React, { useState } from 'react';
import type { ModuleCheckResult } from '../../types';
import { checkAltAttributes } from '../../modules/alt-checker/atlChecker';
import { checkContrast } from '../../modules/contrast-checker/contrastChecker';
import { checkKeyBoard } from '../../modules/keyboard-checker/keyboardChecker';
import { checkStructure } from '../../modules/structure-checker/structure-ckecker';
import { checkScalability } from '../../modules/scalability-checker/scalabilityChecker';
import { checkMedia } from '../../modules/media-checker/mediaChecker';
import './table.css';

const ResultTable: React.FC = () => {
  const [results, setResults] = useState<ModuleCheckResult[]>([]);

  const handleCheckAll = () => {
    const altResults = checkAltAttributes();
    const contrastResults = checkContrast();
    const keyboardResults = checkKeyBoard();
    const structureResults = checkStructure();
    const scalabilityResults = checkScalability();
    const mediaResults = checkMedia();

    setResults([
      ...keyboardResults,
      ...altResults,
      ...contrastResults,
      ...structureResults,
      ...scalabilityResults,
      ...mediaResults,
    ]);
  };

  return (
    <div>
      <button onClick={handleCheckAll}>Начать проверку всех модулей</button>
      {results.length > 0 && (
        <div className="result-table-wrapper">
          <table className="result-table">
            <thead>
              <tr>
                <th>Модуль</th>
                <th>Элемент</th>
                <th>Проблема</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.moduleName}</td>
                  <td>{r.item}</td>
                  <td>{r.issue}</td>
                  <td className={`status-${r.status}`}>
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
