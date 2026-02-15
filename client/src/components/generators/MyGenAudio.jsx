import React, { useEffect, useRef, useState } from "react";
import etro from "etro";
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Button from 'react-bootstrap/Button';
import { useTranslation} from "react-i18next";
import MyInstrumentPicker from "../buttons/MyInstrumentPicker";
import composeMusic from "../../middleware/composeMusic";

function MyGenAudio(props) {
  const { t } = useTranslation();
  // const [startTime, setstartTime] = useState(0)
  // const [volume, setvolume] = useState(100)
  // const [playbackRate, setplaybackRate] = useState(100)
  const setaudioSettings = props.setaudioSettings

  useEffect(()=>{
    //setstartTime(Math.min(props.videoDuration, startTime))
    setaudioSettings({...props.audioSettings, startTime: Math.min(props.videoDuration, props.audioSettings.startTime)});
  }, [props.videoDuration])

//   useEffect(()=>{
//     setaudioSettings({
//       startTime: startTime,
//       duration: props.videoDuration,
//       source: '',
//       sourceStartTime: 0, // default: 0
//       muted: false, // default: false
//       volume: (volume/100).toFixed(2), // default: 1
//       playbackRate: (playbackRate/100).toFixed(2), // default: 1
//     })
// }, [startTime, props.videoDuration, setaudioSettings, volume, playbackRate])
  // useEffect(()=>{
  //   const objclone = structuredClone(props.audioSettings);
  //   objclone.startTime = startTime
  //   setaudioSettings(objclone)
  // }, [startTime, props.audioSettings, setaudioSettings])
  // useEffect(()=>{
  //   const objclone = structuredClone(props.audioSettings);
  //   objclone.volume = (volume/100).toFixed(2)
  // }, [volume, props.audioSettings, setaudioSettings])
  // useEffect(()=>{
  //   const objclone = structuredClone(props.audioSettings);
  //   objclone.playbackRate = (playbackRate/100).toFixed(2)
  // }, [playbackRate, props.audioSettings, setaudioSettings])


    return(
      <div className="d-flex flex-column justify-content-center flex-wrap align-self-center " style={{minWidth: "100%"}}>
        <Form.Group controlId="formFile" className="mb-3 p-2">
          <Form.Label>{t('Upload custom audio file')} </Form.Label>
          <Form.Control type="file" accept="audio/*, video/*" onChange={(e)=>{
            if (e.target.files[0]) {
              console.log(e.target.files[0])
              let filet = e.target.files[0].type.split('/')[0]
              console.log(filet)
              if(filet === 'video' || filet === 'audio'){
                props.setaudioFile(URL.createObjectURL(e.target.files[0]));
              }
              e.target.value = null
            }
          }}/>
        </Form.Group>
        <InputGroup className="my-3 p-2 " >
            <audio src={props.audioFile} controls id={`audioEl${props.audioID}`} style={{maxWidth: "75%"}} loop={props.isMusic}></audio>
            <Button variant="danger" onClick={()=>{props.setaudioFile('')}} >X</Button>
        </InputGroup>
        <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Begin playing audio at at:')}  {props.audioSettings.startTime} {t('seconds')} </Form.Label>
        <Form.Range min={0} max={props.videoDuration} value={props.audioSettings.startTime} onChange={(e)=> 
          props.setaudioSettings({...props.audioSettings, startTime: Math.min(e.target.value, props.videoDuration)})} />
        </InputGroup>
        <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Audio volume:')} {(props.audioSettings.volume*100).toFixed(0)}%</Form.Label>
        <Form.Range min={0} max={100} value={props.audioSettings.volume*100} onChange={(e)=>{
          props.setaudioSettings({...props.audioSettings, volume: e.target.value/100})
          let audioEl = document.getElementById(`audioEl${props.audioID}`);
          audioEl.volume = e.target.value/100;
        }}/>
        </InputGroup>
        <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Playback speed:')} {(props.audioSettings.playbackRate*100).toFixed(0)}%</Form.Label>
        <Form.Range min={25} max={200} value={props.audioSettings.playbackRate*100} onChange={(e)=>{
          props.setaudioSettings({...props.audioSettings, playbackRate: e.target.value/100})
          let audioEl = document.getElementById(`audioEl${props.audioID}`);
          audioEl.playbackRate = e.target.value/100;
        }} step={1}/>
        </InputGroup>
        {props.isMusic &&
          <><div className="d-flex">
            <MyInstrumentPicker pKey={1} insChoice={props.audioSettings.bassIns} insTitle={'Rythm instrument'} setIns={(ins) => { props.setaudioSettings({ ...props.audioSettings, bassIns: ins }); } } />
            <MyInstrumentPicker pKey={2} insChoice={props.audioSettings.melodyIns} insTitle={'Melody instrument'} setIns={(ins) => { props.setaudioSettings({ ...props.audioSettings, melodyIns: ins }); } } />
            <MyInstrumentPicker pKey={3} insChoice={props.audioSettings.chordsIns} insTitle={'Background instrument'} setIns={(ins) => { props.setaudioSettings({ ...props.audioSettings, chordsIns: ins }); } } />

          </div><div className="d-grid">
              <Button variant="dark" onClick={async (e) => {
                e.target.disabled = true;
                let composeRes = await composeMusic(props.audioSettings.bassIns, props.audioSettings.melodyIns, props.audioSettings.chordsIns, props.audioSettings.bassArr, props.audioSettings.melodyArr, props.audioSettings.chordsArr);
                if (!composeRes) {
                  alert(t('Something went wrong. Notes either don\'t exist or don\'t follow the format'));
                  e.target.disabled = false;
                  return;
                }
                props.setaudioFile(composeRes);
                e.target.disabled = false;
              } }>{t('Compose')}</Button>
            </div></>
        }
        </div>
    );
}
  
  export default MyGenAudio;