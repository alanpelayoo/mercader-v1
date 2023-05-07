import React from 'react';
import { Navbar,Nav,Container, NavDropdown, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import SearchBox from './SearchBox';
import { logout } from '../actions/userAction';

function Header() {
  const userLogin = useSelector(state => state.userLogin );
  const {userInfo} = userLogin;
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  }
  
  return (
    <header >
      <Navbar bg="primary" expand="lg" variant='dark' collapseOnSelect className='py-2'>
        <Container>
          <LinkContainer to='/'>
            <Image src='https://mercader-bucket.s3.us-east-2.amazonaws.com/logo-h.png' alt='logo' className='logoimg'/>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox/>
            <Nav className="ms-auto">
              <LinkContainer to='/cart'>
                <Nav.Link><i className='fas fa-shopping-cart mx-1'></i>Cart</Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile <i class="fa-regular fa-id-badge"></i></NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout <i class="fa-solid fa-right-from-bracket"></i></NavDropdown.Item>
                </NavDropdown> 
              ):(
                <LinkContainer to='/login'>
                  <Nav.Link><i className='fas fa-user'></i>Login</Nav.Link>
                </LinkContainer>
              )}
              { userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users <i class="fa-regular fa-id-badge"></i></NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productslist'>
                    <NavDropdown.Item>Products <i class="fa-regular fa-id-badge"></i></NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderslist'>
                    <NavDropdown.Item>Orders <i class="fa-regular fa-id-badge"></i></NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown> 
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header