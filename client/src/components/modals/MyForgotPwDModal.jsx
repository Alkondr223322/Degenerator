import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, {useState} from "react";
import userForgotPassword from '../../API/userForgotPassword';
import { useTranslation} from "react-i18next";

function MyForgotPwDModal(props) {  
    const { t } = useTranslation(); 
    const [userMail, setuserMail] = useState('')


    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('A letter with a new password to your [De]Generator account will be sent to your email')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">{t('u Username:')} </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={userMail}
              onChange={(e) => {setuserMail(e.target.value);}}
              />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
          {t('Close')}
          </Button>
          <Button variant="primary" onClick={async ()=>{
            // console.log(props.token)
            // console.log(jwtDecode(props.token))
            let res = await userForgotPassword(userMail)
            if(res){
              props.handleClose()
            }
            }}>{t('Change password')}</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default MyForgotPwDModal;