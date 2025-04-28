import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
  return (
    <Row className="my-5 text-center">
      <Col>
        <h1>{data.title}</h1>
        <p>{data.content}</p>
        <Link to={data.destination}>
          <Button variant="primary">{data.buttonLabel}</Button>
        </Link>
      </Col>
    </Row>
  );
}