import React, { useState, useEffect } from 'react';
import { Link,useParams, useNavigate} from 'react-router-dom';
import { Row,Col, Image, ListGroup, Button, Card, Form, ListGroupItem, Container } from 'react-bootstrap';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';


import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET} from '../constants/productConstants'


function ProductScreen() {
  
  const match = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const productDetail = useSelector( state => state.productDetails);
  const {error, loading, product} = productDetail;

  const userLogin = useSelector( state => state.userLogin);
  const {userInfo} = userLogin;

  const productReviewCreate = useSelector( state => state.productReviewCreate);
  const { 
    loading: loadingProductReview, 
    error: errorProductReview, 
    success: successProductReview 
  } = productReviewCreate;

  // Qty selection
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const addToCartHandler = () => {
    navigate(`/cart/${match.id}?qty=${qty}`)
  };

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(
      match.id, {
        rating,
        comment
      }
    ))
  }

  useEffect(() => {
    if(successProductReview){
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch((listProductDetails(match.id)));
    
  }, [dispatch, match, successProductReview]);
  
  return (
    <Container className='p-3'>
      <Link to="/" className='btn btn-dark my-3'> Go back</Link>
      {loading ?
        <Loader />
        : error
          ? <Message variant='danger'>{error}</Message>
        : (
            <div>
              <Row >
                <Col md={6}>
                  <Image src={product.image} alt={product.name} fluid/>
                </Col>
                <Col md={3}>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h3>{product.name}</h3>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Rating value={product.rating} text={`${product.numReviews} ratings`} color={'#FFFF00'}/>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      Price: ${product.price}
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Description: {product.description}
                    </ListGroup.Item>
                  </ListGroup> 
                </Col>

                <Col md={3}>
                  <Card>
                    <ListGroup variant='flush'>
                      <ListGroup.Item>
                        <Row>
                          <Col> Price: </Col>
                          <Col><strong>${product.price}</strong> </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Status:</Col>
                          <Col>
                            {product.countInStock >0 ? 'In Stock':'Out of Stock'}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      {product.countInStock > 0 ? (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty</Col>
                            <Col xs='auto' className='my-1'>
                              <Form.Select  value={qty} onChange={(e) => setQty(e.target.value) }>
                                {
                                  [...Array(product.countInStock).keys()].map((x)=>(
                                    <option key={x+1} value={x+1}>
                                      {x+1}
                                    </option>
                                  ))
                                }
                              </Form.Select>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ): null}

                      <ListGroup.Item>
                        <Button className='w-100' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>
                          Add to Cart</Button>
                      </ListGroup.Item>

                    </ListGroup>
                  </Card>
                </Col>
              </Row>

              <Row className='mt-4'>
                <Col md={6}>
                  <h4>Reviews</h4>
                  {product.reviews.length === 0 && <Message variant='info'>No reviews</Message>}
                  <ListGroup variant='flush'>
                    {product.reviews.map( (review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} color={'#FFFF00'}/>
                        <p>{review.createdAt.substring(0,10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                      <h4>Write a review</h4>
                      { loadingProductReview && <Loader/>}
                      {successProductReview && <Message variant='success'>Review submitted</Message>}
                      { errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                      { userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group controlId='rating' className='d-flex align-items-center'>
                            <Form.Label className='me-3'>Rating</Form.Label>
                            
                            <Form.Select
                              value={rating}
                              onChange= {(e) => setRating(e.target.value)}
                              className="w-50"
                            >
                              <option value=''>Select..</option>
                              <option value='1'>1 - Poor</option>
                              <option value='2'>2 - Fair</option>
                              <option value='3'>3 - Good</option>
                              <option value='4'>4 - Very Good</option>
                              <option value='5'>5 - Excelent</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group controlId='comment' className='mt-2'>
                            <Form.Label> Review</Form.Label>
                            <Form.Control
                              as='textarea'
                              row='5'
                              value={comment}
                              onChange= { (e) => setComment(e.target.value)}
                            >
                            </Form.Control>
                          </Form.Group>

                          <Button disabled={loadingProductReview} type='submit' variant='primary' className='mt-2'>
                            Submit
                          </Button>
                        </Form>
                      ): (
                        <Message variant='info'> Please <Link to='/login'>Login</Link> to write a review</Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </div>
        )

      }
    </Container>
  )
}

export default ProductScreen


