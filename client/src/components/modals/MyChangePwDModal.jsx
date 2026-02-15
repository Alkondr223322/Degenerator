import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, {useState} from "react";
import userChangePassword from '../../API/userChangePassword';
import { jwtDecode } from "jwt-decode";
import { useTranslation} from "react-i18next";

function MyChangePwDModal(props) { 
    const { t } = useTranslation(); 
    const [oldPwD, setoldPwD] = useState('')
    const [newPwD, setnewPwD] = useState('')


    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('Change password of your [De]Generator account')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">{t('Current password:')} </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={oldPwD}
              onChange={(e) => {setoldPwD(e.target.value);}}
              />
          </InputGroup>
          <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">{t('New password:')} </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={newPwD}
              onChange={(e) => {setnewPwD(e.target.value);}}
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
            let res = await userChangePassword(oldPwD, newPwD, jwtDecode(props.token).userId)
            if(res){
              props.handleClose()
            }
            }}>{t('Change password')}</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default MyChangePwDModal;