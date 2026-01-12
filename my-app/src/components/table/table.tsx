import React, { useState } from 'react';
import type { ModuleCheckResult } from '../../types';
import { checkAltAttributes } from '../../modules/atlChecker';

const ResultTable: React.FC = () => {
  const [results, setResults] = useState<ModuleCheckResult[]>([]);

  const handleCheckAll = () => {
    const altResults = checkAltAttributes();
    setResults([...altResults])
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={handleCheckAll}>Начать проверку всех модулей</button>

      {results.length > 0 && (
        <table border={1} cellPadding={5} style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
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
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultTable;