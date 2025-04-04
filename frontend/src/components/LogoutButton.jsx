// src/components/LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // For navigation after logout
import { logout } from '../redux/slices/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());  // Dispatch the logout action
    navigate('/login');  // Redirect to login page after logout
  };

  return (
    <button onClick={handleLogout} className="bg-blue-500 text-black p-2 rounded">
      Logout
    </button>
  );
};

export default LogoutButton;
