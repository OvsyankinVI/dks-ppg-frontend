import React, { useState } from 'react';
import PassportTable from './components/PassportTable';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);



  return (
    <div>
      <h1>Паспортная система</h1>
      <PassportTable />
    </div>
  );
}

export default App;