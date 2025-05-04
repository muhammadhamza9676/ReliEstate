// src/components/LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // For navigation after logout
import { logout } from '../redux/slices/authSlice';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());  // Dispatch the logout action
    navigate('/login');  // Redirect to login page after logout
  };

  return (
    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:text-red-800">
      <LogOut className="h-4 w-4 mr-2 inline" />
      Sign Out
    </button>
  );
};

export default LogoutButton;
