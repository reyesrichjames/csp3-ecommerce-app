import { useState, useEffect, useContext } from 'react';
import { 
  Table, 
  Container, 
  Modal, 
  Form, 
  Button,
  Card,
  Collapse 
} from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../context/UserContext';

const DescriptionModal = ({ show, handleClose, description }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product Description</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );


export default function AdminDashboard({ productsData, fetchData }) {
  const { user } = useContext(UserContext);
  const notyf = new Notyf();
  
  const [products, setProducts] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [showDescription, setShowDescription] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');

  useEffect(() => {
    if (!Array.isArray(productsData)) return;
    const productArr = productsData.map(product => ({
      ...product,
      isActive: product.isActive === 'true' || product.isActive === true
    }));
    setProducts(productArr);
  }, [productsData]);

  useEffect(() => {
    if (newProduct.name && 
        newProduct.description && 
        newProduct.price && 
        !isNaN(newProduct.price)) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [newProduct]);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Group orders by userEmail instead of userId
        const ordersByUser = data.orders.reduce((acc, order) => {
          const userEmail = order.userEmail || order.userId; // fallback to userId if email not available
          if (!acc[userEmail]) {
            acc[userEmail] = [];
          }
          acc[userEmail].push(order);
          return acc;
        }, {});
        
        setAllOrders(ordersByUser);
      } else {
        notyf.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      notyf.error('An error occurred while fetching orders');
    }
  };

  const toggleUserOrders = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const toggleView = () => {
    if (!showOrders) {
      fetchAllOrders();
    }
    setShowOrders(!showOrders);
  };

  const handleShowDescription = (description) => {
      setSelectedDescription(description);
      setShowDescription(true);
    };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.isAdmin) {
      notyf.error('You must be an admin to add a product');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      notyf.error('You need to be logged in as an admin');
      return;
    }

    const productData = {
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price)
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (response.ok) {
        notyf.success('Product added successfully');
        handleClose();
        fetchData();
      } else {
        if (data.message === 'Product already exists') {
          notyf.error('Product already exists');
        } else {
          notyf.error('Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error while adding the product:', error);
      notyf.error('An error occurred while adding the product');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewProduct({
      name: '',
      description: '',
      price: ''
    });
  };

  const handleShow = () => setShowModal(true);

  

    

     const tableStyles = {
         container: {
           padding: '20px',
           maxWidth: '1200px',
           margin: '0 auto'
         },
         header: {
           textAlign: 'center',
           marginBottom: '30px'
         },
         title: {
           fontSize: '28px',
           fontWeight: '600',
           color: '#333',
           marginBottom: '20px'
         },
         buttonGroup: {
           marginBottom: '30px',
           display: 'flex',
           justifyContent: 'center'
         },
         headerButton: {
           borderRadius: 0,
         },
         table: {
           backgroundColor: '#fff',
           borderRadius: '8px',
           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
         },
         tableHeader: {
           backgroundColor: '#f8f9fa',
           color: '#333',
           fontWeight: '600'
         },
         actionButton: {
           width: '100px',
           borderRadius: 0,
           display: 'block',
           marginBottom: '5px',
           textAlign: 'center'
         },
         actionButtonContainer: {
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           padding: '0 10px'
         },
         price: {
           fontWeight: '600',
           color: '#2c3e50'
         },
         modal: {
           content: {
             padding: '20px'
           },
           footer: {
             borderTop: '1px solid #dee2e6',
             padding: '1rem'
           }
         }
       };

       

         
      const handleUpdateClick = (product) => {
          setProductToUpdate({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl || '' // Add this line
          });
          setShowUpdateModal(true);
        };

        const handleUpdateClose = () => {
          setShowUpdateModal(false);
          setProductToUpdate({
            _id: '',
            name: '',
            description: '',
            price: ''
          });
        };

        const handleUpdateSubmit = async (e) => {
          e.preventDefault();

          // Validate data
          if (!productToUpdate.name || !productToUpdate.description || !productToUpdate.price) {
            notyf.error('All fields are required');
            return;
          }

          const numericPrice = parseFloat(productToUpdate.price);
          if (isNaN(numericPrice) || numericPrice <= 0) {
            notyf.error('Price must be a valid positive number');
            return;
          }

          // Validate image URL if provided
          if (productToUpdate.imageUrl && !productToUpdate.imageUrl.includes('postimg.cc')) {
            notyf.error('Image URL must be from postimg.cc');
            return;
          }

          try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productToUpdate._id}/update`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                name: productToUpdate.name,
                description: productToUpdate.description,
                price: numericPrice,
                imageUrl: productToUpdate.imageUrl
              })
            });

            const data = await response.json();
            if (response.ok) {
              // Update the local state immediately
              setProducts(products.map(product => 
                product._id === productToUpdate._id 
                  ? {
                      ...product,
                      name: productToUpdate.name,
                      description: productToUpdate.description,
                      price: numericPrice,
                      imageUrl: productToUpdate.imageUrl
                    }
                  : product
              ));
              
              notyf.success('Product updated successfully');
              handleUpdateClose();
              // Still fetch from server to ensure consistency
              fetchData();
            } else {
              notyf.error(data.message || 'Failed to update product');
            }
          } catch (error) {
            console.error('Error updating product:', error);
            notyf.error('An error occurred while updating the product');
          }
        };

        const handleArchive = async (productId, currentStatus) => {
          try {
            // If product is currently active, we archive it, otherwise we activate it
            const endpoint = currentStatus ? 'archive' : 'activate';
            
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/${endpoint}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            const data = await response.json();
            if (response.ok) {
              notyf.success(currentStatus ? 'Product archived successfully' : 'Product activated successfully');
              fetchData();
            } else {
              notyf.error(data.message || 'Operation failed');
            }
          } catch (error) {
            console.error('Error toggling product status:', error);
            notyf.error('An error occurred');
          }
        };

      return (
        <Container style={tableStyles.container}>
      <div style={tableStyles.header}>
        <h1 style={tableStyles.title}>Admin Dashboard</h1>
        <div style={tableStyles.buttonGroup}>
          <Button 
            variant="primary" 
            onClick={handleShow}
            style={tableStyles.headerButton}
          >
            Add New Product
          </Button>
          <Button 
            variant={showOrders ? "danger" : "success"}
            style={tableStyles.headerButton}
            onClick={toggleView}
          >
            {showOrders ? 'Show Product Details' : 'Show User Orders'}
          </Button>
        </div>
      </div>

      {showOrders ? (
        <div className="mt-4">
          {Object.entries(allOrders).map(([userEmail, userOrders]) => (
            <Card key={userEmail} className="mb-3">
              <Card.Header
                className="bg-dark text-white"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleUserOrders(userEmail)}
              >
                Orders for: {userEmail}
              </Card.Header>
              <Collapse in={expandedUsers[userEmail]}>
                <Card.Body>
                  {userOrders.map((order) => (
                    <div key={order._id} className="mb-3">
                      <div className="mb-2">
                        Purchased on {formatDate(order.orderedOn)}:
                      </div>
                      <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                        {order.productsOrdered.map((product) => (
                          <li key={product._id}>
                            Quantity: {product.quantity}
                            <div style={{ color: '#666' }}>
                              Subtotal: ₱{product.subtotal}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                        Total: ₱{order.totalPrice}
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Collapse>
            </Card>
          ))}
        </div>
      ) : (
      <>

          <Table striped bordered hover responsive style={tableStyles.table}>
            <thead>
              <tr style={tableStyles.tableHeader}>
                <th style={{width: '25%'}}>Name</th>
                <th className="d-none d-lg-table-cell" style={{width: '45%'}}>Description</th>
                {/* Remove the View header for tablet view */}
                <th className="d-lg-none d-sm-none" style={{width: '15%', textAlign: 'center'}}>View</th>
                <th style={{width: '25%', textAlign: 'center'}}>Price</th>
                <th className="d-none d-sm-table-cell" style={{width: '25%', textAlign: 'center'}}>Availability</th>
                <th className="d-none d-sm-table-cell" style={{width: '25%', textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          {product.name}

                          {product.imageUrl && (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              margin: '10px 0',
                              width: '100%' // Match parent width
                            }}>
                              <img 
                                src={product.imageUrl}
                                alt={product.name}
                                style={{
                                  width: '100%', // Take full width of parent
                                  height: 'auto', // Maintain aspect ratio
                                  maxHeight: '200px', // Maximum height
                                  objectFit: 'contain', // Ensure whole image is visible
                                  backgroundColor: 'white'
                                }}
                                onError={(e) => {
                                  e.target.onerror = null; // Prevent infinite loop
                                  e.target.style.display = 'none'; // Hide broken images
                                }}
                              />
                            </div>
                          )}
                         
                           



                              
                          {/* Description button for tablet view only */}
                          <div className="d-none d-sm-block d-lg-none" style={{ marginTop: '5px' }}>
                              <Button 
                                variant="success" 
                                size="sm" 
                                onClick={() => handleShowDescription(product.description)}
                                style={{ borderRadius: '0' }}
                              >
                                Description
                              </Button>
                            </div>
                          {/* Availability for mobile view only */}
                          <div className="d-sm-none" style={{ marginTop: '5px' }}>
                            <span className={`text-${product.isActive ? 'success' : 'danger'}`}>
                              {product.isActive ? 'Available' : 'Unavailable'}
                            </span>
                            <div style={{ marginTop: '5px' }}>
                              <Button  
                                variant="success" 
                                size="sm" 
                                onClick={() => handleShowDescription(product.description)}
                                style={{ borderRadius: '0' }}
                              >
                                Description
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-lg-table-cell">{product.description}</td>
                        <td style={{textAlign: 'center', ...tableStyles.price}}>
                          ₱{product.price}
                        </td>
                        <td className="d-none d-sm-table-cell" style={{textAlign: 'center'}}>
                          <span className={`text-${product.isActive ? 'success' : 'danger'}`}>
                            {product.isActive ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="d-none d-sm-table-cell" style={{width: '120px'}}>
                          <div style={tableStyles.actionButtonContainer}>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              style={tableStyles.actionButton}
                              onClick={() => handleUpdateClick(product)}
                            >
                              Update
                            </Button>
                            <Button 
                              variant={product.isActive ? "danger" : "success"}
                              size="sm"
                              style={tableStyles.actionButton}
                              onClick={() => handleArchive(product._id, product.isActive)}
                            >
                              {product.isActive ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </td>
                        <td className="d-sm-none">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <Button 
                              style={{ borderRadius: '0' }}
                              variant="primary" 
                              size="sm" 
                              onClick={() => handleUpdateClick(product)}
                            >
                              Update
                            </Button>
                            <Button 
                              style={{ borderRadius: '0' }}
                              variant={product.isActive ? "danger" : "success"}
                              size="sm"
                              onClick={() => handleArchive(product._id, product.isActive)}
                            >
                              {product.isActive ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Add Description Modal */}
                <DescriptionModal 
                        show={showDescription}
                        handleClose={() => setShowDescription(false)}
                        description={selectedDescription}
                      />

          <Modal show={showUpdateModal} onHide={handleUpdateClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleUpdateSubmit}>
              <Modal.Body style={tableStyles.modal.content}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={productToUpdate.name}
                    onChange={(e) => setProductToUpdate({...productToUpdate, name: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    value={productToUpdate.description}
                    onChange={(e) => setProductToUpdate({...productToUpdate, description: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    value={productToUpdate.price}
                    onChange={(e) => setProductToUpdate({
                      ...productToUpdate, 
                      price: e.target.value
                    })}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Product Image Link</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter postimg.cc URL for product thumbnail"
                    value={productToUpdate.imageUrl}
                    onChange={(e) => setProductToUpdate({
                      ...productToUpdate, 
                      imageUrl: e.target.value
                    })}
                  />
                  <Form.Text className="text-muted">
                    Image URL must be from postimg.cc
                  </Form.Text>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer style={tableStyles.modal.footer}>
                <Button variant="secondary" onClick={handleUpdateClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Update Product
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body style={tableStyles.modal.content}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer style={tableStyles.modal.footer}>
                <Button variant="dark" onClick={handleClose} style={{borderRadius: '0'}}>
                  Close
                </Button>
                <Button
                  style={{borderRadius: '0'}}
                  className="bg-success"
                  variant={isSubmitDisabled ? "danger" : "primary"}
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  Add Product
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          </>
          )}
        </Container>
      );
    }
