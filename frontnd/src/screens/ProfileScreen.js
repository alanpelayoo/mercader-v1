import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Container } from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails,updateUserProfile } from '../actions/userAction'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'

function ProfileScreen() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails );
    const {error, loading, user} = userDetails;

    const userLogin= useSelector(state => state.userLogin );
    const {userInfo} = userLogin;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const {success} = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const {loading: loadingOrders, error:errorOrders, orders} = orderListMy

    useEffect(()=>{
        if (!userInfo){
            navigate('/login')
        }else{
            if (!user || !user.name || success || userInfo._id !== user._id){
                dispatch({type:USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            }else{
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, navigate, userInfo, user, success]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(password != confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(updateUserProfile({
                'id':user._id,
                'name':name,
                'email':email,
                'password':password
            }))
            setMessage('')
        }
    }
    return (
        <Container className='p-3'>
            <Row>
                <Col md={3}>
                    <h2> User Profile <i class="fa-regular fa-user"></i> </h2>
                    {message && <Message variant='danger'>{message}</Message>}
                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader/>}
                    <Form onSubmit={submitHandler} className='mt-3'>
                        <Form.Group controlId='name'>
                            <Form.Label> Name </Form.Label> 
                            <Form.Control
                                required
                                type='name'
                                placeholder='Enter Name'
                                value={name}
                                onChange={(e)=> setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email' className='mt-3'>
                            <Form.Label> Email Address <i class="fa-regular fa-envelope"></i></Form.Label> 
                            <Form.Control
                                required
                                type='email'
                                placeholder='Enter Email'
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='password' className='mt-3'>
                            <Form.Label>Password <i class="fa-solid fa-lock"></i> </Form.Label> 
                            <Form.Control
                                type='password'
                                placeholder='Enter Password'
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='passwordConfirm' className='mt-3'>
                            <Form.Label>Confirm Password <i class="fa-solid fa-repeat"></i></Form.Label> 
                            <Form.Control
                                type='password'
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={(e)=> setConfirmPassword(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary' className='mt-3'>
                            Update <i class="fa-regular fa-pen-to-square"></i>
                        </Button>
                    </Form>
                </Col>
                <Col md={9}>
                    <h2> My Orders <i class="fa-solid fa-sort"></i></h2>
                    {loadingOrders ? (
                        <Loader/>
                    ): errorOrders ? (
                        <Message variant='danger'>{errorOrders}</Message>
                    ): orders.length ? (
                        <Table striped responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0,10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0,10):(
                                            <i className='fas fa-times' style={{ color:'red'}}></i>
                                        )}
                                        </td>
                                        <td>
                                            <Link to={`/order/${order._id}`}>
                                                <Button className='btn-sm'>Details</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ): <span>You dont have orders</span>}
                </Col>
            </Row>
        </Container>
    )
}

export default ProfileScreen