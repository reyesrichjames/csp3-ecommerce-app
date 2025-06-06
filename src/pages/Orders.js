import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const notyf = new Notyf();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        await fetchProductDetails(data.orders);
      } else {
        notyf.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      notyf.error('An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductDetails = async (orders) => {
    try {
      const productIds = new Set();
      orders.forEach(order => {
        order.productsOrdered.forEach(product => {
          productIds.add(product.productId);
        });
      });

      const productDetails = {};
      await Promise.all(
        Array.from(productIds).map(async (productId) => {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
          const data = await response.json();
          productDetails[productId] = data;
        })
      );
      setProducts(productDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
      notyf.error('An error occurred while fetching product details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  if (isLoading) {
    return (
      <Container className="mt-5">
        <h2 className="text-center">Loading...</h2>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p className="h4 mb-4">No orders placed yet! <Link to="/products">Start shopping</Link>.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="card" style={{ borderRadius: '0' }}>
        <div 
          className="card-header text-center text-white py-2" 
          style={{ backgroundColor: '#373a3c', borderRadius: '0' }}
        >
          <h4 className="mb-0" style={{ fontSize: '1.5rem' }}>Order History</h4>
        </div>
        <div className="card-body">
          {orders.map((order, index) => (
            <Card key={order._id} className="mb-4" style={{ borderRadius: 0 }}>
              <Card.Header 
                className="text-white" 
                style={{ 
                  backgroundColor: '#373a3c', 
                  cursor: 'pointer', 
                  borderRadius: 0 
                }}
                onClick={() => toggleOrderDetails(order._id)}
              >
                Order #{index + 1} - Purchased on: {formatDate(order.orderedOn)} (Click for Details)
              </Card.Header>
              <Card.Body>
                <div className="mb-2">Items:</div>
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                  {order.productsOrdered.map((product) => (
                    <li key={product._id}>
                      <Link 
                        to={`/products/${product.productId}`}
                        style={{ 
                          color: '#0d6efd',
                          textDecoration: 'underline',
                          marginBottom: '8px',
                          display: 'inline-block',
                          borderRadius: 0
                        }}
                      >
                        {products[product.productId]?.name || 'Loading...'}
                      </Link>
                      <span style={{ color: '#666' }}> - Quantity: {product.quantity}</span>
                      
                      <Collapse in={expandedOrders[order._id]}>
                        <div className="mt-2 mb-3 ps-3">
                          <div style={{ color: '#666' }}>
                            Price: ₱{products[product.productId]?.price || '...'}<br/>
                            Description: {products[product.productId]?.description || 'Loading...'}
                          </div>
                        </div>
                      </Collapse>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '15px', color: '#ff6b6b' }}>
                  Total: ₱{order.totalPrice}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
