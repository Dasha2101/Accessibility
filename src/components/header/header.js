import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import './header.css';
const HeaderElem = () => {
  return _jsxs('header', {
    className: 'header',
    children: [
      _jsxs('div', {
        className: 'logo-container',
        children: [
          _jsx('img', {
            src: '/logo.jpg',
            alt: 'Accessly logo',
            className: 'logo-image',
          }),
          _jsx('div', { className: 'title', children: 'Accessly' }),
        ],
      }),
      _jsxs('nav', {
        className: 'header-nav',
        children: [
          _jsx('a', { href: '#about', children: 'About' }),
          _jsx('span', { className: 'dot', children: '\u2022' }),
          _jsx('a', { href: '#footer', children: 'Support' }),
        ],
      }),
    ],
  });
};
export default HeaderElem;
