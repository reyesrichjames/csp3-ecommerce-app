import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const Login = () => {

  const { user, setUser } = useContext(UserContext);
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // useEffect to enable the submit button when all fields are filled
  useEffect(() => {
    if (email && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  // Function to handle form submission
  const authenticate = (e) => {
    e.preventDefault();

    fetch('https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.access !== undefined) {
        alert("Thank you for logging in.");
        // console.log("Token:", data.access);

        // Set the token in localStorage
        localStorage.setItem('token', data.access);

        retrieveUserDetails(data.access);

        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event('tokenChange'));

        // Reset input states to initial values
        setEmail('');
        setPassword('');
      } else if (data.message === 'Incorrect email or password') {
        alert('Incorrect email or password');
      } else if (data.message === 'No email found') {
        alert('Email does not exist');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  function retrieveUserDetails(token) {
    fetch('http://localhost:4000/users/details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {

      setUser({
        id: data._id,
        isAdmin: data.isAdmin
      })
    })
  }

  return (
    user.id !== null ?
    <Navigate to="/courses" />
    :
    <Container className="mt-5">
      <h1>Login</h1>
      <Form onSubmit={authenticate}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>

        {isButtonDisabled ? (
          <Button variant="danger" type="submit" className="mt-3" id="submitBtn" disabled>
            Login
          </Button>
        ) : (
          <Button variant="primary" type="submit" className="mt-3" id="submitBtn">
            Login
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default Login;