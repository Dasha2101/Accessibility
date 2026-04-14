import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import './filter.css';
const Filters = ({ results, filters, setFilters }) => {
    const modules = useMemo(() => Array.from(new Set(results.map((r) => r.moduleName))), [results]);
    const statuses = [
        'all',
        'error',
        'warning',
        'success',
    ];
    const handleModuleChange = (value) => {
        setFilters((prev) => ({ ...prev, module: value }));
    };
    const handleStatusChange = (value) => {
        setFilters((prev) => ({ ...prev, status: value }));
    };
    return (_jsxs("div", { className: "filters-container", children: [_jsxs("div", { className: "filter-group", children: [_jsx("label", { className: "filter-label", children: "\u041C\u043E\u0434\u0443\u043B\u044C" }), _jsxs("select", { className: "filter-select", value: filters.module, onChange: (e) => handleModuleChange(e.target.value), children: [_jsx("option", { value: "all", children: "\uD83D\uDCE6 \u0412\u0441\u0435 \u043C\u043E\u0434\u0443\u043B\u0438" }), modules.map((moduleName) => (_jsx("option", { value: moduleName, children: moduleName }, moduleName)))] })] }), _jsx("div", { className: "filters-divider" }), _jsxs("div", { className: "filter-group", children: [_jsx("label", { className: "filter-label", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("select", { className: "filter-select", value: filters.status, onChange: (e) => handleStatusChange(e.target.value), children: statuses.map((status) => (_jsxs("option", { value: status, children: [status === 'all' && '🔍 Все статусы', status === 'error' && '❌ Error', status === 'warning' && '⚠️ Warning', status === 'success' && '✅ Success'] }, status))) })] })] }));
};
export default Filters;
