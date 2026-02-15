import React, { useEffect, useRef, useState } from "react";
import etro from "etro";
import Accordion from 'react-bootstrap/Accordion';
import MyGenText from "./generators/MyGenText";
import MyGenAudio from "./generators/MyGenAudio";
import MyGenImages from "./generators/MyGenImages";
import MyGenResult from "./generators/MyGenResult";
import MyGenSettings from "./generators/MyGenSettings";
import MyGenSora from "./generators/MyGenSora";
import { useTranslation} from "react-i18next";

function MyGeneratorsAccordion(props) {
  const { t } = useTranslation();
    return (
        <Accordion flush className="variant-dark">
            <Accordion.Item eventKey="0" style={{maxWidth: "100%"}}>
            <Accordion.Header>{t('Fine tune content generation')}</Accordion.Header>
            <Accordion.Body className="d-flex flex-column justify-content-center" >

              <MyGenSettings textPrompt={props.textPrompt} setTextPrompt={props.setTextPrompt} 
              imagesPrompt={props.imagesPrompt} setImagesPrompt={props.setImagesPrompt} 
              musicPrompt={props.musicPrompt} setMusicPrompt={props.setMusicPrompt}
              soraPrompt={props.soraPrompt} setSoraPrompt={props.setSoraPrompt}  
              ></MyGenSettings>

            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" style={{maxWidth: "100%"}}>
            <Accordion.Header>{t('Video text')}</Accordion.Header>
            <Accordion.Body className="d-flex flex-column justify-content-center">
              <MyGenText videoText={props.videoText} setvideoText={props.setvideoText} 
              textLayerArr={props.textLayerArr} settextLayerArr={props.settextLayerArr} textSettings={props.textSettings} settextSettings = {props.settextSettings}
              videoX={props.videoX} videoY = {props.videoY} videoDuration={props.videoDuration}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" style={{maxWidth: "100%"}}>
            <Accordion.Header>{t('Speech')}</Accordion.Header>
            <Accordion.Body className="d-flex flex-column justify-content-center">
              <MyGenAudio videoDuration={props.videoDuration} audioFile={props.speechFile} setaudioFile={props.setspeechFile} audioLayerArr={props.speechLayerArr} 
              setaudioLayerArr={props.setspeechLayerArr} audioSettings={props.speechSettings} setaudioSettings={props.setspeechSettings} audioID={0} isMusic = {false}> </MyGenAudio>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" style={{maxWidth: "100%"}}>
            <Accordion.Header>{t('Music')}</Accordion.Header>
            <Accordion.Body className="d-flex flex-column justify-content-center">
            <MyGenAudio videoDuration={props.videoDuration} audioFile={props.musicFile} setaudioFile={props.setMusicFile} audioLayerArr={props.musicLayerArr} 
              setaudioLayerArr={props.setmusicLayerArr} audioSettings={props.musicSettings} setaudioSettings={props.setmusicSettings} audioID={1} isMusic = {true}>  </MyGenAudio>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" style={{maxWidth: "100%"}}>
            <Accordion.Header>{t('Images')}</Accordion.Header>
            <Accordion.Body className="d-flex flex-column justify-content-center">
              <MyGenImages 
              imagesArray={props.imagesArray} setimagesArray={props.setimagesArray} imageLayerArr={props.imageLayerArr} setimageLayerArr={props.setimageLayerArr} imageSettings={props.imageSettings} setimageSettings={props.setimageSettings}
                smoothTransition = {props.smoothTransition} setsmoothTransition = {props.setsmoothTransition} 
                videoX={props.videoX} videoY = {props.videoY} videoDuration={props.videoDuration} genBlocked={props.genBlocked}
                imageCount={props.imageCount} setimageCount={props.setimageCount}>
              </MyGenImages>
              
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" style={{maxWidth: "100%"}}>
            <Accordion.Header>{t('SoraAI Generated Video')}</Accordion.Header>
            <Accordion.Body className="d-flex flex-column justify-content-center">
              <MyGenSora 
              baseImage={props.baseImage} setBaseImage={props.setBaseImage} soraSettings={props.soraSettings} setSoraSettings={props.setSoraSettings}
              soraFile={props.soraFile} setSoraFile={props.setSoraFile} soraVideoDuration={props.soraVideoDuration} setSoraVideoDuration={props.setSoraVideoDuration}
                videoX={props.videoX} videoY = {props.videoY} videoDuration={props.videoDuration} genBlocked={props.genBlocked}>
              </MyGenSora>
              
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" style={{maxWidth: "100%"}}>
            <Accordion.Header>{t('Result')}</Accordion.Header>
            <Accordion.Body className="d-flex flex-column justify-content-center">
              <MyGenResult videoText={props.videoText} textLayerArr={props.textLayerArr} settextLayerArr={props.settextLayerArr} textSettings={props.textSettings}
              videoX={props.videoX} videoY = {props.videoY} videoDuration={props.videoDuration}
              speechFile={props.speechFile} speechLayerArr={props.speechLayerArr} setspeechLayerArr={props.setspeechLayerArr} speechSettings={props.speechSettings}
              musicFile={props.musicFile}  musicLayerArr={props.musicLayerArr} setmusicLayerArr={props.setmusicLayerArr} musicSettings={props.musicSettings}
              imagesArray={props.imagesArray} imageLayerArr={props.imageLayerArr} setimageLayerArr={props.setimageLayerArr} imageSettings={props.imageSettings}
              smoothTransition = {props.smoothTransition} projectName={props.projectName}
              soraFile={props.soraFile} soraSettings={props.soraSettings} setSoraLayerArr={props.setSoraLayerArr}
              > </MyGenResult>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
}
  
  export default MyGeneratorsAccordion;