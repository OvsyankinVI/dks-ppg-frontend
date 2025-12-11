import React from "react";
import PassportTable from "./components/PassportTable";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <img src={logo} alt="Логотип" height="40" />  
          </div>
          <h2 className="page-title">Documentation</h2>
          
        </div>

        {/* <div className="header-right">
          <nav className="nav">
              <a>Паспортная система</a>
              <a>Documents</a>
              <a>Pages</a>
            </nav>
        </div> */}
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
