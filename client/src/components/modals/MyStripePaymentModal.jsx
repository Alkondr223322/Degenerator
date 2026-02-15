import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, {useState} from "react";
import userPayRequest from '../../API/userPayRequest';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

function MyStripePaymentModal(props) {  
    const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    
    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add funds to your [De]Generator account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" >Make a transaction</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default MyStripePaymentModal;