import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap'; // Importing React-Bootstrap components
import UserContext from '../context/UserContext'; // Import UserContext
import { Notyf } from 'notyf'; // Import Notyf for notifications
import 'notyf/notyf.min.css'; // Import the Notyf CSS for styling

const AddCourse = () => {
  const { user } = useContext(UserContext);

  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const notyf = new Notyf();

  useEffect(() => {
    // Enable submit button only if all fields are filled and price is a valid number
    if (courseName && description && price && !isNaN(price)) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [courseName, description, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.isAdmin) {
      notyf.error('You must be an admin to add a course');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      notyf.error('You need to be logged in as an admin');
      return;
    }

    const courseData = {
      name: courseName,
      description,
      price: parseFloat(price) // Ensure price is sent as a number
    };

    try {
      const response = await fetch('http://localhost:4000/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      const data = await response.json();

      if (response.ok) {
        notyf.success('Course added successfully');
        resetForm();
        setTimeout(() => {
          window.location.href = '/courses';
        }, 1500);
      } else {
        if (data.message === 'Course already exists') {
          notyf.error('Course already exists');
          resetForm();
        } else if (data.message === 'Failed to save the course') {
          notyf.error('Unsuccessful course creation');
          resetForm();
        } else {
          notyf.error('Unsuccessful course creation');
        }
      }
    } catch (error) {
      console.error('Error while adding the course:', error);
      notyf.error('An error occurred while adding the course');
      resetForm();
    }
  };

  const resetForm = () => {
    setCourseName('');
    setDescription('');
    setPrice('');
  };

  return (
    <div className="container mt-5">
      <h1>Add a New Course</h1>
      {/* React-Bootstrap Form */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="courseName">
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)} // Two-way binding
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Two-way binding
          />
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number" // Restrict input to numbers
            placeholder="Enter course price"
            value={price}
            onChange={(e) => setPrice(e.target.value)} // Two-way binding
          />
        </Form.Group>

        {/* Submit button that changes color based on input state */}
        <Button
          variant={isSubmitDisabled ? "danger" : "primary"} // Change color based on state
          type="submit"
          disabled={isSubmitDisabled} // Disabled based on the state
          className="mt-3"
        >
          Add Course
        </Button>
      </Form>
    </div>
  );
};

export default AddCourse;