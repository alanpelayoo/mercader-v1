import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Container} from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../actions/userAction';
import { USER_UPDATE_RESET } from '../constants/userConstants';

function UserEditScreen() {

    const location = useLocation();
    const navigate = useNavigate();
    const match = useParams();

    const userId = match.id;
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isAdmin, setisAdmin] = useState(false);

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails );
    const {error, loading, user} = userDetails;

    const userUpdate = useSelector(state => state.userUpdate );
    const {error: errorUpdate, loading:loadingUpdate, success:successUpdate} = userUpdate;

    useEffect(()=>{

        if (successUpdate){
            dispatch({type: USER_UPDATE_RESET})
            navigate('/admin/userlist')
        }else{
            if(!user.name || user._id !== Number(userId)){
                dispatch(getUserDetails(userId))
            }else{
                setName(user.name)
                setEmail(user.email)
                setisAdmin(user.isAdmin)
            }
        }
        
    }, [user, userId, successUpdate, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({_id:user._id, name, email, isAdmin}))
        
    }

    return (
    <Container className="p-3">
        <Link to="/admin/userlist/">
            Go back
        </Link>

        <FormContainer>
            <h1> Edit User </h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            
            {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message>:(
                <Form onSubmit={submitHandler} className='mt-3'>
                    <Form.Group controlId='name'>
                        <Form.Label> Name</Form.Label> 
                        <Form.Control
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
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isAdmin' className='mt-3'>
                        <Form.Check
                            type='checkbox'
                            label='Is Admin?'
                            checked={isAdmin}
                            onChange={(e)=> setisAdmin(e.target.checked)}
                        >
                        </Form.Check>
                    </Form.Group>
                    
                    <Button type='submit' variant='primary' className='mt-3'>
                        Update
                    </Button>
                </Form>
            )}
            
        </FormContainer>

    </Container>
    
    )
}

export default UserEditScreen