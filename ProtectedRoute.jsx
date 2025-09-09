import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import storageService from '../../service/storageService';

const ProtectedRoute = ({ children, redirect = '/' }) => {
  const user = storageService.getToken();
  
  if (!user) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
