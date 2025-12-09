import React, { useState } from 'react';
import PassportTable from './components/PassportTable';
import Login from './components/Login';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [data, setData] = useState([]); // <-- состояние для таблицы

  if (!localStorage.getItem('token')) {
    return <Login onLogin={(r) => setRole(r)} />;
  }

  return (
    <div>
      <header>
        <h1>Паспортная система</h1>
      </header>
      <PassportTable data={data} setData={setData} /> {/* <-- передаем props */}
      {/* Версия в правом нижнем углу */}
      <div
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          fontSize: "12px",
          color: "#555",
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "2px 6px",
          borderRadius: "4px",
          boxShadow: "0 0 4px rgba(0,0,0,0.2)"
        }}
      >
        Версия 0.0.2
      </div>
    </div>
  );
}

export default App;
