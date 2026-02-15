import React, { useEffect, useRef, useState } from "react";
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useTranslation} from "react-i18next";

function MyGenSettings(props) {
    const { t } = useTranslation();

    return(
        <div className="d-flex flex-column justify-content-center flex-wrap align-self-center" style={{minWidth: "100%"}}>
    <InputGroup className="my-3 p-3 d-flex " >
        {/* <InputGroup.Text id="basic-addon1" className="overflow-scroll">{t('CAUTION, THE PROMPT MUST INCLIDE "[topic]" IN ITSELF')}</InputGroup.Text> */}
        <Form.Control
          className="text-center overflow-scroll"
          aria-describedby="basic-addon1"
          value={t('CAUTION, THE PROMPT MUST INCLIDE "[topic]" IN ITSELF')}
          disabled={true}
          style={{minWidth: "50%"}}
        />
    </InputGroup>
    <InputGroup className="my-3 p-3 ">
        <InputGroup.Text id="basic-addon1">{t('Text generation prompt:')} </InputGroup.Text>
        <Form.Control
            aria-label="video text"
            aria-describedby="basic-addon1"
            value={props.textPrompt}
            onChange={(e) => {props.setTextPrompt(e.target.value);}}
            style={{minWidth: "50%"}}
        />
    </InputGroup>
    <InputGroup className="my-3 p-3 ">
        <InputGroup.Text id="basic-addon1">{t('Music generation prompt:')} </InputGroup.Text>
        <Form.Control
            aria-label="video text"
            aria-describedby="basic-addon1"
            value={props.musicPrompt}
            onChange={(e) => {props.setMusicPrompt(e.target.value);}}
            style={{minWidth: "50%"}}
        />
    </InputGroup>
    <InputGroup className="my-3 p-3 ">
        <InputGroup.Text id="basic-addon1">{t('Images generation prompt:')} </InputGroup.Text>
        <Form.Control
            aria-label="video text"
            aria-describedby="basic-addon1"
            value={props.imagesPrompt}
            onChange={(e) => {props.setImagesPrompt(e.target.value);}}
            style={{minWidth: "50%"}}
        />
    </InputGroup>
        <InputGroup className="my-3 p-3 ">
        <InputGroup.Text id="basic-addon1">{t('Sora video generation prompt:')} </InputGroup.Text>
        <Form.Control
            aria-label="video text"
            aria-describedby="basic-addon1"
            value={props.soraPrompt}
            onChange={(e) => {props.setSoraPrompt(e.target.value);}}
            style={{minWidth: "50%"}}
        />
    </InputGroup>
        </div >
    );
}
  
  export default MyGenSettings;