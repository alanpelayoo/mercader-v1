import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions'
import  CheckOutSteps  from '../components/CheckOutSteps'


function ShippingScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart );
    const {shippingAddress} = cart;
    const dispatch = useDispatch();

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalcode, setPostalCode] = useState(shippingAddress.postalcode)
    const [country, setCountry] = useState(shippingAddress.country)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalcode, country}))  
        navigate('/payment') 
    }

    return (
        <FormContainer>
            <CheckOutSteps step1 step2/>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label> Address <i class="fa-solid fa-map-pin"></i></Form.Label> 
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter Address'
                        value={address ? address :''}
                        onChange={(e)=> setAddress(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className='mt-3'>
                    <Form.Label> City <i class="fa-solid fa-city"></i></Form.Label> 
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter City'
                        value={city ? city :''}
                        onChange={(e)=> setCity(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className='mt-3'>
                    <Form.Label> Postal Code <i class="fa-solid fa-list-ol"></i></Form.Label> 
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter Postal Code'
                        value={postalcode ? postalcode :''}
                        onChange={(e)=> setPostalCode(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className='mt-3'>
                    <Form.Label> Country <i class="fa-solid fa-globe"></i></Form.Label> 
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter Country'
                        value={country ? country :''}
                        onChange={(e)=> setCountry(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-3'>
                    Continue
                </Button>
            </Form>
        </FormContainer>

    )
}

export default ShippingScreen