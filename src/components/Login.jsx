import React, { useState } from 'react';
import API from '../api/api';
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const r = await API.post('/login', { username, password });

      localStorage.setItem('token', r.data.token);
      localStorage.setItem('role', r.data.role);

      // ✅ всплывающее уведомление об успешной авторизации
      toast.success("Успешная авторизация");

      onLogin(r.data.role);
    } catch (e) {
      toast.error(e.response?.data?.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
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
            <input
              placeholder="Логин"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
            />
            <input
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            className='btn-primary'
            onClick={submit}
            disabled={loading}
          >
            Войти
            {loading && (
              <span className="dot-loader">
                <span></span>
                <span></span>
                <span></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
