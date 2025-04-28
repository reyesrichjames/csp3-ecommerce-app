import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function UserView({ productsData = [] }) {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('100000');

  useEffect(() => {
    setProducts(productsData);
  }, [productsData]);

  const handlePriceChange = (setter, value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    setter(numericValue);
  };

  const incrementPrice = (setter, currentValue) => {
    const newValue = parseFloat(currentValue || 0) + 1000;
    setter(newValue.toString());
  };

  const decrementPrice = (setter, currentValue) => {
    const newValue = Math.max(0, parseFloat(currentValue || 0) - 1000);
    setter(newValue.toString());
  };

  const handleSearchByName = async () => {
    try {
      const response = await fetch('https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: productName })
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleSearchByPrice = async () => {
    try {
      const response = await fetch('https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/searchByPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          minPrice: parseFloat(minPrice) || 0,
          maxPrice: parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER
        })
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching by price:', error);
    }
  };

  const handleClear = () => {
    setProductName('');
    setMinPrice('0');
    setMaxPrice('100000');
    setProducts(productsData);
  };

  const priceInputStyle = {
    borderRadius: 0,
    textAlign: 'left'
  };

  const priceButtonStyle = {
    borderRadius: 0,
    width: '38px',
    height: '38px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    border: 'none'
  };

  const searchButtonStyle = {
     borderRadius: 0
   };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Product Search</h2>
      
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Product Name:</Form.Label>
          <Form.Control
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Minimum Price:</Form.Label>
          <div className="d-flex">
            <Button 
              style={priceButtonStyle}
              onClick={() => decrementPrice(setMinPrice, minPrice)}
            >
              -
            </Button>
            <Form.Control
              type="text"
              value={minPrice}
              onChange={(e) => handlePriceChange(setMinPrice, e.target.value)}
              style={priceInputStyle}
            />
            <Button 
              style={priceButtonStyle}
              onClick={() => incrementPrice(setMinPrice, minPrice)}
            >
              +
            </Button>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Maximum Price:</Form.Label>
          <div className="d-flex">
            <Button 
              style={priceButtonStyle}
              onClick={() => decrementPrice(setMaxPrice, maxPrice)}
            >
              -
            </Button>
            <Form.Control
              type="text"
              value={maxPrice}
              onChange={(e) => handlePriceChange(setMaxPrice, e.target.value)}
              style={priceInputStyle}
            />
            <Button 
              style={priceButtonStyle}
              onClick={() => incrementPrice(setMaxPrice, maxPrice)}
            >
              +
            </Button>
          </div>
        </Form.Group>

        <div className="mb-5">
            <Button 
              variant="primary" 
              className="me-2" 
              onClick={handleSearchByName}
              style={searchButtonStyle}
            >
              Search by Name
            </Button>
            <Button 
              variant="primary" 
              className="me-2" 
              onClick={handleSearchByPrice}
              style={searchButtonStyle}
            >
              Search by Price
            </Button>
            <Button 
              variant="danger" 
              onClick={handleClear}
              style={searchButtonStyle}
            >
              Clear
            </Button>
          </div>
      </Form>

      <hr />

      <h2 className="text-center mb-5 my-5">Our Products</h2>
      
      <Row>
        {products.map(products => (
          <Col md={4} key={products._id} className="mb-4">
            <ProductCard productProp={products} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}