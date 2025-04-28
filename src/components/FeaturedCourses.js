import { useState, useEffect } from 'react';
import { Row, Container } from 'react-bootstrap';
import PreviewCourses from './PreviewCourses';

export default function FeaturedCourses() {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetch('https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/active')
      .then(res => res.json())
      .then(data => {
        // Create array of indices and shuffle it
        const indices = Array.from({ length: data.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Take first 6 indices and create preview components
        const featured = indices
          .slice(0, 6)
          .map(index => ({
            ...data[index],
            key: data[index]._id
          }));

        setPreviews(featured);
      });
  }, []);

  return (
    <Container>
      <h2 className="text-center mb-5">Featured Products</h2>
      <Row>
        {previews.slice(0, 3).map(product => (
          <PreviewCourses 
            data={product} 
            key={product.key} 
            breakPoint={4}
          />
        ))}
      </Row>
      <Row className="mt-4">
        {previews.slice(3, 6).map(product => (
          <PreviewCourses 
            data={product} 
            key={product.key} 
            breakPoint={4}
          />
        ))}
      </Row>
    </Container>
  );
}