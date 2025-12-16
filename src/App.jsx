import React, { useEffect, useState } from "react";
import PassportTable from "./components/PassportTable";
import logo from "./assets/logo.png";
import Login from './components/Login';

function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });

  // Проверяем, есть ли токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (!token && !storedRole) {
      // Нет токена — показываем форму
      return;
    }

    // Если есть токен, но нет роли — обновляем роль
    if (token && !storedRole) {
      // Здесь можно сделать запрос на сервер для получения роли,
      // но пока просто используем роль из localStorage
    }

    setRole(storedRole);
  }, []);

  const handleLogin = (newRole) => {
    setRole(newRole);
  };

  if (!localStorage.getItem('token')) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <img src={logo} alt="Логотип" height="40" />  
          </div>
          <h2 className="page-title">Documentation</h2>
        </div>
      </header>

      <main className="content">
        <PassportTable />
      </main>

      <footer className="footer">
        ВЕРСИЯ 0.1.3
      </footer>
    </div>
  );
}

export default App;