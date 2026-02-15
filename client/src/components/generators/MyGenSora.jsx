import React, { useEffect, useRef, useState, useReducer } from "react";
import etro from "etro";
import { InputGroup, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { useTranslation} from "react-i18next";

function MyGenSora(props) {
  const { t } = useTranslation();

  const setSoraSettings = props.setSoraSettings


  useEffect(()=>{
    setSoraSettings({
        startTime: 0,
        duration: props.videoDuration,
        source: '',
        sourceX: 0, // default: 0
        sourceY: 0, // default: 0
        sourceWidth: props.videoX, // default: null (full width)
        sourceHeight: props.videoY, // default: null (full height)
        x: 0, // default: 0
        y: 0, // default: 0
        width: props.videoX, // default: null (full width)
        height: props.videoY, // default: null (full height)
        opacity: 1, // default: 1
    })
}, [props.videoDuration, setSoraSettings, props.videoX, props.videoY])

    return(
        <div className="d-flex flex-column justify-content-center flex-wrap align-self-center " style={{maxWidth: "75vw", width:"100%"}}>
        <Form.Group  className="mb-3 p-2">
          <Form.Label>{t('Upload base image for video generation')}</Form.Label>
          <Form.Control type="file" id="imageInput" accept="image/* video/*" disabled={props.genBlocked } onChange={(e)=>{
            if (e.target.files[0]) {
             console.log(e.target.files[0])

             let filet = e.target.files[0].type.split('/')[0]
             console.log(filet)
             if(filet === 'image'){
                props.setBaseImage([{file: e.target.files[0], index: 0}])
                //props.imagesObj[imgIndexer] = {file: e.target.files[0], startAt: 0, endAt: props.videoDuration, index: imgIndexer};
             }
             let imageInput = document.getElementById('imageInput')
             imageInput.value = null

            }
          }}/>
        </Form.Group>
                  <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1">{t('Sora video duration (seconds):')} </InputGroup.Text>
        <ToggleButtonGroup type="radio" name="optionsDur" value={props.soraVideoDuration} className=''>
            <ToggleButton variant='outline-dark' id="optionsDur-radio-1" value={'4'} onClick={(e)=>{props.setSoraVideoDuration(`4`); console.log(props.soraVideoDuration)}}>
            {t('4')}
            </ToggleButton>
            <ToggleButton variant='outline-dark'  id="optionsDur-radio-2" value={'8'} onClick={(e)=>{props.setSoraVideoDuration(`8`)}}>
              {t('8')}
            </ToggleButton>
            <ToggleButton variant='outline-dark'  id="optionsDur-radio-3" value={'12'} onClick={(e)=>{props.setSoraVideoDuration(`12`)}}>
              {t('12')}
            </ToggleButton>
          </ToggleButtonGroup>
          </InputGroup>
        <InputGroup className="my-3 p-2 ">
            {props.baseImage.map((img, index) => (
                              <Card style={{ width: '18rem' }} key={'card'+index}>
                              <Card.Img as={'img'} variant="top" src={URL.createObjectURL(img.file)} />
                              <Card.Body className="d-flex flex-column justify-content-center">
                                  <Card.Title>{img.file.name}</Card.Title>
                                  <Card.Text>
          
                                  </Card.Text>
      
                                  <Button variant="danger" value={img.index} onClick={(e) => {

                                    props.setBaseImage([]);

                                  } }>{t('Remove')}</Button>

                              </Card.Body>
                          </Card>
            ))}
            {props.soraFile.map((img, index) => (
                              <Card style={{ width: '18rem' }} key={'cardSora'+index}>
                              <Card.Img as={'video'} variant="top" src={URL.createObjectURL(img.file)} controls volume={img.volume} id="soraResultVideo"/>
                              <Card.Body className="d-flex flex-column justify-content-center">
                                  <Card.Title>{img.file.name}</Card.Title>
                                  <Card.Text>
          
                                  </Card.Text>
                                   <InputGroup className="mb-3 p-2 ">
                                          <Form.Label id="soraStartAt">{t('Start showing this image at:')} {img.startAt} {t('seconds')}</Form.Label>
                                          <Form.Range min={0} max={props.videoDuration} defaultValue={img.startAt} onChange={(e) => {
                                            img.startAt = e.target.value; 
                                            document.getElementById('soraStartAt').innerHTML = t('Start showing this image at:') + " " + img.startAt + " " + t('seconds')
                                            }} />
                                      </InputGroup>
                                      <InputGroup className="mb-3 p-2 ">
                                          <Form.Label id="soraStopAt">{t('Stop showing this image at:')} {img.endAt} {t('seconds')}</Form.Label>
                                          <Form.Range min={0} max={props.videoDuration} defaultValue={img.endAt} onChange={(e) => {
                                            img.endAt = e.target.value; 
                                            document.getElementById('soraStopAt').innerHTML = t('Stop showing this image at:') + " " + img.endAt + " " + t('seconds')
                                          }} />
                                      </InputGroup>
                                    {img.file.type.split('/')[0] === 'video' &&
                                    <InputGroup className="mb-3 p-2 ">
                                        <Form.Label id="soraVolume">{t('Audio volume:')} {img.volume * 100} %</Form.Label>
                                        <Form.Range min={0} max={100} step={1} defaultValue={img.volume * 100}  onChange={(e) => {
                                          img.volume = e.target.value/100;  
                                          document.getElementById('soraVolume').innerHTML = t('Audio volume:') + " " + (img.volume * 100).toFixed(0) + '%'
                                          document.getElementById('soraResultVideo').volume = img.volume
                                          }} />
                                    </InputGroup>
                                    }
                                  <Button variant="danger" value={img.index} onClick={(e) => {

                                    props.setSoraFile([]);

                                  } }>{t('Remove')}</Button>

                              </Card.Body>
                          </Card>
            ))}
        </InputGroup>
        
        </div>
    );
}
  
  export default MyGenSora;