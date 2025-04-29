import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Notyf } from 'notyf';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notyf = new Notyf();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      console.error('Authentication error:', error);
      notyf.error('Authentication failed');
      navigate('/login');
      return;
    }

    if (!token) {
      console.error('No token received');
      notyf.error('Authentication failed');
      navigate('/login');
      return;
    }

    // Store the token
    localStorage.setItem('token', token);
    
    // Notify success and redirect
    notyf.success('Successfully logged in');
    window.dispatchEvent(new Event('tokenChange'));
    navigate('/products');

  }, [navigate, location.search]);

  return (
    <div className="text-center mt-5">
      <h3>Processing Google authentication...</h3>
    </div>
  );
};

export default GoogleCallback;