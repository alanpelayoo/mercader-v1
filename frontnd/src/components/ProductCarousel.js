import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader';
import Message from './Message';
import {listAdvProducts} from '../actions/productActions';


function ProductCarousel() {
    
    const dispatch = useDispatch();
    const productAdv = useSelector( state => state.productAdv)
    const { error, loading, products } = productAdv

    useEffect( () => {
        dispatch(listAdvProducts())
    }, [dispatch])

    return ( loading ? <Loader/>
    : error
    ? <Message variant='danger'>{error}</Message>
    : (
        <div>
            <Carousel >
                {products.map( product => (
                    <Carousel.Item key={product.id}>
                        <Image src={product.image} alt={product.name} className="carousel"/>
                        <Carousel.Caption >
                            <h2>{product.name}</h2>
                            <p className='fs-4'>{product.description} </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
                
            </Carousel>
        </div>
        
    )
        
    )
}

export default ProductCarousel

