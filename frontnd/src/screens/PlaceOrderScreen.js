import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem, Container} from 'react-bootstrap'
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import  CheckOutSteps  from '../components/CheckOutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

function PlaceOrderScreen() {
    const orderCreate = useSelector(state => state.orderCreate)
    const {order, error, success} = orderCreate

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart)

    cart.itemsPrice = cart.cartItems.reduce((acc,item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = Number((0.082) * cart.itemsPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    if (!cart.paymentMethod){
        navigate('/payment')
    }

    useEffect(()=>{
        if(success){
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }

    }, [success, navigate])

    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    }

    return (
        <Container className="p-3">
            <CheckOutSteps step1 step2 step3 step4></CheckOutSteps>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong> Shipping: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city},
                                {' '}
                                {cart.shippingAddress.postalcode},
                                {' '}
                                {cart.shippingAddress.country}.

                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong> Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            { cart.cartItems.length === 0 ? <Message variant='info'>
                                Your cart is empty
                            </Message>:(
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} rounded fluid/>
                                                </Col>
                                                <Col>
                                                    <Link to= {`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X ${item.price} = {(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2> Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Item:</Col>
                                    <Col>${cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            <ListGroup.Item>
                                <Button
                                    type='submit'
                                    className='w-100'
                                    disabled={cart.cartItems.length === 0}
                                    onClick= {placeOrder}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            <div className='mt-3'>
                    <Message variant='info ' clas>Important Note: This is only test a website, you won´t receive real products</Message>
            </div>
        </Container>
    )
}

export default PlaceOrderScreen