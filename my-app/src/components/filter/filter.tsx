import React, { useMemo } from 'react';
import type { ModuleCheckResult, FiltersState } from '../../types/types';

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
    <div style={{ margin: '16px 0', display: 'flex', gap: '12px' }}>
      <select
        value={filters.module}
        onChange={(e) => handleModuleChange(e.target.value)}
      >
        <option value="all">Все модули</option>
        {modules.map((moduleName) => (
          <option key={moduleName} value={moduleName}>
            {moduleName}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) =>
          handleStatusChange(e.target.value as FiltersState['status'])
        }
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status === 'all'
              ? 'Все статусы'
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
