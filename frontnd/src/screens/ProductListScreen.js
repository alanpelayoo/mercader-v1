import React, {useState, useEffect, } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container} from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, deleteProduct, createProduct} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen() {

    const dispatch = useDispatch();
    
    const match = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const productList = useSelector(state => state.productList)
    const {loading,error, products, pages, page} = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading:loadingDelete, error:errorDelete, success: successDelete} = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading:loadingCreate, error:errorCreate, success: successCreate, product: createdProduct} = productCreate

    const userLogin = useSelector(state => state.userLogin );
    const {userInfo} = userLogin;

    const location = useLocation();
    const navigate = useNavigate();

    const deleteHandler = (id) =>{
        if (window.confirm('Are you sure you want to delete this product ?')){
            dispatch(deleteProduct(id))
        }
        
    }

    let foo = searchParams.get('page')

    if (foo){
        foo = "?page=" + foo
    }else if (foo === null){
        foo = ""
    }

    useEffect(() =>{
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (!userInfo.isAdmin){
            navigate('/login')
        }

        if (successCreate){
            navigate(`/admin/product/${createdProduct._id}/edit`)
        }else{
            dispatch(listProducts(foo))
        }
        
    },[dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, foo])

    const createProductHandler = () => {
        dispatch(createProduct())
    }

    return (
        <Container className="p-3">
            <Row className='align-items-center '>
                <Col>
                    <h1>Products</h1>
                </Col>

                <Col className='text-end'>
                    <Button className='my-3 ' onClick={createProductHandler}>
                        <i className='fas fa-plus me-1'></i>Create Product
                    </Button>
                </Col>
            </Row>
            { loadingDelete && <Loader/> }
            { errorDelete && <Message variant='danger'> {errorDelete}</Message>}
            { loadingCreate && <Loader/> }
            { errorCreate && <Message variant='danger'> {errorCreate}</Message>}

            {loading ? (
                <Loader/>
            ):error 
                ?(<Message variant='danger'>{error}</Message>)
                :(
                    <div>
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>PRICE</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        
                                        <td>
                                            <Link to={`/admin/product/${product._id}/edit`}>
                                                <Button variant='light' className='btn-sm'><i className='fas fa-edit'></i></Button>
                                            </Link>
                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}><i className='fas fa-trash'></i></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Paginate page={page} pages={pages} isAdmin={true}/>
                    </div>
                )}
        </Container>

    )
}

export default ProductListScreen