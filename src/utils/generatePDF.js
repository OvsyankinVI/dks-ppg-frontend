import jsPDF from 'jspdf';

export function generatePDF(passportData, filename) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Паспорт: ${passportData.type}`, 10, 20);
  doc.setFontSize(11);
  doc.text(`Модель: ${passportData.model}`, 10, 30);
  doc.text(`Серийный номер: ${passportData.serial}`, 10, 40);
  doc.text(`Дата: ${passportData.date}`, 10, 50);
  doc.text(`Давление (бар): ${passportData.pressure}`, 10, 60);
  doc.text(`Мощность (кВт): ${passportData.power || '-'}`, 10, 70);
  doc.text(`Примечания: ${passportData.notes || '-'}`, 10, 80);
  doc.save(`${filename}.pdf`);
}
