import React, { useState } from 'react';
import API from '../api/api';
import logo from "../assets/logo.png";


export default function Login({ onLogin }) {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const submit = async () => {
    try {
      const r = await API.post('/login', { username, password });
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('role', r.data.role);
      onLogin(r.data.role);
    } catch(e) {
      alert(e.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
     <div>
      <header className="header">
            <div className="header-left">
              <div className="logo">
                <img src={logo} alt="Логотип" height="40" />  
              </div>
              <h2 className="page-title">Documentation</h2>
            </div>
      </header>
      <div className="auth-container">
        <div className="auth">
          <h2 className='auth-h2'>Авторизация</h2>
            <div className="auth-inputs">
              <input placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} />
              <input placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className='btn-primary' onClick={submit}>Войти</button>
        </div>
      </div>
    </div>
  );
}
