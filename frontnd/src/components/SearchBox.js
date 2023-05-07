import React, {useState} from 'react'
import { Button, Form, Nav } from 'react-bootstrap'
import {  useNavigate } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')
    const [show, setShow] = useState(false);

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword){
            navigate(`/?keyword=${keyword}`)
        }else{
            navigate("/")
        }
    }

    const changeState = () => {
        setShow(!show) 
    }
    return (
        <div className='d-flex '>
            
            { show ? (
                <Form onSubmit={submitHandler} className="d-flex">
                    <Form.Control
                        type='text'
                        name='q'
                        onChange={ (e) => setKeyword(e.target.value)}
                        className = 'me-sm-2 ms-sm-5 sq-border'
                    >
                    </Form.Control>
                    <Button
                        type='submit'
                        variant='outline-success'
                        className='p-2'
                    >
                        Search
                    </Button>
                </Form>
            ): null}
            <Button onClick={changeState}>
                {!show ? <i className='fas fa-search'></i> :
                <i className='fas fa-times'></i>
                }
                
            </Button>
            
        </div>
    )
}

export default SearchBox