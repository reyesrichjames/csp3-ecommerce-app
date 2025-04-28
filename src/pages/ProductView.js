import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function ProductView() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
      })
      .catch(error => console.error('Error:', error));
  }, [productId]);

  const handleQuantityChange = (action) => {
    if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (action === 'increase') {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    // Add to cart functionality can be implemented here
    console.log('Adding to cart:', { product, quantity });
  };

  if (!product) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container className="mt-5">
      <div className="card" style={{ borderRadius: '0' }}>
        <div 
          className="card-header text-center text-white py-3" 
          style={{ backgroundColor: '#000', borderRadius: '0' }}
        >
          <h2 className="mb-0">{product.name}</h2>
        </div>
        <div className="card-body">
          <p className="card-text">{product.description}</p>
          
          <div className="mt-3">
            <div className="d-flex align-items-center mb-3">
              <label className="me-3">Price: </label>
              <span className="h5 mb-0" style={{ color: '#ff8c00' }}>₱{product.price}</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <label className="me-3">Quantity: </label>
              <div className="input-group" style={{ width: '150px' }}>
                <Button 
                  variant="dark" 
                  onClick={() => handleQuantityChange('decrease')}
                  className="text-white"
                  style={{ borderRadius: '0' }}
                >
                  -
                </Button>
                <input 
                  type="text" 
                  className="form-control ps-2" 
                  value={quantity} 
                  readOnly 
                  style={{ textAlign: 'left', borderRadius: '0' }}
                />
                <Button 
                  variant="dark" 
                  onClick={() => handleQuantityChange('increase')}
                  className="text-white"
                  style={{ borderRadius: '0' }}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div 
          className="card-footer" 
          style={{ backgroundColor: '#f8f9fa', borderRadius: '0' }}
        >
          <Button 
            variant="primary" 
            onClick={handleAddToCart}
            style={{ width: 'auto', borderRadius: '0' }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Container>
  );
}