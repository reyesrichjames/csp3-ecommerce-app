import { useState, useEffect, useContext } from 'react';
import { Table, Container, Row, Col, Modal, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../context/UserContext';

export default function AdminDashboard({ productsData, fetchData }) {
  const { user } = useContext(UserContext);
  const notyf = new Notyf();
  
  const [products, setProducts] = useState([]);
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
    price: ''
  });

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
      const response = await fetch('https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/', {
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

  const headerStyle = {
      backgroundColor: '#343a40',
      color: 'white',
      padding: '8px 16px',
      marginBottom: '20px'
    };

    const tableHeaderStyle = {
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #dee2e6'
    };

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
           alignItems: 'flex-start',
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

       const handleUpdate = async (productId, productData) => {
           try {
             const response = await fetch(`https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/${productId}/update`, {
               method: 'PATCH',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${localStorage.getItem('token')}`
               },
               body: JSON.stringify({
                 name: productData.name,
                 description: productData.description,
                 price: productData.price
               })
             });

             const data = await response.json();
             if (response.ok) {
               notyf.success('Product updated successfully');
               fetchData();
             } else {
               notyf.error(data.message || 'Failed to update product');
             }
           } catch (error) {
             console.error('Error updating product:', error);
             notyf.error('An error occurred while updating the product');
           }
         };

         
      const handleUpdateClick = (product) => {
          setProductToUpdate({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price
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

          try {
            const response = await fetch(`https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/${productToUpdate._id}/update`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                name: productToUpdate.name,
                description: productToUpdate.description,
                price: numericPrice  // Send as number, not string
              })
            });

            const data = await response.json();
            if (response.ok) {
              notyf.success('Product updated successfully');
              handleUpdateClose();
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
            
            const response = await fetch(`https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/${productId}/${endpoint}`, {
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
                variant="success"
                style={tableStyles.headerButton}
              >
                Show User Orders
              </Button>
            </div>
          </div>

          <Table striped bordered hover responsive style={tableStyles.table}>
            <thead>
              <tr style={tableStyles.tableHeader}>
                <th style={{width: '20%'}}>Name</th>
                <th style={{width: '45%'}}>Description</th>
                <th style={{width: '15%', textAlign: 'center'}}>Price</th>
                <th style={{width: '15%', textAlign: 'center'}}>Availability</th>
                <th className="text-center" style={{width: '120px'}}>Actions</th> {/* Updated width to match button width + padding */}
              </tr>
            </thead>
            <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td style={{textAlign: 'center', ...tableStyles.price}}>
                        ${product.price}
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <span className={`text-${product.isActive ? 'success' : 'danger'}`}>
                          {product.isActive ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td style={{width: '120px'}}>
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
                    </tr>
                  ))}
                </tbody>
          </Table>

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
                    placeholder="Enter price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer style={tableStyles.modal.footer}>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant={isSubmitDisabled ? "danger" : "primary"}
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  Add Product
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Container>
      );
    }