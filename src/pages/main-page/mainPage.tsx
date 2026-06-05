import React, { useState } from 'react';
import ResultTable from '../../components/table/table';
import UrlInput from '../../components/input/input';
import Panel from '../../components/panel/panel';
import type { ModuleCheckResult, FiltersState } from '../../types/types';
import Filters from '../../components/filter/filter';
import LoadingIndicator from '../../components/loading/loading';
import Layout from '../../components/layout/layout';
import Button from '../../components/button/button';
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
  console.log('NEW VERSION 123');

  const handleCheckAll = async () => {
    if (!url) {
      setError('Введите корректный URL для проверки');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/check-all', {
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
    <Layout>
      <section className="hero">
        <img
          className="hero-image"
          src="/1.svg"
          alt="Иллюстрация проверки веб-доступности"
        />
        <section className="block">
          <h1 className="page-title">Проверка доступности веб-ресурсов</h1>
          <p className="page-subtitle">
            Анализируйте веб-страницы на соответствие стандартам доступности
            WCAG
          </p>
        </section>
      </section>
      <div className="search-container">
        <UrlInput url={url} setUrl={setUrl} />
        <Button onClick={handleCheckAll} disabled={loading}>
          {loading ? <LoadingIndicator /> : 'Проверить'}
        </Button>
      </div>

      {error && <p className="errorText">{error}</p>}

      <Filters results={results} filters={filters} setFilters={setFilters} />
      <ResultTable results={filteredResults} />
      <Panel results={filteredResults} />
    </Layout>
  );
};

export default MainPage;
