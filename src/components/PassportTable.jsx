import React, { useState } from 'react';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateDOCX } from "../utils/generateDOCX";


export default function PassportTable() {
  const emptyRow = { model:'', serial:'', date:'', pressure:'', power:'', notes:'', selected:false };

  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [selectMode, setSelectMode] = useState(false);  // режим выбора паспортов

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const clearTable = () => {
    setRows([{ ...emptyRow }]);
  };

  const removeRow = (index) => {
    const copy = [...rows];
    copy.splice(index, 1);
    setRows(copy.length ? copy : [{ ...emptyRow }]);
  };

  const update = (i, field, value) => {
    const copy = [...rows];
    copy[i][field] = value;
    setRows(copy);
  };

  // Валидация строки
  const validateRow = (row) => {
    return row.model && row.serial && row.date && row.pressure;
  };

  const downloadPassport = async (row) => {
    if (!validateRow(row)) {
      alert("Заполните все обязательные поля перед скачиванием!");
      return;
    }

    const filename = `Паспорт_${row.serial || Math.random().toString(36).slice(2, 8)}`;
    const data = { type: 'Паспорт', ...row };
    await generateDOCX(data, filename);
  };

  // Множественное скачивание → ZIP
  const downloadSelectedPassports = async () => {
    const zip = new JSZip();
  
    const selectedRows = rows.filter(r => r.selected);
  
    if (selectedRows.length === 0) {
      alert("Выберите хотя бы один паспорт");
      return;
    }
  
    for (let row of selectedRows) {
      const filename = `Паспорт_${row.serial || Math.random().toString(36).slice(2,8)}`;
      const data = { type: "Паспорт", ...row };
  
      const blob = await generateDOCX(data);   // ✔️ теперь это УНИКАЛЬНЫЙ Blob
      zip.file(`${filename}.docx`, blob);      // ✔️ кладём в ZIP
    }
  
    const archive = await zip.generateAsync({ type: "blob" });
  
    saveAs(archive, "Паспорта.zip");           // ✔️ скачиваем ТОЛЬКО ZIP
  };
  

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
  };

  return (
    <div>

      {/* Верхние кнопки */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        

        <button onClick={toggleSelectMode}>
          {selectMode ? "Скрыть выбор" : "Выбрать паспорта"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Модель*</th>
            <th>Серийный номер*</th>
            <th>Дата*</th>
            <th>Давление*</th>
            <th>Мощность</th>
            <th>Примечания</th>
            <th>⬇️</th>
            <th>🗑️</th>
            {selectMode && <th>Выбрать</th>}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><input value={r.model} onChange={e => update(i, 'model', e.target.value)} /></td>
              <td><input value={r.serial} onChange={e => update(i, 'serial', e.target.value)} /></td>
              <td><input value={r.date} onChange={e => update(i, 'date', e.target.value)} /></td>
              <td><input value={r.pressure} onChange={e => update(i, 'pressure', e.target.value)} /></td>
              <td><input value={r.power} onChange={e => update(i, 'power', e.target.value)} /></td>
              <td><input value={r.notes} onChange={e => update(i, 'notes', e.target.value)} /></td>

              {/* Скачать */}
              <td>
                <button onClick={() => downloadPassport(r)}>⬇️</button>
              </td>

              {/* Удалить */}
              <td>
                <button onClick={() => removeRow(i)}>🗑️</button>
              </td>

              {/* Чекбоксы при выборе */}
              {selectMode && (
                <td>
                  <input
                    type="checkbox"
                    checked={r.selected || false}
                    onChange={e => update(i, 'selected', e.target.checked)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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
