import React, { useState } from 'react';
import Login from './components/Login';
import PassportTable from './components/PassportTable';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  if (!localStorage.getItem('token')) {
    return <Login onLogin={(r)=>setRole(r)} />;
  }

  return (
    <div>
      <h1>DKS/PPG Паспортная система</h1>
      { role === 'admin' && <div><p>Вы — админ. Перейдите в раздел Пользователи (ещё не реализовано в UI)</p></div> }
      <PassportTable />
    </div>
  );
}

export default App;
