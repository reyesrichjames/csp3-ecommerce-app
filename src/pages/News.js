import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import NewsCard from '../components/NewsCard';
// import newsData from '../data/newsData';
import UserContext from '../context/UserContext';

export default function News() {
  const { user } = useContext(UserContext);

  const [news, setNews] = useState([]);
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {

        //get all active news
        fetch("http://localhost:4000/news/")
        .then(res => res.json())
        .then(data => {
            
            console.log(data);

            setNews(data.map(news => {
                return (
                    <NewsCard key={news._id} newsProp={news}/>
                );
            }));

        });

    }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  useEffect(() => {
    if (email && feedback) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, feedback]);

  const sendFeedback = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback. We'll get back to you as soon as we can.");
    setEmail('');
    setFeedback('');
  };

  /*const news = newsData.map(newsItem => (
    <NewsCard key={newsItem.id} newsProp={newsItem} />
  ));*/

  return (
    <Container>
      <Row className="mt-5 text-center">
        <Col className="pt-md-5 mt-5">
          <h1>News</h1>
          <p>Select a news article to read!</p>
        </Col>
      </Row>

      <Row>
        {news}
      </Row>

      {user.id !== null && (
        <>
          <Row className="mt-5 justify-content-center">
            <Col xs="auto">
              <h2>Feedback</h2>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Form onSubmit={sendFeedback}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Form.Group controlId="formFeedback">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Let us know what you think."
                    value={feedback}
                    onChange={handleFeedbackChange}
                  />
                </Form.Group>

                {isButtonDisabled ? (
                  <Button variant="danger" type="submit" className="mt-3" id="submitBtn" disabled>
                    Send feedback
                  </Button>
                ) : (
                  <Button variant="primary" type="submit" className="mt-3" id="submitBtn">
                    Send feedback
                  </Button>
                )}
              </Form>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
