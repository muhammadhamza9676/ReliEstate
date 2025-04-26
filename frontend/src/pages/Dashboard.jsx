import React from 'react';
import { useSelector } from 'react-redux';  // To access Redux state
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);  // Access user data from Redux state

  return (
    <>
    <Navbar/>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {user ? user.name : 'Guest'}!</h1>
      <p>Browse Listings:</p>
      <Link to="/browse"> See</Link>
      <p>Add Property:</p>
      <Link to="/add-property"> See</Link>
      <p>My Inquiries:</p>
      <Link to="/inquiries"> See</Link>
      <p className='font-bold'>1.Todo: User Profile where user could Complete Thier Profile</p>
      <p className='font-bold'>2.My Listings</p>
      <p>Showing all the properties in minimum details like in browse page of the user loggedin with button to update / Delete them.</p>
    </div>
    </>
  );
};

export default Dashboard;
