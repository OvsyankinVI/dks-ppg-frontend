import React, { useState } from 'react';
import API from '../api/api';

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
      <h2>Вход</h2>
      <input placeholder="Логин" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>Войти</button>
    </div>
  );
}
