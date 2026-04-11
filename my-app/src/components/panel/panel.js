import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '../button/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import robotoTTF from '../../fonts/RobotoBase64';
import './panel.css';
const Panel = ({ results }) => {
    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'accessibility-results.json';
        a.click();
    };
    const exportCSV = () => {
        const escapeCSV = (value) => `"${value.replace(/"/g, '""')}"`;
        const rows = results.map((r) => [r.moduleName, r.status, r.issue].map(escapeCSV).join(','));
        const csvContent = '\uFEFF' + ['module,status,issue', ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'accessibility-results.csv';
        a.click();
    };
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.addFileToVFS('Roboto-Regular.ttf', robotoTTF);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal', 'Identity-H');
        doc.setFont('Roboto');
        const tableRows = results.map((r) => [r.moduleName, r.status, r.issue]);
        autoTable(doc, {
            head: [['Module', 'Status', 'Issue']],
            body: tableRows,
            startY: 30,
            styles: {
                font: 'Roboto',
                fontStyle: 'normal',
                fontSize: 10,
            },
            headStyles: { fillColor: [52, 73, 94], textColor: 255, font: 'Roboto' },
        });
        doc.save('accessibility-report.pdf');
    };
    return (_jsxs("div", { className: "export-panel", children: [_jsx("p", { children: "\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432\u0430\u0448\u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0432 \u0443\u0434\u043E\u0431\u043D\u043E\u043C \u0434\u043B\u044F \u0432\u0430\u0441 \u0444\u043E\u0440\u043C\u0430\u0442\u0435" }), _jsxs("div", { className: "button-group", children: [_jsx(Button, { children: "Export JSON", onClick: exportJSON }), _jsx(Button, { children: "Export CSV", onClick: exportCSV }), _jsx(Button, { children: "Export PDF", onClick: exportPDF })] })] }));
};
export default Panel;
