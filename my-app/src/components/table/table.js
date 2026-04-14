import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import './table.css';
const RESULTS_PER_PAGE = 10;
const ResultTable = ({ results }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    useEffect(() => {
        setCurrentPage(1);
    }, [results]);
    const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
    const currentResults = results.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);
    if (results.length === 0) {
        return (_jsx("div", { className: "result-table-wrapper-empty", children: _jsxs("div", { className: "empty-state", children: [_jsx("p", { children: "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F" }), _jsx("p", { className: "empty-state-sub", children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 URL \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \"\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C\"" })] }) }));
    }
    return (_jsxs("div", { className: "result-table-wrapper", children: [_jsxs("table", { className: "result-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u041C\u043E\u0434\u0443\u043B\u044C" }), _jsx("th", { children: "\u042D\u043B\u0435\u043C\u0435\u043D\u0442" }), _jsx("th", { children: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430" }), _jsx("th", { children: "\u0421\u0442\u0430\u0442\u0443\u0441" })] }) }), _jsx("tbody", { children: currentResults.map((r, idx) => (_jsxs("tr", { children: [_jsx("td", { children: r.moduleName }), _jsx("td", { children: r.item }), _jsx("td", { children: r.issue }), _jsx("td", { className: `status-${r.status}`, children: r.status })] }, idx))) })] }), totalPages > 1 && (_jsxs("div", { className: "pagination", children: [_jsx("button", { onClick: () => setCurrentPage((p) => Math.max(p - 1, 1)), disabled: currentPage === 1, children: "\u041D\u0430\u0437\u0430\u0434" }), _jsxs("span", { children: [currentPage, " / ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage((p) => Math.min(p + 1, totalPages)), disabled: currentPage === totalPages, children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] }))] }));
};
export default ResultTable;
