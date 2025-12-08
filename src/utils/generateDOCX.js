import { Document, Packer, Paragraph, TextRun } from "docx";

export async function generateDOCX(passportData) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Паспорт: ${passportData.type}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph(`Модель: ${passportData.model}`),
          new Paragraph(`Серийный номер: ${passportData.serial}`),
          new Paragraph(`Дата: ${passportData.date}`),
          new Paragraph(`Давление: ${passportData.pressure}`),
          new Paragraph(`Мощность: ${passportData.power || "-"}`),
          new Paragraph(`Примечания: ${passportData.notes || "-"}`),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob; // ✔️ возврат Blob — НИКАКИХ saveAs здесь!
}
