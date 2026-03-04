import React, { useState } from 'react';
import LoadingIndicator from '../loading/loading';
import type { ModuleCheckResult } from '../../types';
import './table.css';

interface ResultTableProps {
  url: string,
  results: ModuleCheckResult[];
  setResults: (results: ModuleCheckResult[]) => void;
}

const ResultTable: React.FC<ResultTableProps> = ({ url, results, setResults }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckAll = async () => {
    if (!url) {
      setError('Введите корректный URL для проверки');
      return
    }

    setLoading(true);
    setError('');
    setResults([]);

 try {
      const response = await fetch('http://localhost:3001/api/check-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

    if (!response.ok) {
      setError(`Ошибка запроса к серверу: ${response.status}`);
      setLoading(false);
      return;
    }

    const data: ModuleCheckResult[] = await response.json();
    setResults(data);

    } catch {
      setError('Произошла неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

   return (
    <div>
      <button onClick={handleCheckAll} disabled={loading}>
         {loading && <LoadingIndicator message="Идёт проверка..." />}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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
                  <td className={`status-${r.status}`}>{r.status}</td>
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
