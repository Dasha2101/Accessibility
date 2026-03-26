import React, { useState, useEffect } from 'react';
import type { ModuleCheckResult } from '../../types/types';
import './table.css';

interface ResultTableProps {
  results: ModuleCheckResult[];
}

const RESULTS_PER_PAGE = 10;

const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const currentResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE,
  );

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
          {currentResults.map((r, idx) => (
            <tr key={idx}>
              <td>{r.moduleName}</td>
              <td>{r.item}</td>
              <td>{r.issue}</td>
              <td className={`status-${r.status}`}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
