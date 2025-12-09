import React, { useState } from 'react';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateDOCX } from "../utils/generateDOCX";
import { generateDOCXtoZip } from "../utils/generateDOCXtozip";

export default function PassportTable() {
  const emptyRow = { 
    name: "",
    type: "",
    code: "",
    manufacturer: "",
    manufacturerAddress: "",
    serial: "",
    purpose: "",
    specs: "",
    dateAcceptance: "",
    selected: false
  };

  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [selectMode, setSelectMode] = useState(false);

  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const clearTable = () => setRows([{ ...emptyRow }]);
  const removeRow = (i) => {
    const copy = [...rows];
    copy.splice(i, 1);
    setRows(copy.length ? copy : [{ ...emptyRow }]);
  };

  const update = (i, field, value) => {
    const copy = [...rows];
    copy[i][field] = value;
    setRows(copy);
  };

  const validateRow = (r) => {
    return (
      r.name &&
      r.type &&
      r.code &&
      r.manufacturer &&
      r.manufacturerAddress &&
      r.specs &&
      r.dateAcceptance
    );
  };
  const downloadPassport = (row) => {
    if (!validateRow(row)) {
      alert("Заполните все обязательные поля перед скачиванием!");
      return;
    }
  
    // Получаем сегодняшнюю дату в формате YYYYMMDD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;
  
    // Формируем уникальное имя файла
    const filename = `Паспорт_${dateStr}-${row.code}`;
  
    // Передаем название внутрь DOCX
    generateDOCX(row, filename);
  };



  const downloadSelectedPassports = async () => {
  const selected = rows.filter(r => r.selected);

  if (!selected.length) {
    alert("Выберите хотя бы один паспорт");
    return;
  }

  const zip = new JSZip();

  // Используем for..of с await вместо map, чтобы избежать проблем с ссылками
  for (const r of selected) {
    try {
      const rowData = { ...r }; // отдельная копия строки
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}${mm}${dd}`;

      const filename = `Паспорт_${dateStr}-${rowData.code}`;
      const blob = await generateDOCXtoZip(rowData);
      zip.file(`${filename}.docx`, blob);
    } catch (err) {
      console.error("Ошибка при генерации паспорта:", err);
      alert(`Не удалось сгенерировать паспорт для ${r.name}`);
    }
  }

  const archive = await zip.generateAsync({ type: "blob" });
  saveAs(archive, "Паспорта.zip");
};

const toggleSelectAll = () => {
  const allSelected = rows.every(r => r.selected); // проверяем, все ли уже выбраны
  const newRows = rows.map(r => ({ ...r, selected: !allSelected }));
  setRows(newRows);
};

  
  
  

  // Новая функция: вставка данных из буфера
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert("Буфер пуст");
        return;
      }

      // Разбиваем текст на строки
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
      const newRows = lines.map(line => {
        const cells = line.split(/\t/); // предполагаем, что таблица скопирована с табуляцией
        return {
          name: cells[0] || "",
          type: cells[1] || "",
          code: cells[2] || "",
          manufacturer: cells[3] || "",
          manufacturerAddress: cells[4] || "",
          serial: cells[5] || "",
          specs: cells[6] || "",
          dateAcceptance: cells[7] || "",
          selected: false
        };
      });

      setRows([...rows, ...newRows]);

    } catch (err) {
      console.error(err);
      alert("Ошибка при вставке данных из буфера обмена");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <button onClick={() => setSelectMode(!selectMode)}>
            {selectMode ? "Скрыть выбор" : "Выбрать паспорта"}
          </button>

          <button onClick={pasteFromClipboard} style={{ marginLeft: 10 }}>
            Вставить данные
          </button>
        </div>
      </div>

      <div style={{ maxHeight: "800px", overflowY: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {selectMode && (
                <th onClick={toggleSelectAll} style={{ cursor: "pointer", userSelect: "none" }}>
                  ☑️
                </th>
              )}

              <th style={{ maxWidth: 120 }}>Наименование*</th>
              <th style={{ maxWidth: 100 }}>Тип/модель/обозн.*</th>
              <th style={{ maxWidth: 80 }}>Код/артикул*</th>
              <th style={{ maxWidth: 120 }}>Изготовитель*</th>
              <th style={{ maxWidth: 150 }}>Адрес изготовителя*</th>
              <th style={{ maxWidth: 100 }}>Серийный номер</th>
              <th style={{ maxWidth: 150 }}>Тех. характеристики*</th>
              <th style={{ maxWidth: 120 }}>Дата приемки*</th>
              <th>⬇️</th>
              <th>🗑️</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                  {selectMode && (
                  <td>
                    <input
                      type="checkbox"
                      checked={r.selected}
                      onChange={e => update(i, "selected", e.target.checked)}
                    />
                  </td>
                )}
                <td><input value={r.name} onChange={e => update(i, "name", e.target.value)} /></td>
                <td><input value={r.type} onChange={e => update(i, "type", e.target.value)} /></td>
                <td><input value={r.code} onChange={e => update(i, "code", e.target.value)} /></td>
                <td><input value={r.manufacturer} onChange={e => update(i, "manufacturer", e.target.value)} /></td>
                <td><input value={r.manufacturerAddress} onChange={e => update(i, "manufacturerAddress", e.target.value)} /></td>
                <td><input value={r.serial} onChange={e => update(i, "serial", e.target.value)} /></td>
                
                <td>
                  <textarea
                    value={r.specs}
                    onChange={e => update(i, "specs", e.target.value)}
                    rows={3}
                    style={{ width: "100%" }}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={r.dateAcceptance}
                    onChange={e => update(i, "dateAcceptance", e.target.value)}
                  />
                </td>

                <td><button onClick={() => downloadPassport(r)}>⬇️</button></td>
                <td><button onClick={() => removeRow(i)}>🗑️</button></td>

                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={addRow}>Добавить строку</button>
        <button onClick={clearTable} style={{ marginLeft: 10 }}>Очистить таблицу</button>

        {selectMode && (
          <button onClick={downloadSelectedPassports} style={{ marginLeft: 10 }}>
            Скачать паспорта
          </button>
        )}   
      </div>
    </div>
  );
}
