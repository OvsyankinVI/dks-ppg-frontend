import React, { useState } from 'react';
import PassportTable from './components/PassportTable';
import Login from './components/Login';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  if (!localStorage.getItem('token')) {
    return <Login onLogin={(r)=>setRole(r)} />;
  }

  return (
    <div>
      <h1>Паспортная система</h1>
      <PassportTable />
    </div>
  );
}

export default App;