import React, { useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      id: null,
      isAdmin: false
    });
  };

  const navbarStyle = {
    backgroundColor: '#373a3c',
    padding: '0.5rem 1rem',
  };

  const linkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
  };

  return (
    <Navbar expand="lg" style={navbarStyle}>
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" style={linkStyle}>
          The Zuitt Shop
        </Navbar.Brand>
        
        <Nav className="me-auto">
          {user && user.isAdmin ? (
            <Nav.Link as={NavLink} to="/products" style={linkStyle}>
              Admin Dashboard
            </Nav.Link>
          ) : (
            <Nav.Link as={NavLink} to="/products" style={linkStyle}>
              Products
            </Nav.Link>
          )}
        </Nav>

        <Nav>
          {user && user.id !== null ? (
            // Logged in user
            <>
              {!user.isAdmin && (
                <>
                  <Nav.Link as={NavLink} to="/cart" style={linkStyle}>Cart</Nav.Link>
                  <Nav.Link as={NavLink} to="/orders" style={linkStyle}>Orders</Nav.Link>
                  <Nav.Link as={NavLink} to="/profile" style={linkStyle}>Profile</Nav.Link>
                </>
              )}
              <Nav.Link 
                as={NavLink} 
                to="/logout" 
                onClick={handleLogout} 
                style={linkStyle}
              >
                Log Out
              </Nav.Link>
            </>
          ) : (
            // Not logged in
            <>
              <Nav.Link as={NavLink} to="/login" style={linkStyle}>Log In</Nav.Link>
              <Nav.Link as={NavLink} to="/register" style={linkStyle}>Register</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}