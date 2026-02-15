import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, {useState} from "react";
import userPayRequest from '../../API/userPayRequest';
import { jwtDecode } from "jwt-decode";

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import { useTranslation} from "react-i18next";

function MyPaymentModal(props) {  
    const { t } = useTranslation(); 
    // const [cardNumber, setcardNumber] = useState('')
    // const [cardDateY, setcardDateY] = useState('')
    // const [cardDateM, setcardDateM] = useState('')
    // const [cardCVV, setcardCVV] = useState('')
    const [cardMoney, setcardMoney] = useState(5)


    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('Add funds to your [De]Generator account')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Card number: </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={cardNumber}
              onChange={(e) => {setcardNumber(e.target.value);}}
              />
          </InputGroup>
          <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Expiration date: </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={cardDateM}
              onChange={(e) => {setcardDateM(e.target.value);}}
              />
              <InputGroup.Text id="basic-addon1"> / </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={cardDateY}
              onChange={(e) => {setcardDateY(e.target.value);}}
              />
              <InputGroup.Text id="basic-addon1">CVV: </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={cardCVV}
              onChange={(e) => {setcardCVV(e.target.value);}}
              />
          </InputGroup> */}

          {/* <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Amount: </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={cardMoney}
              onChange={(e) => {setcardMoney(e.target.value);}}
              />
              <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
          </InputGroup> */}

          <ToggleButtonGroup type="radio" name="options" defaultValue={5} className='d-grid gap-2'>
            <ToggleButton variant='outline-dark' size="lg" id="tbg-radio-1" value={5} onClick={(e)=>{setcardMoney(5)}}>
              5.00$
            </ToggleButton>
            <ToggleButton variant='outline-dark' size="lg" id="tbg-radio-2" value={10} onClick={()=>{setcardMoney(10)}}>
              10.00$
            </ToggleButton>
            <ToggleButton variant='outline-dark' size='lg' id="tbg-radio-3" value={20} onClick={()=>{setcardMoney(20)}}>
              20.00$
            </ToggleButton>
          </ToggleButtonGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
          {t('Close')}
          </Button>
          <Button variant="primary" onClick={async ()=>{
            // console.log(props.token)
            // console.log(jwtDecode(props.token))
            let res = await userPayRequest(cardMoney, jwtDecode(props.token).userId)
            if(res){
              props.setBalance(res)
              props.handleClose()
            }
            }}>{t('Make a transaction')}</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default MyPaymentModal;