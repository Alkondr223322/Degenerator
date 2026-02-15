import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, {useState} from "react";
import userPayRequest from '../../API/userPayRequest';

function MyPortmonePaymentModal(props) {  
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
            <div>
                <iframe name="myFrame" width="100%" height="500px"  frameborder="0" ></iframe>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" >Make a transaction</Button> */}

          <form action="https://www.portmone.com.ua/gateway/" method="post" target="myFrame">
        <input type="hidden" name="bodyRequest" value='{
            "paymentTypes":{"card":"Y","portmone":"N","token":"N",
                            "clicktopay":"N","createtokenonly":"N", "gpay":"Y"},
            "priorityPaymentTypes":{"card":"1","portmone":"2",
                                    "token":"0","clicktopay":"1","createtokenonly":"0", "gpay":"3"},
            "payee":{"payeeId":"3048","login":"","dt":"","signature":"", "shopSiteId":""},
            "order":{"description":"Test Payment","shopOrderNumber":"SHP-00445401",
                    "billAmount":"10","attribute1":"1","attribute2":"2","attribute3":"3",
                    "attribute4":"4","attribute5":"","successUrl":"","failureUrl":"",
                    "preauthFlag":"N","billCurrency":"UAH", "encoding":""},
            "token":{"tokenFlag":"N","returnToken":"N","token":"","cardMask":"",
                    "otherPaymentMethods":"Y","sellerToken":""},
            "payer":{"lang":"uk", "emailAddress":"test@ukr.net"},
            "style":{"type":"light","logo":"","backgroundColorHeader":"",
                    "backgroundColorButtons":"","colorTextAndIcons":"",
                    "borderColorList":"","bcMain":""}
        }' />
        <input type="hidden" name="typeRequest" value='json' />
        <Button type="submit" value="Portmone.com"> Make a transaction </Button>
        </form>

        </Modal.Footer>
      </Modal>
  );
}

export default MyPortmonePaymentModal;