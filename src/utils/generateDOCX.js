import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell 
} from "docx";
import { saveAs } from "file-saver";

export async function generateDOCX(data, filename) {

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Times New Roman", size: 18 }
        }
      },
      paragraphStyles: [
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { bold: true, font: "Times New Roman", size: 20 },
          paragraph: { spacing: { before: 200, after: 100 } }
        }
      ]
    },

    sections: [
      {
        children: [
          // Заголовок теперь динамический
          new Paragraph({
            children: [
              new TextRun({
                text: filename, // вместо "ПАСПОРТ ИЗДЕЛИЯ"
                bold: true,
                size: 28
              })
            ]
          }),
          new Paragraph({ text: "1. Общие сведения", style: "Heading2" }),
          new Paragraph(`Наименование изделия: ${data.name}`),
          new Paragraph(`Тип / Модель / Обозначение: ${data.type}`),
          new Paragraph(`Код/Артикул: ${data.code}`),
          new Paragraph(`Изготовитель: ${data.manufacturer}`),
          new Paragraph(`Адрес изготовителя: ${data.manufacturerAddress}`),
          new Paragraph(`Серийный номер (при наличии): ${data.serial || "-"}`),

          new Paragraph({ text: "2. Основные технические характеристики", style: "Heading2" }),
          // Разбиваем по строкам
          ...data.specs.split("\n").map(line => new Paragraph(`${line}`)),

          new Paragraph({ text: "3. Состав и комплектность", style: "Heading2" }),
          new Paragraph(`1. ${data.name} — 1 шт.`),
          new Paragraph("2. Паспорт — 1 экз."),

          new Paragraph({ text: "4. Условия эксплуатации", style: "Heading2" }),
          new Paragraph("Окружающая среда не должна выходить за пределы допустимых значений."),
          new Paragraph("Монтаж — квалифицированным персоналом."),
          new Paragraph("Не превышать предельные нагрузки и температуры."),
          new Paragraph("Избегать агрессивных воздействий."),

          new Paragraph({ text: "5. Обслуживание и уход", style: "Heading2" }),
          new Paragraph("Регулярно проводить визуальный осмотр изделия."),
          new Paragraph("Очищать от загрязнений безопасными методами."),
          new Paragraph("Проводить плановое техническое обслуживание."),
          new Paragraph("Использовать только рекомендованные материалы и инструменты."),

          new Paragraph({ text: "6. Возможные неисправности и способы их устранения", style: "Heading2" }),
          new Table({
            width: { size: 100, type: "pct" },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Неисправность", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Возможная причина", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Способ устранения", bold: true })] })
                ]
              }),
              new TableRow({ children: [0,1,2].map(() => new TableCell({ children: [new Paragraph("")] })) }),
              new TableRow({ children: [0,1,2].map(() => new TableCell({ children: [new Paragraph("")] })) })
            ]
          }),

          new Paragraph({ text: "7. Условия хранения и транспортировки", style: "Heading2" }),
          new Paragraph("Хранить в сухом помещении, защищённом от влаги."),
          new Paragraph("Избегать механических воздействий."),
          new Paragraph("Транспортировать в заводской упаковке."),
          new Paragraph("Избегать вибрации и ударов."),

          new Paragraph({ text: "8. Гарантийные обязательства", style: "Heading2" }),
          new Paragraph("Изготовитель гарантирует соответствие изделия требованиям."),
          new Paragraph("Гарантийный срок действует с момента передачи изделия."),
          new Paragraph("Гарантия не распространяется на случаи нарушения условий эксплуатации."),
          new Paragraph("Ремонт выполняется уполномоченными организациями."),

          new Paragraph({ text: "9. Отметки о приемке", style: "Heading2" }),
          new Paragraph("• Изделие изготовлено и соответствует НТД."),
          new Paragraph(`• Дата приемки: ${data.dateAcceptance}`),
          new Paragraph("• Подпись контролёра ОТК: ________________________"),
          new Paragraph("• Штамп ОТК: _____________________________________")
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
