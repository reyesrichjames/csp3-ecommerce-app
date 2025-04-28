import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CourseCard({ courseProp }) {
  if (!courseProp) {
    return null;
  }

  const { _id, name, description, price } = courseProp;

  return (
    <Card id={_id} className="mb-3">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {description}
        </Card.Text>
        <Card.Text>
          <strong>Price:</strong> PHP {price}
        </Card.Text>
        <Link className="btn btn-primary" to={`/courses/${_id}`}>
          Details
        </Link>
      </Card.Body>
    </Card>
  );
}