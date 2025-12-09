import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell 
} from "docx";

export async function generateDOCXtoZip(data) {

  // Получаем сегодняшнюю дату в формате YYYYMMDD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  // Формируем уникальное имя документа (для заголовка внутри файла)
  const docTitle = `Паспорт_${dateStr}-${data.code}`;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 22  // 11 pt
          }
        }
      },
      paragraphStyles: [
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            bold: true,
            size: 24,   // 12 pt
            font: "Times New Roman"
          },
          paragraph: {
            spacing: { before: 200, after: 100 }
          }
        }
      ]
    },

    sections: [
      {
        children: [

          // Заголовок — динамический
          new Paragraph({
            children: [
              new TextRun({
                text: docTitle, // вместо "ПАСПОРТ ИЗДЕЛИЯ"
                bold: true,
                size: 28
              })
            ]
          }),

          // --- 1. Общие сведения ---
          new Paragraph({ text: "1. Общие сведения", style: "Heading2" }),
          new Paragraph(`• Наименование изделия: ${data.name}`),
          new Paragraph(`• Тип / Модель / Обозначение: ${data.type}`),
          new Paragraph(`• Код/Артикул: ${data.code}`),
          new Paragraph(`• Изготовитель: ${data.manufacturer}`),
          new Paragraph(`• Адрес изготовителя: ${data.manufacturerAddress}`),
          new Paragraph(`• Серийный номер (при наличии): ${data.serial || "-"}`),

          // --- 2. Основные технические характеристики ---
          new Paragraph({ text: "2. Основные технические характеристики", style: "Heading2" }),
          new Paragraph(data.specs),

          // --- 3. Состав и комплектность ---
          new Paragraph({ text: "3. Состав и комплектность", style: "Heading2" }),
          new Paragraph(`1. ${data.name} — 1 шт.`),
          new Paragraph("2. Паспорт — 1 экз."),

          // --- 4. Условия эксплуатации ---
          new Paragraph({ text: "4. Условия эксплуатации", style: "Heading2" }),
          new Paragraph("• Окружающая среда не должна выходить за пределы допустимых значений."),
          new Paragraph("• Монтаж — квалифицированным персоналом."),
          new Paragraph("• Не превышать предельные нагрузки и температуры."),
          new Paragraph("• Избегать агрессивных воздействий."),

          // --- 5. Требования безопасности ---
          new Paragraph({ text: "5. Требования безопасности", style: "Heading2" }),
          new Paragraph("• Использовать изделие только по назначению."),
          new Paragraph("• Монтаж выполнять обученным персоналом."),
          new Paragraph("• Соблюдать нормы безопасности."),
          new Paragraph("• Применять средства индивидуальной защиты."),

          // --- 6. Обслуживание ---
          new Paragraph({ text: "6. Обслуживание и уход", style: "Heading2" }),
          new Paragraph("• Регулярно проводить визуальный осмотр изделия."),
          new Paragraph("• Очищать от загрязнений безопасными методами."),
          new Paragraph("• Проводить плановое техническое обслуживание."),
          new Paragraph("• Использовать только рекомендованные материалы и инструменты."),

          // --- 7. Таблица неисправностей ---
          new Paragraph({ text: "7. Возможные неисправности и способы их устранения", style: "Heading2" }),
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
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({ children: [new Paragraph("")] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({ children: [new Paragraph("")] })
                ]
              })
            ]
          }),

          // --- 8. Условия хранения ---
          new Paragraph({ text: "8. Условия хранения и транспортировки", style: "Heading2" }),
          new Paragraph("• Хранить в сухом помещении, защищённом от влаги."),
          new Paragraph("• Избегать механических воздействий."),
          new Paragraph("• Транспортировать в заводской упаковке."),
          new Paragraph("• Избегать вибрации и ударов."),

          // --- 9. Гарантия ---
          new Paragraph({ text: "9. Гарантийные обязательства", style: "Heading2" }),
          new Paragraph("• Изготовитель гарантирует соответствие изделия требованиям."),
          new Paragraph("• Гарантийный срок действует с момента передачи изделия."),
          new Paragraph("• Гарантия не распространяется на случаи нарушения условий эксплуатации."),
          new Paragraph("• Ремонт выполняется уполномоченными организациями."),

          // --- 10. Приёмка ---
          new Paragraph({ text: "10. Отметки о приемке", style: "Heading2" }),
          new Paragraph("• Изделие изготовлено и соответствует НТД."),
          new Paragraph(`• Дата приемки: ${data.dateAcceptance}`),
          new Paragraph("• Подпись контролёра ОТК: ________________________"),
          new Paragraph("• Штамп ОТК: _____________________________________")
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
