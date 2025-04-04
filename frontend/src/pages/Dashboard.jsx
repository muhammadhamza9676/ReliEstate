import React from 'react';
import { useSelector } from 'react-redux';  // To access Redux state
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);  // Access user data from Redux state

  return (
    <>
    <Navbar/>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {user ? user.name : 'Guest'}!</h1>
    </div>
    </>
  );
};

export default Dashboard;
