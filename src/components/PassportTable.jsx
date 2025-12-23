import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateFromTemplate } from "../utils/generateFromTemplate";

export default function PassportTable() {

  const emptyRow = {
    installationNumber: "",
    designation: "",
    isKIP: false,

    name: "",
    type: "",
    code: "",
    manufacturer: "",
    manufacturerAddress: "",
    serial: "",
    specs: "",
    dateAcceptance: "",
    selected: false,
  };

  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [selectMode, setSelectMode] = useState(false);

  /* ==================== CRUD ==================== */

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

  /* ==================== VALIDATION ==================== */

  const validateRow = (r) => (
    r.installationNumber &&
    r.designation &&
    r.name &&
    r.type &&
    r.code &&
    r.manufacturer &&
    r.manufacturerAddress &&
    r.specs &&
    r.dateAcceptance
  );

  /* ==================== DOWNLOAD ==================== */

  const downloadPassport = async (row) => {
    if (!validateRow(row)) {
      alert("Заполните все обязательные поля");
      return;
    }
    await generateFromTemplate(row);
  };

  const downloadSelectedPassports = async () => {
    const selected = rows.filter(r => r.selected);

    if (!selected.length) {
      alert("Выберите хотя бы один паспорт");
      return;
    }

    const zip = new JSZip();

    for (const r of selected) {
      if (!validateRow(r)) continue;

      const blob = await generateFromTemplate(r, true);
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      zip.file(`Паспорт_${dateStr}-${r.code}.docx`, blob);
    }

    const archive = await zip.generateAsync({ type: "blob" });
    saveAs(archive, "Паспорта.zip");
  };

  const toggleSelectAll = () => {
    const allSelected = rows.every(r => r.selected);
    setRows(rows.map(r => ({ ...r, selected: !allSelected })));
  };

  /* ==================== PASTE FROM CLIPBOARD ==================== */

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return;

      const rawLines = text.split(/\r?\n/).filter(l => l.trim() !== "");
      const colCount = rawLines[0].split(/\t/).length;

      let joined = [];
      let buffer = [];

      for (let line of rawLines) {
        const cells = line.split(/\t/);
        if (cells.length === colCount) {
          if (buffer.length) {
            joined.push(buffer.join("\n"));
            buffer = [];
          }
          buffer.push(line);
        } else {
          buffer.push(line);
        }
      }
      if (buffer.length) joined.push(buffer.join("\n"));

      const newRows = joined.map(rowText => {
        const cells = rowText.split(/\t/);
        return {
          ...emptyRow,
          installationNumber: cells[0] || "",
          designation: cells[1] || "",
          name: cells[2] || "",
          type: cells[3] || "",
          code: cells[4] || "",
          manufacturer: cells[5] || "",
          manufacturerAddress: cells[6] || "",
          serial: cells[7] || "",
          specs: (cells[8] || "").replace(/^"+|"+$/g, ""),
          dateAcceptance: cells[9] || "",
        };
      });

      setRows(prev => [...prev, ...newRows]);

    } catch (e) {
      console.error(e);
      alert("Ошибка при вставке данных");
    }
  };

  /* ==================== UI ==================== */

  return (
    <div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button className="btn-main" onClick={() => setSelectMode(!selectMode)}>
          {selectMode ? "Скрыть выбор" : "Выбрать паспорта"}
        </button>

        <button className="btn-main" onClick={pasteFromClipboard}>
          Вставить данные
        </button>

        <button className="btn-main" onClick={addRow}>
          Добавить строку
        </button>

        <button className="btn-main" onClick={clearTable}>
          Очистить таблицу
        </button>
      </div>

      <div style={{ maxHeight: 750, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {selectMode && (
                <th onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                  ☑️
                </th>
              )}
              <th>№ установки*</th>
              <th>Обозначение*</th>
              <th>КИПиА</th>
              <th>Наименование*</th>
              <th>Тип*</th>
              <th>Артикул*</th>
              <th>Изготовитель*</th>
              <th>Адрес изготовителя*</th>
              <th>Заводской номер</th>
              <th>Тех. характеристики*</th>
              <th>Дата приемки*</th>
              <th></th>
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

                <td><input value={r.installationNumber} onChange={e => update(i, "installationNumber", e.target.value)} /></td>
                <td><input value={r.designation} onChange={e => update(i, "designation", e.target.value)} /></td>
                <td className="td_kipia"><input type="checkbox" checked={r.isKIP} onChange={e => update(i, "isKIP", e.target.checked)} /></td>
                <td><input value={r.name} onChange={e => update(i, "name", e.target.value)} /></td>
                <td><input value={r.type} onChange={e => update(i, "type", e.target.value)} /></td>
                <td><input value={r.code} onChange={e => update(i, "code", e.target.value)} /></td>
                <td><input value={r.manufacturer} onChange={e => update(i, "manufacturer", e.target.value)} /></td>
                <td><input value={r.manufacturerAddress} onChange={e => update(i, "manufacturerAddress", e.target.value)} /></td>
                <td><input value={r.serial} onChange={e => update(i, "serial", e.target.value)} /></td>
                <td>
                  <textarea
                    rows={3}
                    value={r.specs}
                    onChange={e => update(i, "specs", e.target.value)}
                  />
                </td>
                <td><input value={r.dateAcceptance} onChange={e => update(i, "dateAcceptance", e.target.value)} /></td>
                <td>
                  <button title="Скачать" onClick={() => downloadPassport(r)}>⬇️</button>
                  <button title="Удалить" onClick={() => removeRow(i)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectMode && (
        <button className="btn-main" onClick={downloadSelectedPassports}>
          Скачать паспорта
        </button>
      )}
    </div>
  );
}
