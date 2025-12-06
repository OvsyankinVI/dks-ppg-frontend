import React from 'react';

const Navbar = ({ userRole, setSection }) => {
  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
      {/* Паспорта слева */}
      <div>
        <span
          className="text-lg font-semibold cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => setSection('passports')}
        >
          Паспорта
        </span>
      </div>

      {/* Пользователи справа (только для admin) */}
      <div>
        {userRole === 'admin' && (
          <span
            className="text-lg font-semibold cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => setSection('users')}
          >
            Пользователи
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
