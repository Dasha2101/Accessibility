import React from 'react';
import type { ModuleCheckResult } from '../../types/types';
import './table.css';

interface ResultTableProps {
  results: ModuleCheckResult[];
}

const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
  return (
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
  );
};

export default ResultTable;
