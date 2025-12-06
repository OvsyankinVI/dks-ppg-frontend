import React, { useState, useEffect } from "react";

const ExcelPasteTable = ({ columns, placeholder }) => {
  const [data, setData] = useState([]);

  // Заполнение первой строки тестовыми данными
  useEffect(() => {
    const testRow = columns.map((col, index) => `${col} ${index + 1}`);
    setData([testRow]);
  }, [columns]);

  const handlePaste = (e) => {
    e.preventDefault();
    const clipboard = e.clipboardData.getData("text/plain");
    const rows = clipboard.split("\n").map(r => r.split("\t"));
    setData(prev => [...prev, ...rows]);
  };

  const addRow = () => {
    setData(prev => [...prev, columns.map(() => "")]);
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const deleteRow = (rowIndex) => {
    setData(prev => prev.filter((_, i) => i !== rowIndex));
  };

  return (
    <div className="overflow-auto card p-2">
      <div className="mb-2 flex flex-wrap gap-2">
        <button onClick={addRow} className="bg-blue-500 text-white px-4 py-2 rounded">Добавить строку</button>
      </div>
      <table className="w-full border border-gray-200 min-w-[600px] sm:min-w-full">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {columns.map(col => (
              <th key={col} className="p-2 border">{col}</th>
            ))}
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length + 1}>
              <textarea
                className="w-full h-24 border p-2 resize-none"
                placeholder={placeholder}
                onPaste={handlePaste}
              />
            </td>
          </tr>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border p-1">
                  <input
                    type="text"
                    value={cell}
                    onChange={e => updateCell(i, j, e.target.value)}
                    className="w-full border-none p-1"
                  />
                </td>
              ))}
              <td className="border p-1 text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => deleteRow(i)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelPasteTable;
