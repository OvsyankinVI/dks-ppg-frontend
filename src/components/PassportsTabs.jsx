import React, { useState } from 'react';
import ExcelPasteTable from './ExcelPasteTable';

const passportTypesByEquipment = {
  "ДКС": {
    "Одностраничные": ["Название", "Модель", "Серийный номер", "Примечание"],
    "КИПиА": ["Название", "Тип", "Диапазон", "Примечание"],
    "Компрессор": ["Название", "Модель", "Производительность", "Давление", "Примечание"],
    "Двигатель": ["Название", "Мощность", "Напряжение", "Примечание"],
    "Насос": ["Название", "Модель", "Производительность", "Примечание"],
    "Сепаратор": ["Название", "Модель", "Производительность", "Примечание"],
    "Фильтр-сепаратор": ["Название", "Модель", "Производительность", "Примечание"]
  },
  "ППГ": {
    "Одностраничные": ["Название", "Модель", "Примечание"],
    "КИПиА": ["Название", "Тип", "Диапазон", "Примечание"],
    "Сосуд": ["Название", "Объем", "Давление", "Примечание"],
    "Двигатель": ["Название", "Мощность", "Напряжение", "Примечание"],
    "Насос": ["Название", "Модель", "Производительность", "Примечание"],
    "Сепаратор": ["Название", "Модель", "Примечание"],
    "Фильтр": ["Название", "Модель", "Примечание"]
  }
};

const PassportsTabs = ({ onGenerate }) => {
  const [activeEquipment, setActiveEquipment] = useState("ДКС");
  const [activePassportType, setActivePassportType] = useState(Object.keys(passportTypesByEquipment["ДКС"])[0]);

  const passportTypes = passportTypesByEquipment[activeEquipment];

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        {Object.keys(passportTypesByEquipment).map(eq => (
          <button
            key={eq}
            className={`px-4 py-2 rounded ${activeEquipment === eq ? 'tab-active' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveEquipment(eq);
              setActivePassportType(Object.keys(passportTypesByEquipment[eq])[0]);
            }}
          >
            {eq}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {Object.keys(passportTypes).map(type => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${activePassportType === type ? 'tab-active' : 'bg-gray-200'}`}
            onClick={() => setActivePassportType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <ExcelPasteTable
        columns={passportTypes[activePassportType]}
        placeholder="Вставьте данные для генерации паспортов"
      />

      <div className="mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => onGenerate(activeEquipment, activePassportType)}
        >
          Сгенерировать PDF/Docx
        </button>
      </div>
    </div>
  );
};

export default PassportsTabs;
