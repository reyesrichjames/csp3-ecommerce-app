import { useState, useEffect, useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function ProductView() {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
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
    console.log('Adding to cart:', { product, quantity });
  };

  if (!product) {
    return <Container>Loading...</Container>;
  }

  const renderActionButton = () => {
    if (!user.id) {
      return (
        <Link to="/login">
          <Button 
            variant="warning" 
            style={{ 
              width: 'auto', 
              borderRadius: '0',
              backgroundColor: '#FF6347',
              borderColor: '#FF6347',
              color: 'white',
              fontSize: '14px',
              padding: '6px 12px'
            }}
          >
            Log in to Add to Cart
          </Button>
        </Link>
      );
    } else if (user.isAdmin) {
      return (
        <Button 
          variant="danger" 
          disabled
          style={{ 
            width: 'auto', 
            borderRadius: '0',
            fontSize: '14px',
            padding: '6px 12px'
          }}
        >
          Admin can't add to Cart
        </Button>
      );
    } else {
      return (
        <Button 
          variant="primary" 
          onClick={handleAddToCart}
          style={{ 
            width: 'auto', 
            borderRadius: '0' 
          }}
        >
          Add to Cart
        </Button>
      );
    }
  };

  return (
    <Container className="mt-5">
      <div className="card" style={{ borderRadius: '0' }}>
        <div 
          className="card-header text-center text-white py-2" 
          style={{ backgroundColor: '#373a3c', borderRadius: '0' }}
        >
          <h4 className="mb-0" style={{ fontSize: '1.5rem' }}>{product.name}</h4>
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
                  onClick={() => handleQuantityChange('decrease')}
                  className="text-white"
                  style={{ 
                    borderRadius: '0',
                    backgroundColor: '#373a3c',
                    borderColor: '#373a3c'
                  }}
                  disabled={!user.id || user.isAdmin}
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
                  onClick={() => handleQuantityChange('increase')}
                  className="text-white"
                  style={{ 
                    borderRadius: '0',
                    backgroundColor: '#373a3c',
                    borderColor: '#373a3c'
                  }}
                  disabled={!user.id || user.isAdmin}
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
          {renderActionButton()}
        </div>
      </div>
    </Container>
  );
}