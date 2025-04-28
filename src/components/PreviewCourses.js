import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewCourses(props) {
  const { breakPoint, data } = props;
  const { _id, name, description, price } = data;

  return (
    <Col xs={12} md={breakPoint}>
      <Card className="h-100 d-flex flex-column mx-3" style={{ border: '1px solid #dee2e6' }}>
        <Card.Body className="flex-grow-1">
          <Card.Title>
            <Link 
              to={`/products/${_id}`}
              style={{ 
                color: '#0d6efd',
                textDecoration: 'underline',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {name}
            </Link>
          </Card.Title>
          <Card.Text style={{ 
            maxHeight: '150px', 
            overflowY: 'auto',
            fontSize: '0.9rem',
            color: '#6c757d'
          }}>
            {description}
          </Card.Text>
        </Card.Body>
        <div style={{ 
          color: '#ff6b00',
          fontSize: '1.2rem',
          fontWeight: 'normal',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          ₱{price}
        </div>
        <Card.Footer className="bg-light border-top text-start">
          <Link 
            className="btn btn-primary" 
            to={`/products/${_id}`}
            style={{
              width: 'auto',
              backgroundColor: '#0d6efd',
              border: 'none',
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            Details
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}