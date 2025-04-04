import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
}

// src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Route, Navigate } from 'react-router-dom'; // Use Navigate instead of Redirect
// import { useSelector } from 'react-redux';

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const { isAuthenticated } = useSelector((state) => state.auth); // Check if user is authenticated

//   return (
//     <Route
//       {...rest}
//       element={ // In v6, element replaces render and component props
//         isAuthenticated ? (
//           <Component /> // If authenticated, render the component
//         ) : (
//           <Navigate to="/login" replace /> // If not authenticated, redirect to login page
//         )
//       }
//     />
//   );
// };

// export default ProtectedRoute;

