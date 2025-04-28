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
      isAdmin: false // Ensure isAdmin is a boolean
    });
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Zuitt Booking</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/courses" exact="true">Courses</Nav.Link>
            <Nav.Link as={NavLink} to="/news" exact="true">News</Nav.Link> {/* Added News link */}
            {user && user.isAdmin && (
              <Nav.Link as={NavLink} to="/addCourse" exact="true">Add Course</Nav.Link>
            )}
            {user && user.id !== null ? (
              <>
                <Nav.Link as={NavLink} to="/profile" exact="true">Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/logout" exact="true" onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}