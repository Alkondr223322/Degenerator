import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import defaultProfile from '../img/defaultprofile.png';
import MyModalBtn from './buttons/MyModalBtn';
import React, { useState } from 'react';


import MyLogoutBtn from './buttons/MyLogoutBtn';
import i18n from "i18next";
import { useTranslation} from "react-i18next";

//import MyPortmonePaymentModal from './modals/MyPortmonePaymentModal';

function MyNavBar(props) {
  const { t } = useTranslation();


  return (
    <><Navbar collapseOnSelect expand="lg" className="bg-dark" variant='dark'>
      <Container>
        <Navbar.Brand href="#home">[De]Generator</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          <NavDropdown title={t("Language")} id="collapsible-nav-dropdown">
              <NavDropdown.Item onClick={()=>{i18n.changeLanguage('en')}}>
                English
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={()=>{i18n.changeLanguage('ua')}}>
                Українська
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={t("Pricing")} id="collapsible-nav-dropdown">
              <NavDropdown.Item>
                {t('Each generation costs:')} {props.basePrice}$
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
              {t('Additional expenses:')}
              </NavDropdown.Item>
              <NavDropdown.Item>
                {t('u Images:')} {props.imagePrice}$ {t('per image')}
              </NavDropdown.Item>
                <NavDropdown.Item>
                {t('Sora videos')} {props.soraPrice}$ {t('per second')}
              </NavDropdown.Item>

              {/* <NavDropdown.Item>
                {t('u Music:')} {props.musicPrice}$ {t('per second')}
              </NavDropdown.Item> */}
            </NavDropdown>

          </Nav>
          <Nav>
            {/* <Navbar.Brand href="#home">
        
    </Navbar.Brand> */}
            <NavDropdown title={<div className='inlineDiv'>
              <img
                alt=""
                src={defaultProfile}
                width="30"
                height="30"
                className="d-inline-block align-top" />
              <span>   {t('Profile')}</span>
            </div>} id="collapsible-nav-dropdown">
              <NavDropdown.Item>
                <div className="d-grid gap-2">
                  <MyModalBtn handleShow = {props.handleShowLogin} isHidden={false} btnText={t("Login")}/>
                </div>
              </NavDropdown.Item>
              
              <NavDropdown.Item>
                <div className="d-grid gap-2">
                  <MyModalBtn handleShow = {props.handleShowRegister} isHidden={false} btnText={t("Register")}/>
                </div>
              </NavDropdown.Item>

              <NavDropdown.Item>
                <div className="d-grid gap-2">
                  <MyModalBtn handleShow = {props.handleShowChangePwD} isHidden={props.token === ''} btnText={t("Change password")}/>
                </div>
              </NavDropdown.Item>

              <NavDropdown.Item>
                <div className="d-grid gap-2">
                  <MyLogoutBtn isHidden={props.token === ''} setToken={props.setToken} btnText={t("Logout")} setBalance={props.setBalance}/>
                </div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              <NavDropdown.Item>
                {t('Balance:')} {props.balance}$
              </NavDropdown.Item>
              <NavDropdown.Item>
                <div className="d-grid gap-2">
                  <MyModalBtn handleShow = {props.handleShowPayment} isHidden={props.token === ''} btnText={t("Add funds")}/>
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {/* <MyLoginModal show={showLogin} handleClose={handleHideLogin} handleShowForgotPwD={handleShowForgotPwD} setToken = {props.setToken} setBalance = {props.setBalance}/>
    <MyRegisterModal show={showRegister} handleClose={handleHideRegister} />
    <MyPaymentModal show={showPayment} handleClose={handleHidePayment} token = {props.token} setBalance = {props.setBalance}/>
    <MyForgotPwDModal show={showForgotPwD} handleClose={handleHideForgotPwD} />
    <MyChangePwDModal show={showChangePwD} handleClose={handleHideChangePwD} token = {props.token}/> */}

    {/* <Button variant="outline-dark" onClick={handleShowLogin}>Login</Button>
    <Button variant="outline-dark" onClick={handleShowRegister}>Reg</Button>
    <Button variant="outline-dark" onClick={handleShowPayment}>Pay</Button>
    <Button variant="outline-dark" onClick={handleShowChangePwD}>Change</Button>
    <Button variant="outline-dark" onClick={handleShowForgotPwD}>Forgor</Button> */}
    </>
  );
}

export default MyNavBar;