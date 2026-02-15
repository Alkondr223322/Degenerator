import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, {useState} from "react";
import { jwtDecode } from "jwt-decode";

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import { useTranslation} from "react-i18next";

function MyProjectListModal(props) {  
    const { t } = useTranslation(); 


    return (
        <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('Pick a project to load')}</Modal.Title>
        </Modal.Header>
        <Modal.Body id='importProjectCloudList'>
            <div className="d-grid gap-2">
                {props.cloudProjectButtons}
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
          {t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default MyProjectListModal;