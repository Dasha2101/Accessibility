import React, { useState } from 'react';
import ResultTable from '../../components/table/table';
import UrlInput from '../../components/input/input';
import type { ModuleCheckResult } from '../../types';
import './mainPage.css';

const MainPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<ModuleCheckResult[]>([]);

  return (
    <main className="page">
      <h1 className="page-title">Демонстрационная страница проверки доступности</h1>
      <UrlInput url={url} setUrl={setUrl}/>
      <ResultTable url={url} setResults={setResults} results={results} />
    </main>
  );
};

export default MainPage;
