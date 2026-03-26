import React, { useState } from 'react';
import ResultTable from '../../components/table/table';
import UrlInput from '../../components/input/input';
import Panel from '../../components/panel/panel';
import type { ModuleCheckResult, FiltersState } from '../../types/types';
import Filters from '../../components/filter/filter';
import LoadingIndicator from '../../components/loading/loading';
import HeaderElem from '../../components/header/header';
import './mainPage.css';

const MainPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<ModuleCheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FiltersState>({
    module: 'all',
    status: 'all',
  });

  const handleCheckAll = async () => {
    if (!url) {
      setError('Введите корректный URL для проверки');
      return;
    }

    setError('');
    setLoading(true)

    try {
      const response = await fetch('http://213.171.3.128:3001/api/check-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        setError(`Ошибка запроса к серверу: ${response.status}`);
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

  const filteredResults = results.filter((r) => {
    const matchModule =
      filters.module === 'all' || r.moduleName === filters.module;

    const matchStatus = filters.status === 'all' || r.status === filters.status;

    return matchModule && matchStatus;
  });

  return (
    <>
      <HeaderElem />
        <main className="page">
          <h1 className="page-title">
            Демонстрационная страница проверки доступности
          </h1>
          <UrlInput url={url} setUrl={setUrl} />
          <button onClick={handleCheckAll} disabled={loading}>
            {loading ? <LoadingIndicator /> : 'Проверить'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Filters results={results} filters={filters} setFilters={setFilters} />
          <ResultTable results={filteredResults} />
          <Panel results={filteredResults} />
        </main>
    </>
  );
};

export default MainPage;
