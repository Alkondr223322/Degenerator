import React, { useEffect, useRef, useState, useReducer } from "react";
import etro from "etro";
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { useTranslation} from "react-i18next";
import { Volume } from "tone";

function MyGenImages(props) {
    const { t } = useTranslation();
    const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [imageOpacity, setimageOpacity] = useState(100)
  const [imgIndexer, setimgIndexer] = useState(0)

  const setimageSettings = props.setimageSettings


  useEffect(()=>{
    setimageSettings({
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
        opacity: imageOpacity/100, // default: 1
    })
}, [props.videoDuration, setimageSettings, props.videoX, props.videoY, imageOpacity])

    function spreadImagesEqually(){
        let timeForImage = props.videoDuration / props.imagesArray.length
        let curStart = 0
        let arrcp = [...props.imagesArray]

        for(let i = 0; i < arrcp.length; i++){
            arrcp[i].startAt = (curStart)
            curStart += timeForImage
            arrcp[i].endAt = (curStart)
        }
        props.setimagesArray([...arrcp])

    }

    return(
        <div className="d-flex flex-column justify-content-center flex-wrap align-self-center " style={{maxWidth: "75vw", width:"100%"}}>
        <InputGroup className="mb-3 p-2 ">
            <Form.Label>{t('Amount of images to generate:')} {props.imageCount}</Form.Label>
            <Form.Range min={1} max={10} value={props.imageCount} onChange={(e)=>props.setimageCount(e.target.value)} disabled={props.genBlocked}/>
        </InputGroup>
        <Form.Group  className="mb-3 p-2">
          <Form.Label>{t('Upload custom image file')}</Form.Label>
          <Form.Control type="file" id="imageInput" accept="image/* video/*" disabled={props.genBlocked } onChange={(e)=>{
            if (e.target.files[0]) {
             console.log(e.target.files[0])

             let filet = e.target.files[0].type.split('/')[0]
             console.log(filet)
             if(filet === 'image' || filet === 'video'){
                props.setimagesArray([...props.imagesArray, {file: e.target.files[0], startAt: 0, endAt: props.videoDuration, index: imgIndexer, volume: 1}])
                //props.imagesObj[imgIndexer] = {file: e.target.files[0], startAt: 0, endAt: props.videoDuration, index: imgIndexer};
                setimgIndexer(imgIndexer+1)
             }
             let imageInput = document.getElementById('imageInput')
             imageInput.value = null

            }
          }}/>
        </Form.Group>

        <InputGroup className="mb-3 p-2 ">
        <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch-music"
            label={t("Smooth transition between images")}
            defaultChecked={true}
            onChange={(e)=>{props.setsmoothTransition(e.target.checked)}}
        />
        </InputGroup>

        <Button variant="primary" onClick={spreadImagesEqually}>{t('Distribute images on the timeline equally')} </Button>
        <InputGroup className="my-3 p-2 ">
            {props.imagesArray.map((img, index) => (
                              <Card style={{ width: '18rem' }} key={'card'+index}>
                              <Card.Img as={img.file.type.split('/')[0] === 'image' ? 'img' : 'video'} variant="top" src={URL.createObjectURL(img.file)} />
                              <Card.Body className="d-flex flex-column justify-content-center">
                                  <Card.Title>{img.file.name}</Card.Title>
                                  <Card.Text>
          
                                  </Card.Text>
                                  <InputGroup className="mb-3 p-2 ">
                                          <Form.Label id={`img${index}StartAt`}>{t('Start showing this image at:')} {img.startAt} {t('seconds')}</Form.Label>
                                          <Form.Range min={0} max={props.videoDuration} defaultValue={img.startAt} onChange={(e) => {
                                            img.startAt = e.target.value; 
                                            document.getElementById(`img${index}StartAt`).innerHTML = t('Start showing this image at:') + " " + img.startAt + " " + t('seconds')
                                            }} />
                                      </InputGroup>
                                      <InputGroup className="mb-3 p-2 ">
                                          <Form.Label id={`img${index}EndAt`}>{t('Stop showing this image at:')} {img.endAt} {t('seconds')}</Form.Label>
                                          <Form.Range min={0} max={props.videoDuration} defaultValue={img.endAt}  onChange={(e) => {
                                            img.endAt = e.target.value
                                            document.getElementById(`img${index}EndAt`).innerHTML = t('Stop showing this image at:') + " " + img.endAt + " " + t('seconds')
                                            }} />
                                      </InputGroup>
                                    {img.file.type.split('/')[0] === 'video' &&
                                    <InputGroup className="mb-3 p-2 ">
                                        <Form.Label id={`img${index}volume`}>{t('Audio volume:')} {img.volume * 100} %</Form.Label>
                                        <Form.Range min={0} max={100} defaultValue={img.volume * 100}  onChange={(e) => {
                                            img.volume = e.target.value/100
                                            document.getElementById(`img${index}volume`).innerHTML = t('Audio volume:') + " " + (img.volume * 100).toFixed(0) + '%'
                                            }} />
                                    </InputGroup>
                                    }
      
                                  <Button variant="dark" value={img.index} onClick={(e) => {

                                    let arrcp = [...props.imagesArray]
                                    let i;
                                    for(i = 0; i < props.imagesArray.length; i++){
                                        if(props.imagesArray[i].index == e.target.value){
                                            break
                                        }
                                    }
                                    if(i > 0){
                                        let buff = props.imagesArray[i];
                                        arrcp[i] = props.imagesArray[i-1];
                                        arrcp[i-1] = buff;
                                        props.setimagesArray([...arrcp])
                                    }
                                  } }> {'<---'} </Button>
                                  <Button variant="danger" value={img.index} onClick={(e) => {

                                    props.setimagesArray([...props.imagesArray.filter((ele) => {
                                        console.log(ele.index)
                                        console.log(e.target.value);
                                        return ele.index != e.target.value 
                                    })]);

                                  } }>{t('Remove')}</Button>

                                    <Button variant="dark" value={img.index} onClick={(e) => {
                                    let arrcp = [...props.imagesArray]
                                    let i;
                                    for(i = 0; i < props.imagesArray.length; i++){
                                        if(props.imagesArray[i].index == e.target.value){
                                            break
                                        }
                                    }
                                    if(i < props.imagesArray.length-1){
                                        let buff = props.imagesArray[i];
                                        arrcp[i] = props.imagesArray[i+1];
                                        arrcp[i+1] = buff;
                                        props.setimagesArray([...arrcp])
                                    }
                                  } }> {'--->'} </Button>
                              </Card.Body>
                          </Card>
            ))}
        </InputGroup>
        
        </div>
    );
}
  
  export default MyGenImages;