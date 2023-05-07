import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem, Container} from 'react-bootstrap'
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from "react-paypal-button-v2";
import { getOrderDetails,payOrder, deliverOrder  } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'


function OrderScreen() {
    const match = useParams();
    const orderId = match.id;
    const dispatch = useDispatch();

    const [sdkReady, setSdkReady] = useState(false)
    const [recentPaid, setRecentPaid] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading:loadingPay, success:successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading:loadingDeliver, success:successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const navigate = useNavigate();

    if (!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc,item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    //AauyF2RdF3AMbs5A_zVO6iY78DyrWFk8CRs31qjGWKTKTXkEnDqJvRAH3Dxg1OmFj2yT05sHah78CEQ6
    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = "https://www.paypal.com/sdk/js?client-id=AauyF2RdF3AMbs5A_zVO6iY78DyrWFk8CRs31qjGWKTKTXkEnDqJvRAH3Dxg1OmFj2yT05sHah78CEQ6"
        script.async  = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
        
    }

    useEffect(()=>{
        if (!userInfo){
            navigate('/login')
        }
        if(!order || successPay ||order._id !== Number(orderId) || successDeliver){
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})

            dispatch(getOrderDetails(orderId))
        }else if (!order.isPaid){
            if (!window.paypal){
                addPayPalScript()
            }else{
                setSdkReady(true)
                
            }
        }
    }, [dispatch,order, orderId, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId,paymentResult))
        setRecentPaid(true)
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return loading ? (
        <Loader/>
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ): (
        <Container className='p-3'>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name:</strong> {order.user.name}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a> </p>
                            <p>
                                <strong> Shipping: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city},
                                {' '}
                                {order.shippingAddress.postalcode},
                                {' '}
                                {order.shippingAddress.country}.

                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt.substring(0,16)} <i class="fa-solid fa-truck"></i></Message>
                            ): (
                                <Message variant = 'warning'> Not Delivered <i class="fa-solid fa-truck"></i></Message>
                            )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong> Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid on {order.paidAt.substring(0,16)} <i class="fa-regular fa-calendar"></i></Message>
                            ): (
                                <Message variant = 'warning'> Not Paid <i class="fa-solid fa-xmark"></i> </Message>
                            )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            { order.orderItems.length === 0 ? <Message variant='info'>
                                Order empty
                            </Message>:(
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
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
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}
                                    {!sdkReady ? (
                                        <Loader/>
                                    ): (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess= {successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                            { order.isPaid &&  recentPaid ?(
                                <ListGroup.Item>
                                    <Message variant='success'>Thanks for your purchase <i class="fa-regular fa-money-bill-1"></i></Message>
                                </ListGroup.Item>
                            ):null}
                            <div className='mt-3 p-1' >
                                <Message variant='info ' clas>
                                    Important Note: This is only test a website, you won´t receive real products.
                                    You can open paypal window but please don´t complete purchase.
                                </Message>
                            </div>
                        </ListGroup>
                        {loadingDeliver && <Loader/>}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item className='p-2'>
                                <Button
                                    type='button'
                                    className='btn btn-block w-100'
                                    onClick={deliverHandler}
                                >
                                    Mark as Deliver
                                </Button>
                            </ListGroup.Item>
                        )}
                    </Card>
                </Col>
                
            </Row>
        </Container>
    )
}

export default OrderScreen