import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Не удалось загрузить шаблон ${path}`);
  }
  return response.arrayBuffer();
}

function mapData(data) {
  return {
    номер_установки: data.installationNumber,
    обозначение: data.designation,
    наименование: data.name,
    заводской_номер: data.serial?.trim() || "-",
    серийный_номер: data.serial?.trim() || "-",
    артикул: data.code,
    тип: data.type,
    изготовитель: data.manufacturer,
    адрес_изготовителя: data.manufacturerAddress,
    технические_характеристики: data.specs,
    дата_приемки: data.dateAcceptance,
  };
}

/**
 * @param {Object} data - строка таблицы
 * @param {Boolean} toZip - если true → вернуть Blob, иначе скачать файл
 */
export async function generateFromTemplate(data, toZip = false) {
  const templatePath = data.isKIP
    ? "/templates/kipia.docx"
    : "/templates/small.docx";

  const content = await loadTemplate(templatePath);
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(mapData(data));

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  if (toZip) return blob;

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const filename = `Паспорт_${today}-${data.code}.docx`;
  saveAs(blob, filename);
}
