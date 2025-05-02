import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const notyf = new Notyf();



  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart && cart.cartItems) {
      fetchProductDetails();
    }
  }, [cart]);



  const fetchCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
      } else {
        notyf.error(data.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      notyf.error('An error occurred while fetching cart');
    }
  };

  const fetchProductDetails = async () => {
    try {
      const productDetails = {};
      await Promise.all(
        cart.cartItems.map(async (item) => {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`);
          const data = await response.json();
          productDetails[item.productId] = data;
        })
      );
      setProducts(productDetails);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      notyf.error('An error occurred while fetching product details');
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (productId, currentQuantity, action) => {
    let newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    
    // Don't allow quantity less than 1
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId,
          newQuantity
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCart(prevCart => ({
          ...prevCart,
          cartItems: data.updatedCart.cartItems,
          totalPrice: data.updatedCart.totalPrice
        }));
        notyf.success('Quantity updated successfully');
      } else {
        notyf.error(data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      notyf.error('An error occurred while updating quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setCart(prevCart => ({
            ...prevCart,
            cartItems: data.updatedCart.cartItems,
            totalPrice: data.updatedCart.totalPrice
          }));
          notyf.success('Item removed from cart successfully');
        } else {
          notyf.error(data.message || 'Failed to remove item from cart');
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
        notyf.error('An error occurred while removing item from cart');
      }
    };

    const handleClearCart = async () => {
       try {
         const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
           method: 'PUT',
           headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
           }
         });

         const data = await response.json();

         if (response.ok) {
           setCart(data.cart);
           notyf.success('Cart cleared successfully');
         } else {
           notyf.error(data.message || 'Failed to clear cart');
         }
       } catch (error) {
         console.error('Error clearing cart:', error);
         notyf.error('An error occurred while clearing the cart');
       }
     };

     if (isLoading) {
         return (
           <Container className="mt-5">
             <h2>Loading...</h2>
           </Container>
         );
       }

       if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
         return (
           <Container className="mt-5 text-center">
             <p className="h4 mb-4">
               Your cart is empty! <Link 
                 to="/products" 
                 style={{ 
                   color: '#0d6efd', 
                   textDecoration: 'underline', 
                   fontWeight: 'bold' 
                 }}
               >
                 Start shopping
               </Link>.
             </p>
           </Container>
         );
       }

       const handleCheckout = async () => {
           try {
             const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
               method: 'POST',
               headers: {
                 'Authorization': `Bearer ${localStorage.getItem('token')}`
               }
             });

             const data = await response.json();

             if (response.ok) {
               notyf.success('Order placed successfully');
               // Update the cart state to empty after successful checkout
               setCart(prevCart => ({
                 ...prevCart,
                 cartItems: [],
                 totalPrice: 0
               }));
             } else {
               notyf.error(data.message || 'Failed to place order');
             }
           } catch (error) {
             console.error('Error during checkout:', error);
             notyf.error('An error occurred while processing your order');
           }
         };

  return (
      <Container className="mt-5">
        <h2 className="mb-4 text-center">Your Shopping Cart</h2>
        <Card style={{ borderRadius: 0 }}>
          <Table responsive bordered>
            <thead className="bg-dark text-white">
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.cartItems.map((item) => {
                const product = products[item.productId] || {};
                return (
                  <tr key={item._id}>
                    <td>
                      <Link to={`/products/${item.productId}`} className="text-primary">
                        {product.name || 'Loading...'}
                      </Link>
                    </td>
                    <td>₱{product.price || '...'}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="dark"
                          size="sm"
                          className="me-2"
                          style={{ borderRadius: 0, width: '38px', height: '38px' }}
                          onClick={() => handleQuantityChange(item.productId, item.quantity, 'decrease')}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="dark"
                          size="sm"
                          className="ms-2"
                          style={{ borderRadius: 0, width: '38px', height: '38px' }}
                          onClick={() => handleQuantityChange(item.productId, item.quantity, 'increase')}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td>₱{item.subtotal}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        style={{ borderRadius: 0 }}
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>

        <Card className="mt-3" style={{ borderRadius: 0, backgroundColor: '#f8f9fa' }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={{ color: '#FF6B00' }}>Total: ₱{cart.totalPrice}</h3>
              <div>
                <Button
                  variant="primary"
                  className="me-2"
                  style={{ borderRadius: 0 }}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  variant="danger"
                  style={{ borderRadius: 0 }}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
  );
}
