// src/components/Navbar.jsx
import React from 'react';
import LogoutButton from './LogoutButton';  // Import LogoutButton

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between">
        <div className="text-lg">My App</div>
        <LogoutButton />  {/* Render LogoutButton here */}
      </div>
    </nav>
  );
};

export default Navbar;
