import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import ResetPassword from '../components/ResetPassword';
import UpdateProfile from '../components/UpdateProfile';

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (user.id) {
      fetch('http://localhost:4000/users/details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data) {
            setDetails(data);
          } else {
            alert('User not found.');
          }
        })
        .catch(() => {
          alert('Something went wrong, kindly contact us for assistance.');
        });
    }
  }, [user.id]);

  if (user.id === null) {
    return <Navigate to="/courses" />;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-white bg-primary mb-3">
            <Card.Body>
              <Card.Title className="mb-4">Profile</Card.Title>
              {details && (
                <>
                  <Card.Text className="mb-4">
                    <strong>{details.firstName} {details.lastName}</strong>
                  </Card.Text>
                  <hr className="bg-light" />
                  <Card.Text className="mt-4">
                    <strong>Contacts</strong>
                  </Card.Text>
                  <ul>
                    <li>Email: {details.email}</li>
                    <li>Mobile No: {details.mobileNo}</li>
                  </ul>
                </>
              )}
            </Card.Body>
            <Container>
              <ResetPassword />
              <UpdateProfile details={details} setDetails={setDetails} />
            </Container>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}