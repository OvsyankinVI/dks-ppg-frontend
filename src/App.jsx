import React, { useEffect, useState } from "react";
import PassportTable from "./components/PassportTable";
import logo from "./assets/logo.png";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token && storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (newRole) => {
    setRole(newRole);
  };

  const isAuthorized = !!localStorage.getItem("token");

  return (
    <>
      {isAuthorized ? (
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
      ) : (
        <Login onLogin={handleLogin} />
      )}

      {/* ToastContainer должен быть ВСЕГДА */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
