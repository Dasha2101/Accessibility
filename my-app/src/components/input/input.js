import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './input.css';
const UrlInput = ({ url, setUrl }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (_jsxs("div", { className: `url-input ${isFocused ? 'url-input--focused' : ''}`, children: [_jsx("input", { className: "url-input__field", type: "text", placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 URL \u0432\u0435\u0431-\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B...", value: url, onChange: (e) => setUrl(e.target.value), onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false) }), _jsx("div", { className: "url-input__decor" })] }));
};
export default UrlInput;
