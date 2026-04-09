import React from 'react';
import Button from '../button/button';
import type { ModuleCheckResult } from '../../types/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import robotoTTF from '../../fonts/RobotoBase64';
import './panel.css';

type PanelProps = {
  results: ModuleCheckResult[];
};

const Panel: React.FC<PanelProps> = ({ results }) => {
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
    const escapeCSV = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const rows = results.map((r) =>
      [r.moduleName, r.status, r.issue].map(escapeCSV).join(','),
    );

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

  return (
    <div className="export-panel">
      <p>Вы можете сохранить ваши результаты в удобном для вас формате</p>
      <div className="button-group">
        <Button children="Export JSON" onClick={exportJSON} />
        <Button children="Export CSV" onClick={exportCSV} />
        <Button children="Export PDF" onClick={exportPDF} />
      </div>
    </div>
  );
};

export default Panel;
