import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CourseCard({ courseProp }) {
  if (!courseProp) {
    return null;
  }

  const { _id, name, description, price } = courseProp;

  return (
    <Card id={_id} className="mb-3 h-100 d-flex flex-column">
      <Card.Body className="flex-grow-1">
        <Card.Title>
          <Link 
            to={`/courses/${_id}`}
            style={{ 
              color: '#0d6efd',
              textDecoration: 'underline'
            }}
          >
            {name}
          </Link>
        </Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Text className="px-3 mb-2">
        <span style={{ 
          fontSize: '1.1rem',
          color: '#FF6B00'
        }}>₱{price}</span>
      </Card.Text>
      <Card.Footer className="bg-light border-top text-start">
        <Link 
          className="btn btn-primary" 
          to={`/courses/${_id}`}
          style={{ borderRadius: 0 }}
        >
          Details
        </Link>
      </Card.Footer>
    </Card>
  );
}