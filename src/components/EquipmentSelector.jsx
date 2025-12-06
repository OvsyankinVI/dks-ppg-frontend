import React from 'react';

const EquipmentSelector = ({ activeEquipment, setActiveEquipment }) => {
  const equipments = ['ДКС', 'ППГ'];

  return (
    <div className="flex gap-4 mt-8 mb-4 justify-center">
      {equipments.map(eq => (
        <button
          key={eq}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base
        ${activeEquipment === eq ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setActiveEquipment(eq)}
        >
          {eq}
        </button>
      ))}
    </div>
  );
};

export default EquipmentSelector;
