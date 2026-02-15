import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, {useState} from "react";
import userRegister from '../../API/userRegister';
import { useTranslation} from "react-i18next";

function MyRegisterModal(props) {  
    const { t } = useTranslation(); 
    const [userName, setUserName] = useState('')
    const [userPwD, setUserPwD] = useState('')
    const [userMail, setUserMail] = useState('')


    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('Create new [De]Generator account')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">{t('u Email:')} </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={userMail}
              onChange={(e) => {setUserMail(e.target.value);}}
              />
          </InputGroup>
          <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">{t('u Username:')} </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={userName}
              onChange={(e) => {setUserName(e.target.value);}}
              />
          </InputGroup>
          <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">{t('u Password:')} </InputGroup.Text>
              <Form.Control
              aria-label="video text"
              aria-describedby="basic-addon1"
              value={userPwD}
              onChange={(e) => {setUserPwD(e.target.value);}}
              />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
          {t('Close')}
          </Button>
          <Button variant="primary" onClick={async ()=>{
              let res = await userRegister(userName, userMail, userPwD)
              console.log(res)
              if(res)props.handleClose()
            }}>{t('Register')}</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default MyRegisterModal;