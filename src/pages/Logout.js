import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
  const { setUser, unsetUser } = useContext(UserContext);

  // Clear user data immediately
  unsetUser();
  setUser({
    id: null,
    isAdmin: null
  });

  // Directly navigate to the courses page
  return <Navigate to="/courses" />;
}