import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToCSV = (items, columns, filename = "export.csv") => {
  if (!items || !items.length) return;

  const header = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(",");
  const rows = items.map((item) =>
    columns
      .map((col) => {
        // Handle nested keys like 'category.name'
        const keys = col.key.split(".");
        let value = item;
        keys.forEach((k) => {
          value = value?.[k];
        });

        const stringValue = value !== null && value !== undefined ? String(value) : "";
        return `"${stringValue.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (items, columns, title = "Export Data", filename = "export.pdf") => {
  if (!items || !items.length) return;

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

  const tableColumn = columns.map((col) => col.label);
  const tableRows = items.map((item) => {
    return columns.map((col) => {
      const keys = col.key.split(".");
      let value = item;
      keys.forEach((k) => {
        value = value?.[k];
      });
      return value !== null && value !== undefined ? String(value) : "";
    });
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 28,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] }, // slate-800
    styles: { fontSize: 8, cellPadding: 3 },
  });

  doc.save(filename);
};
