import React, { useMemo } from 'react';
import type { ModuleCheckResult, FiltersState } from '../../types/types';
import './filter.css';

type FiltersProps = {
  results: ModuleCheckResult[];
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
};

const Filters = ({ results, filters, setFilters }: FiltersProps) => {
  const modules = useMemo(
    () => Array.from(new Set(results.map((r) => r.moduleName))),
    [results],
  );

  const statuses: FiltersState['status'][] = [
    'all',
    'error',
    'warning',
    'success',
  ];

  const handleModuleChange = (value: string) => {
    setFilters((prev) => ({ ...prev, module: value }));
  };

  const handleStatusChange = (value: FiltersState['status']) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label className="filter-label">Модуль</label>
        <select
          className="filter-select"
          value={filters.module}
          onChange={(e) => handleModuleChange(e.target.value)}
        >
          <option value="all">📦 Все модули</option>
          {modules.map((moduleName) => (
            <option key={moduleName} value={moduleName}>
              {moduleName}
            </option>
          ))}
        </select>
      </div>

      <div className="filters-divider" />

      <div className="filter-group">
        <label className="filter-label">Статус</label>
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) =>
            handleStatusChange(e.target.value as FiltersState['status'])
          }
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'all' && '🔍 Все статусы'}
              {status === 'error' && '❌ Error'}
              {status === 'warning' && '⚠️ Warning'}
              {status === 'success' && '✅ Success'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
