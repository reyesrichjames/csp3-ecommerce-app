import React, { useContext, useRef } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
  const { user, setUser } = useContext(UserContext);
  const navbarToggleRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      id: null,
      isAdmin: false
    });
  };

  // Function to close navbar when a link is clicked
  const closeNavbar = () => {
    // Bootstrap lg breakpoint is 992px, so this covers both mobile and tablet
    if (window.innerWidth < 992 && navbarToggleRef.current && navbarToggleRef.current.classList.contains('collapsed') === false) {
      navbarToggleRef.current.click();
    }
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

  const hamburgerStyle = {
    width: '30px',
    height: '30px',
    position: 'relative',
    padding: '0',
    border: 'none',
    background: 'transparent',
    boxShadow: 'none' // Remove shadow
  };

  const hamburgerLineStyle = {
    width: '100%',
    height: '2px',
    backgroundColor: 'white',
    display: 'block',
    position: 'absolute',
    borderRadius: '3px',
    transition: 'all .3s ease-in-out'
  };

  return (
    <Navbar expand="lg" style={navbarStyle} variant="dark">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" style={linkStyle} onClick={closeNavbar}>
          The Zuitt Shop
        </Navbar.Brand>
        
        <Navbar.Toggle 
          ref={navbarToggleRef}
          aria-controls="basic-navbar-nav"
          style={hamburgerStyle}
          className="shadow-none"
        >
          <span style={{...hamburgerLineStyle, top: '25%'}}></span>
          <span style={{...hamburgerLineStyle, top: '50%', transform: 'translateY(-50%)'}}></span>
          <span style={{...hamburgerLineStyle, bottom: '25%'}}></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && user.isAdmin ? (
              <Nav.Link as={NavLink} to="/products" style={linkStyle} onClick={closeNavbar}>
                Admin Dashboard
              </Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/products" style={linkStyle} onClick={closeNavbar}>
                Products
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {user && user.id !== null ? (
              <>
                {!user.isAdmin && (
                  <>
                    <Nav.Link as={NavLink} to="/cart" style={linkStyle} onClick={closeNavbar}>Cart</Nav.Link>
                    <Nav.Link as={NavLink} to="/orders" style={linkStyle} onClick={closeNavbar}>Orders</Nav.Link>
                    <Nav.Link as={NavLink} to="/profile" style={linkStyle} onClick={closeNavbar}>Profile</Nav.Link>
                  </>
                )}
                <Nav.Link 
                  as={NavLink} 
                  to="/logout" 
                  onClick={(e) => {
                    closeNavbar();
                    handleLogout();
                  }} 
                  style={linkStyle}
                >
                  Log Out
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" style={linkStyle} onClick={closeNavbar}>Log In</Nav.Link>
                <Nav.Link as={NavLink} to="/register" style={linkStyle} onClick={closeNavbar}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
