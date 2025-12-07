import React, { useState } from "react";
import { generatePDF } from "../utils/generatePDF";
import { generateDOCX } from "../utils/generateDOCX";

export default function PassportTypesBlock({ activeInstallation }) {
  const [activePassportType, setActivePassportType] = useState(null);

  // Колонки — соответствуют старым рабочим шаблонам
  const columns = [
    { key: "model", label: "Модель*" },
    { key: "serial", label: "Серийный номер*" },
    { key: "date", label: "Дата*" },
    { key: "pressure", label: "Давление*" },
    { key: "power", label: "Мощность" },
    { key: "notes", label: "Примечания" }
  ];

  const emptyRow = {
    model: "",
    serial: "",
    date: "",
    pressure: "",
    power: "",
    notes: ""
  };

  const [rows, setRows] = useState([ { ...emptyRow } ]);

  // Выбор типа паспорта
  const selectPassportType = (type) => {
    setActivePassportType(type);
    setRows([ { ...emptyRow } ]);
  };

  // Добавление строки
  const addRow = () => setRows([...rows, { ...emptyRow }]);

  // Удаление строки
  const deleteRow = (index) => {
    const copy = [...rows];
    copy.splice(index, 1);
    if (copy.length === 0) copy.push({ ...emptyRow });
    setRows(copy);
  };

  // Обновление значения в ячейке
  const updateCell = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    setRows(updated);
  };

  // Вставка таблицы из Excel
  const pasteFromExcel = (e) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;

    const lines = text.trim().split("\n");
    const newRows = lines.map((line) => {
      const cells = line.split("\t");
      const rowObj = { ...emptyRow };

      columns.forEach((col, i) => {
        rowObj[col.key] = cells[i] || "";
      });

      return rowObj;
    });

    setRows(newRows);
  };

  // Генерация PDF + DOCX
  const handleGenerate = () => {
    if (!activePassportType) {
      alert("Выберите тип паспорта");
      return;
    }

    rows.forEach((row) => {
      const filename =
        `${activePassportType}_` +
        (row.serial || Math.random().toString(36).slice(2, 8));

      const data = {
        type: activePassportType,
        installation: activeInstallation,
        ...row
      };

      generatePDF(data, filename);
      generateDOCX(data, filename);
    });
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>
        Тип паспорта
      </h2>

      {/* Таб кнопки типов */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {[
          "Компрессор",
          "Осушитель",
          "Фильтр",
          "Двигатель",
          "Сосуд",
          "КИПиА",
          "Простое оборудование",
          "Одностраничные"
        ].map((type) => (
          <div
            key={type}
            onClick={() => selectPassportType(type)}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              border: "1px solid #ddd",
              background:
                activePassportType === type ? "#f2564d" : "white",
              color:
                activePassportType === type ? "white" : "#333",
              transition: "0.25s"
            }}
          >
            {type}
          </div>
        ))}
      </div>

      {/* Таблица параметров */}
      {activePassportType && (
        <div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      borderBottom: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "left",
                      background: "#fafafa"
                    }}
                  >
                    {col.label}
                  </th>
                ))}
                <th style={{ width: "40px" }}></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: "6px" }}>
                      <input
                        value={row[col.key]}
                        onChange={(e) =>
                          updateCell(i, col.key, e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "6px",
                          border: "1px solid #ccc",
                          borderRadius: "6px"
                        }}
                        onPaste={pasteFromExcel}
                      />
                    </td>
                  ))}

                  <td>
                    <button
                      onClick={() => deleteRow(i)}
                      style={{
                        background: "#ff5959",
                        border: "none",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            style={{
              padding: "10px 16px",
              background: "#ddd",
              borderRadius: "10px",
              border: "none",
              marginRight: "10px",
              cursor: "pointer"
            }}
          >
            Добавить строку
          </button>

          <button
            onClick={handleGenerate}
            style={{
              padding: "10px 16px",
              background: "#f2564d",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Сгенерировать PDF / DOCX
          </button>
        </div>
      )}
    </div>
  );
}
