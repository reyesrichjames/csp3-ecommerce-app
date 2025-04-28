import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

export default function NewsCard({ newsProp }) {
  const { name, description } = newsProp;
  const [likes, setLikes] = useState(0);

  function likeNews() {
    if (likes >= 10) {
      alert('Promo Alert: Since this news has reached a certain number of likes, we would like to offer a discount on your next class.');
    } else {
      setLikes(likes + 1);
    }
  }

  return (
    <Card className="mb-3">
      <Card.Body className="text-center">
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text>
          Likes: <strong>{likes}</strong>
        </Card.Text>
        <Button variant="primary" onClick={likeNews}>Like</Button>
      </Card.Body>
    </Card>
  );
}