import React, {useState, useEffect} from 'react'
import {  useNavigate } from 'react-router-dom'
import { Form, Button, Col} from 'react-bootstrap'
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions'
import  CheckOutSteps  from '../components/CheckOutSteps'
import  Message  from '../components/Message'

function PaymentScreen() {
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart );
    const {shippingAddress} = cart;

    const dispatch = useDispatch();

    const [paymentMethod, setPaymentMethod] = useState('Paypal')

    if (!shippingAddress.address){
        navigate('/shipping') 
        
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <FormContainer>
            <CheckOutSteps step1 step2 step3 />
            <Form onSubmit={submitHandler}> 
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label = 'Paypal or Credit Card'
                            id = 'paypal'
                            name = 'paymentMethod'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                        </Form.Check>
                    </Col>   
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-3'>
                    Continue
                </Button>

                <div className='mt-3'>
                    <Message variant='info ' clas>Important Note: This is only test a website, you won´t receive real products</Message>
                </div>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen