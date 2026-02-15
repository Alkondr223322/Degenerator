import './App.css';
import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
//import Movie from './components/Movie';
import MyNavBar from './components/MyNavBar';
import MyGeneratorWrapper from './components/MyGeneratorWrapper';

import MyLoginModal from './components/modals/MyLoginModal'
import MyRegisterModal from './components/modals/MyRegisterModal'
import MyPaymentModal from './components/modals/MyPaymentModal'
import MyForgotPwDModal from './components/modals/MyForgotPwDModal'
import MyChangePwDModal from './components/modals/MyChangePwDModal'
import MyProjectListModal from './components/modals/MyProjectListModal';

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

import ENtrans from './locales/en'
import UATrans from './locales/ua'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: ENtrans,
      ua: UATrans
    },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });


function App() {
  const [showLogin, setshowLogin] = useState(false);
  const [showRegister, setshowRegister] = useState(false);
  const [showPayment, setshowPayment] = useState(false);
  const [showChangePwD, setshowChangePwD] = useState(false);
  const [showForgotPwD, setshowForgotPwD] = useState(false);
  const [showImportProjectList, setshowImportProjectList] = useState(false);

  const handleShowLogin = () => setshowLogin(true);
  const handleShowRegister = () => setshowRegister(true);
  const handleShowPayment = () => setshowPayment(true);
  const handleShowChangePwD = () => setshowChangePwD(true);
  const handleShowForgotPwD = () => setshowForgotPwD(true);
  const handleShowCloudImport = () => setshowImportProjectList(true);

  const handleHideLogin = () => setshowLogin(false);
  const handleHideRegister = () => setshowRegister(false);
  const handleHidePayment = () => setshowPayment(false);
  const handleHideChangePwD = () => setshowChangePwD(false);
  const handleHideForgotPwD = () => setshowForgotPwD(false);
  const handleHideCloudImport = () => setshowImportProjectList(false);

  const [balance, setBalance] = useState(0)
  const [token, setToken] = useState('')

  const [basePrice, setbasePrice] = useState(0.01)
  const [imagePrice, setimagePrice] = useState(0.02)
  const [soraPrice, setSoraPrice] = useState(0.1)

  const [cloudProjectButtons, setCloudProjectButtons] = useState([]);


  return (
    <div className="App" style={{maxWidth: "100%"}}>

    <MyNavBar balance = {balance} token = {token} setToken = {setToken} setBalance = {setBalance} basePrice={basePrice} imagePrice={imagePrice} soraPrice={soraPrice}
      handleShowLogin={handleShowLogin} handleShowRegister={handleShowRegister} handleShowPayment={handleShowPayment} handleShowChangePwD={handleShowChangePwD}
    >

    </MyNavBar>
    <Container className=''>
      <Col>
        <Row>
          <MyGeneratorWrapper balance = {balance} token = {token} setBalance = {setBalance} basePrice={basePrice} imagePrice={imagePrice} soraPrice={soraPrice}
            handleShowLogin={handleShowLogin} handleShowPayment={handleShowPayment} handleShowCloudImport={handleShowCloudImport}
            setCloudProjectButtons={setCloudProjectButtons}
          />
        </Row>
      </Col>
    
    </Container>

    <MyLoginModal show={showLogin} handleClose={handleHideLogin} handleShowForgotPwD={handleShowForgotPwD} handleShowRegister={handleShowRegister} setToken = {setToken} setBalance = {setBalance}/>
    <MyRegisterModal show={showRegister} handleClose={handleHideRegister} />
    <MyPaymentModal show={showPayment} handleClose={handleHidePayment} token = {token} setBalance = {setBalance}/>
    <MyForgotPwDModal show={showForgotPwD} handleClose={handleHideForgotPwD} />
    <MyChangePwDModal show={showChangePwD} handleClose={handleHideChangePwD} token = {token} />
    <MyProjectListModal show={showImportProjectList} handleClose={handleHideCloudImport} token = {token} cloudProjectButtons={cloudProjectButtons}/>
  </div>
  );
}

export default App;
