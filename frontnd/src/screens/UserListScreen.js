import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Container} from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../actions/userAction'

function UserListScreen() {

    const dispatch = useDispatch();
    
    const userList = useSelector(state => state.userList)
    const {loading, error, users} = userList

    const userLogin = useSelector(state => state.userLogin );
    const {userInfo} = userLogin;

    const userDelete = useSelector(state => state.userDelete)
    const { success:successDelete } = userDelete

    const location = useLocation();
    const navigate = useNavigate();

    const deleteHandler = (id) =>{
        if (window.confirm('Are you sure you want to delete this user ?')){
            dispatch(deleteUser(id))
        }
        
    }

    useEffect(() =>{
        if (userInfo && userInfo.isAdmin){
            dispatch(listUsers())
        }else{
            navigate('/login')
        }

        
    },[dispatch, navigate,successDelete, userInfo])

    return (
        <Container className="p-3">
            <h1>Users</h1>
            {loading ? (
                <Loader/>
            ):error 
                ?(<Message variant='danger'>{error}</Message>)
                :(
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? (
                                        <i className='fas fa-check' style={{color:'green'}}></i>)
                                            :(<i className='fas fa-times' style={{color:'red'}}></i>)
                                    }</td>
                                    <td>
                                        <Link to={`/admin/user/${user._id}/edit`}>
                                            <Button variant='light' className='btn-sm'><i className='fas fa-edit'></i></Button>
                                        </Link>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}><i className='fas fa-times'></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </Container>

    )
}

export default UserListScreen