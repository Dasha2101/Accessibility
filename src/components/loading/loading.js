import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import './loading.css';
const LoadingIndicator = ({ message = 'Загрузка...' }) => {
  return _jsxs('div', {
    className: 'loading-wrapper',
    children: [
      _jsx('div', { className: 'spinner' }),
      _jsx('span', { children: message }),
    ],
  });
};
export default LoadingIndicator;
