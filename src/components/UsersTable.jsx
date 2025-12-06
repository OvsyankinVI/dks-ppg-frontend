import React, { useState } from 'react';

const UsersTable = ({ users, setUsers }) => {
  const [newUser, setNewUser] = useState({ name: '', login: '', password: '', role: 'user', active: true });

  const addUser = () => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setNewUser({ name: '', login: '', password: '', role: 'user', active: true });
  };

  const toggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="p-4 card overflow-auto">
      <h2 className="text-xl mb-4">Список пользователей</h2>
      <table className="w-full border border-gray-200 mb-4">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="border p-2">ФИО</th>
            <th className="border p-2">Логин</th>
            <th className="border p-2">Роль</th>
            <th className="border p-2">Активен</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => u.active).map(u => (
            <tr key={u.id}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.login}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">{u.active ? 'Да' : 'Нет'}</td>
              <td className="border p-2 flex gap-2">
                <button className="bg-green-500 text-white p-1 rounded" onClick={() => toggleActive(u.id)}>Блок/Разблок</button>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteUser(u.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg mb-2">Добавить нового пользователя</h3>
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="ФИО" value={newUser.name} onChange={e => setNewUser({...newUser, name:e.target.value})} className="border p-1"/>
        <input type="text" placeholder="Логин" value={newUser.login} onChange={e => setNewUser({...newUser, login:e.target.value})} className="border p-1"/>
        <input type="password" placeholder="Пароль" value={newUser.password} onChange={e => setNewUser({...newUser, password:e.target.value})} className="border p-1"/>
        <select value={newUser.role} onChange={e => setNewUser({...newUser, role:e.target.value})} className="border p-1">
          <option value="user">Паспорт</option>
          <option value="admin">Администратор</option>
        </select>
        <button onClick={addUser} className="bg-blue-500 text-white p-2 rounded">Добавить</button>
      </div>
    </div>
  );
};

export default UsersTable;
