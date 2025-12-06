import React, { useState } from 'react';
import Login from './components/Login';
import PassportTable from './components/PassportTable';
import ExcelPasteTable from './components/ExcelPasteTable';
import Navbar from './components/Navbar';
import UsersTable from './components/UsersTable';
import PassportsTabs from './components/PassportsTabs';
import EquipmentSelector from './components/EquipmentSelector';
import PassportTypesBlock from './components/PassportTypesBlock';

function App() {
  const [userRole, setUserRole] = useState("admin"); // или "user"
  const [section, setSection] = useState("passports");
  const [activeEquipment, setActiveEquipment] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', login: 'admin', role: 'admin', active: true }
  ]);

  const handleGenerate = (equipment, passportType) => {
    alert(`Генерация паспорта для ${equipment} - ${passportType}`);
    // Здесь можно вызвать backend для генерации PDF/Docx
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar userRole={userRole} setSection={setSection} />

      {section === "users" && userRole === "admin" && <UsersTable users={users} setUsers={setUsers} />}
      {section === "passports" && (
        <div className="p-6">
          <EquipmentSelector activeEquipment={activeEquipment} setActiveEquipment={setActiveEquipment} />
          <PassportTypesBlock activeEquipment={activeEquipment} onGenerate={handleGenerate} />
        </div>
      )}
    </div>
  );
}

export default App;


