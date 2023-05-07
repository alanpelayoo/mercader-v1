import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userAction'

function RegisterScreen() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const userRegister = useSelector(state => state.userRegister );
    const {error, loading, userInfo} = userRegister;

    useEffect(()=>{
        if (userInfo){
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(password != confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(register(name,email,password));
        }
        
    }

    return (
    <FormContainer>
        <h1> Register </h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler} className='mt-3'>
            <Form.Group controlId='name'>
                <Form.Label> Name</Form.Label> 
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
                <Form.Label> Email Address</Form.Label> 
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
                <Form.Label>Password</Form.Label> 
                <Form.Control
                    required
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='passwordConfirm' className='mt-3'>
                <Form.Label>Confirm Password</Form.Label> 
                <Form.Control
                    required
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary' className='mt-3'>
                Register
            </Button>
        </Form>
        <Row className='mt-3'>
            <Col>
                Have an Account ? <Link 
                    to = { redirect ? `/login?redirect=${redirect}`: '/login'}>
                    Sign In
                    </Link>
            </Col>
        </Row>
    </FormContainer>
    )
}

export default RegisterScreen