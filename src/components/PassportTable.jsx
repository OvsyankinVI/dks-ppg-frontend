import React, { useState } from 'react';
import { generatePDF } from '../utils/generatePDF';
import { generateDOCX } from '../utils/generateDOCX';

export default function PassportTable() {
  const [rows, setRows] = useState([
    { model:'', serial:'', date:'', pressure:'', power:'', notes:'' }
  ]);

  const addRow = () => setRows([...rows, { model:'', serial:'', date:'', pressure:'', power:'', notes:'' }]);

  const update = (i, field, value) => {
    const copy = [...rows];
    copy[i][field] = value;
    setRows(copy);
  };

  const createPassports = () => {
    rows.forEach(row => {
      const filename = `Компрессор_${row.serial || Math.random().toString(36).slice(2,8)}`;
      const data = { type: 'Компрессор', ...row };
      generatePDF(data, filename);
      generateDOCX(data, filename);
    });
  };

  return (
    <div>
      <h2>Паспорта — Компрессор</h2>
      <table>
        <thead>
          <tr>
            <th>Модель*</th><th>Серийный номер*</th><th>Дата*</th><th>Давление*</th><th>Мощность</th><th>Примечания</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>
              <td><input value={r.model} onChange={e=>update(i,'model',e.target.value)} required/></td>
              <td><input value={r.serial} onChange={e=>update(i,'serial',e.target.value)} required/></td>
              <td><input value={r.date} onChange={e=>update(i,'date',e.target.value)} required/></td>
              <td><input value={r.pressure} onChange={e=>update(i,'pressure',e.target.value)} required/></td>
              <td><input value={r.power} onChange={e=>update(i,'power',e.target.value)}/></td>
              <td><input value={r.notes} onChange={e=>update(i,'notes',e.target.value)}/></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow}>Добавить строку</button>
      <button onClick={createPassports}>Создать паспорта (PDF + DOCX)</button>
      <p>* — обязательные поля</p>
    </div>
  );
}
