import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function UpdateProfile({ details, setDetails }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNo: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (details) {
      setFormData({
        firstName: details.firstName || '',
        lastName: details.lastName || '',
        mobileNo: details.mobileNo || ''
      });
    }
  }, [details]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setDetails((prevDetails) => ({
          ...prevDetails,
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobileNo: formData.mobileNo
        })); // Update only the fields that are changed
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="mobileNo">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {message && <Alert variant="danger">{message}</Alert>}

        <Button
          type="submit"
          className="btn mb-3"
          style={{ color: 'var(--bs-primary)', backgroundColor: 'white' }}
        >
          Update Profile
        </Button>
      </Form>
    </div>
  );
}