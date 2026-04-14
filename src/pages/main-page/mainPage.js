import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import ResultTable from '../../components/table/table';
import UrlInput from '../../components/input/input';
import Panel from '../../components/panel/panel';
import Filters from '../../components/filter/filter';
import LoadingIndicator from '../../components/loading/loading';
import Layout from '../../components/layout/layout';
import Button from '../../components/button/button';
import './mainPage.css';
const MainPage = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    module: 'all',
    status: 'all',
  });
  const handleCheckAll = async () => {
    if (!url) {
      setError('Введите корректный URL для проверки');
      return;
    }
    setError('');
    setLoading(true);
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
      const data = await response.json();
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
  return _jsxs(Layout, {
    children: [
      _jsxs('section', {
        className: 'hero',
        children: [
          _jsx('img', {
            className: 'hero-image',
            src: '/1.svg',
            alt: '\u0418\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0432\u0435\u0431-\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438',
          }),
          _jsxs('section', {
            className: 'block',
            children: [
              _jsx('h1', {
                className: 'page-title',
                children:
                  '\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438 \u0432\u0435\u0431-\u0440\u0435\u0441\u0443\u0440\u0441\u043E\u0432',
              }),
              _jsx('p', {
                className: 'page-subtitle',
                children:
                  '\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439\u0442\u0435 \u0432\u0435\u0431-\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430\u043C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438 WCAG',
              }),
            ],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'search-container',
        children: [
          _jsx(UrlInput, { url: url, setUrl: setUrl }),
          _jsx(Button, {
            onClick: handleCheckAll,
            disabled: loading,
            children: loading ? _jsx(LoadingIndicator, {}) : 'Проверить',
          }),
        ],
      }),
      error && _jsx('p', { style: { color: 'red' }, children: error }),
      _jsx(Filters, {
        results: results,
        filters: filters,
        setFilters: setFilters,
      }),
      _jsx(ResultTable, { results: filteredResults }),
      _jsx(Panel, { results: filteredResults }),
    ],
  });
};
export default MainPage;
