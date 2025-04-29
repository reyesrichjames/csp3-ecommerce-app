import { useEffect } from 'react';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export const useAuthPersist = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const userDetails = localStorage.getItem('userDetails');
        
        if (token && userDetails) {
          const user = JSON.parse(userDetails);
          setUser(user);
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
      }
    };

    checkAuthStatus();
  }, [setUser]);
};