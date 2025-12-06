import React, { useState } from 'react';
import ExcelPasteTable from './ExcelPasteTable';

const handleGenerate = (equipment, passportType) => {
    alert(`Генерация паспорта для ${equipment} - ${passportType}`);
  };
  

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

const PassportTypesBlock = ({ activeEquipment, onGenerate }) => {
  const [activePassportType, setActivePassportType] = useState(null);

  if (!activeEquipment) return null; // Не показывать блок, пока не выбрано оборудование

  const passportTypes = passportTypesByEquipment[activeEquipment];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Тип паспорта</h3>

      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.keys(passportTypes).map(type => (
          <button
            key={type}
            className={`px-4 py-2 rounded transition-colors
              ${activePassportType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActivePassportType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {activePassportType && (
        <ExcelPasteTable
          columns={passportTypes[activePassportType]}
          placeholder="Вставьте данные для генерации паспортов"
        />
      )}

      {activePassportType && (
        <div className="mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => onGenerate(activeEquipment, activePassportType)}
          >
            Сгенерировать PDF/Docx
          </button>
        </div>
      )}
    </div>
  );
};

export default PassportTypesBlock;
