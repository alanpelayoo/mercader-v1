import React, { useState, useEffect } from 'react';

import { Row,Col, Container } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions'

import {  useNavigate, useLocation, useSearchParams  } from 'react-router-dom'

function HomeScreen() {
  
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()

  const productList = useSelector( state => state.productList);
  const {error, loading, products, pages, page} = productList;

  let foo = searchParams.get('keyword')
  let foo2 = searchParams.get('page')

  if (foo){
    foo = "?keyword=" + foo
  }else if (foo === null && foo2){
    foo = "?page=" + foo2
  }else if (foo === null && foo2 === null){
    foo = ""
  }
  useEffect(() => {
    dispatch(listProducts(foo));
  }, [dispatch, foo, foo2]);

  return (
    <div className='p-0'>
        { !foo && <ProductCarousel/>}
        <Container className='p-3'>
        <h1>Latest Products</h1>
          {loading ? <Loader />
            : error ? <Message variant='danger'> {error}</Message> 
              :
              <div>
                <Row>
                  {products.map(product => (
                      <Col key={product._id} sm={12} md={6} lg={4} xl={3} >
                          <Product product={product} />
                      </Col>
                  ))}
                </Row> 
                <Paginate page={page} pages={pages}/>
              </div>
          }
        </Container>
        
    </div>
  )
}

export default HomeScreen