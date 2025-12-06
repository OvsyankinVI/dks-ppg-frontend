import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export async function generateDOCX(passportData, filename) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ children: [ new TextRun({ text: `Паспорт: ${passportData.type}`, bold: true }) ]}),
        new Paragraph(`Модель: ${passportData.model}`),
        new Paragraph(`Серийный номер: ${passportData.serial}`),
        new Paragraph(`Дата: ${passportData.date}`),
        new Paragraph(`Давление (бар): ${passportData.pressure}`),
        new Paragraph(`Мощность (кВт): ${passportData.power || '-'}`),
        new Paragraph(`Примечания: ${passportData.notes || '-'}`),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
