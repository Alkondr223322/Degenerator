import React, { useEffect, useRef, useState, useCallback} from "react";
import etro from "etro";
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { RgbColorPicker  } from "react-colorful";

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

import { useTranslation} from "react-i18next";

function MyGenText(props) {
    const { t } = useTranslation();

    const canvasRef = useRef();
    
    const fontArr = [
      'Arial, sans-serif',
      'Helvetica, sans-serif',
      'Gill Sans, sans-serif',
      'Lucida, sans-serif',
      'Helvetica Narrow, sans-serif',
      'Times, serif',
      'Times New Roman, serif',
      'Palatino, serif',
      'Bookman, serif',
      'New Century Schoolbook, serif',
      'Andale Mono, monospace',
      'Courier New, monospace',
      'Courier, monospace',
      'Lucidatypewriter, monospace',
      'Fixed, monospace',
      'Comic Sans, Comic Sans MS, cursive',
      'Zapf Chancery, cursive',
      'Coronetscript, cursive',
      'Florence, cursive',
      'Parkavenue, cursive',
      'Impact, fantasy',
      'Arnoldboecklin, fantasy',
      'Oldtown, fantasy',
      'Blippo, fantasy',
      'Brushstroke, fantasy',
    ]

    function canvasDot(clientX, clientY){
      // console.log('clientX ' + clientX)
      // console.log('clientY' + clientY)
      // if(clientX < 0 || clientY < 0) return
      const canvas = canvasRef.current;
      var rect = canvas.getBoundingClientRect();
      let textX =  (clientX ) * 5
      let textY = (clientY )  * 5
      console.log(textX)
      console.log(textY)
      // settextX((e.clientX - rect.left) *5)
      // settextY((e.clientY - rect.top) * 5)
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "LightGray";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      
      //ctx.fillRect(10, 10, 100, 100);
      ctx.fillStyle = "blue";
      //console.log(textX); console.log(textY)
      ctx.beginPath()
      ctx.arc(textX/5, textY/5, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle  = "blue";
      ctx.beginPath()
      ctx.moveTo(textX/5, textY/5+10)
      ctx.lineTo(textX/5, textY/5-10)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(textX/5 +10, textY/5)
      ctx.lineTo(textX/5 -10, textY/5)
      ctx.stroke()
    }

    function mousedownFunc(e){
      console.log(e)
      const canvas = e.target;
      if (e.button === 0){
        
        var rect = canvas.getBoundingClientRect();
        //canvasDot(e.clientX, e.clientY)
        props.settextSettings({...props.textSettings, textX: (e.clientX - rect.left) *5, textY: (e.clientY - rect.top) * 5})
        canvas.removeEventListener("mousedown", cachedmousedownFunc);
      }

    }

    const cachedmousedownFunc = useCallback(mousedownFunc)

    useEffect(()=>{
      let canvas = canvasRef.current
      //canvasDot(props.videoX/2/5, props.videoY * 0.75/5)
      canvas.addEventListener('mousedown', cachedmousedownFunc)
    }, [cachedmousedownFunc])


    useEffect(()=>{
      canvasDot(props.textSettings.textX/5, props.textSettings.textY/5)
    }, [props.textSettings.textX, props.textSettings.textY])
    

    return(
        <><InputGroup className="my-3 p-2 ">
            <InputGroup.Text id="basic-addon1">{t('Video text:')} </InputGroup.Text>
            <Form.Control
                style={{fontSize: `${props.textSettings.font.split('px')[0]}px`, fontFamily: `${props.textSettings.font.split('px ')[1]}, sans-serif` }}
                aria-label="video text"
                aria-describedby="basic-addon1"
                value={props.videoText}
                onChange={(e) => { props.setvideoText(e.target.value); } } />
        </InputGroup>
        <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Begin showing text at:')} {props.textSettings.startTime} {t('seconds')}</Form.Label> 
        <Form.Range min={0} max={props.videoDuration} value={props.textSettings.startTime} onChange={(e)=>props.settextSettings({...props.textSettings, startTime: +e.target.value})}/>
        </InputGroup>
        <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Font size:')} {+props.textSettings.font.split('px')[0]}px</Form.Label>
        <Form.Range min={8} max={72} value={+props.textSettings.font.split('px')[0]} onChange={(e)=>props.settextSettings({...props.textSettings, font: `${e.target.value}px sans-serif`})}/>
        </InputGroup>
        <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Text opacity:')} {(props.textSettings.opacity*100).toFixed(0)}%</Form.Label>
        <Form.Range min={0} max={100} value={(props.textSettings.opacity*100).toFixed(0)} onChange={(e)=>props.settextSettings({...props.textSettings, opacity: e.target.value/100})}/>
        </InputGroup>
        <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Text stroke thickness:')} {props.textSettings.textStroke.thickness}px</Form.Label>
        <Form.Range min={1} max={20} value={props.textSettings.textStroke.thickness} onChange={(e)=>
          props.settextSettings({...props.textSettings, textStroke: {...props.textSettings.textStroke, thickness: +e.target.value}})
          }/>
        </InputGroup>
          
        <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1" className="p-0">
        <Dropdown >
        <Dropdown.Toggle variant="light" id="dropdown-basic">
        {t('Text font:')} {props.textSettings.font.split('px ')[1]}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {fontArr.map((fontVal, index) => (
          <Dropdown.Item as='button' key={'fontItem'+index} value={fontVal} onClick={(e)=>{
            props.settextSettings({...props.textSettings, font: props.textSettings.font.split('px')[0] + 'px ' + e.target.value})
          }} style={{fontFamily: fontVal}}>{fontVal.split(',')[0]}</Dropdown.Item>
          ))}

        </Dropdown.Menu>
      </Dropdown>
      </InputGroup.Text>
        </InputGroup>

        <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1">{t('Text align:')} </InputGroup.Text>
        <ToggleButtonGroup type="radio" name="optionsAlign" value={props.textSettings.textAlign} className=''>
            <ToggleButton variant='outline-dark' id="optionsAlign-radio-1" value={'left'} onClick={(e)=>{props.settextSettings({...props.textSettings, textAlign: 'left'})}}>
            {t('Left')}
            </ToggleButton>
            <ToggleButton variant='outline-dark'  id="optionsAlign-radio-2" value={'center'} onClick={(e)=>{props.settextSettings({...props.textSettings, textAlign: 'center'})}}>
              {t('Center')}
            </ToggleButton>
            <ToggleButton variant='outline-dark'  id="optionsAlign-radio-3" value={'right'} onClick={(e)=>{props.settextSettings({...props.textSettings, textAlign: 'right'})}}>
              {t('Right')}
            </ToggleButton>
          </ToggleButtonGroup>
          </InputGroup>

          <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1">{t('Text direction:')} </InputGroup.Text>
        <ToggleButtonGroup type="radio" name="optionsDirection" value={props.textSettings.textDirection} className=''>
            <ToggleButton variant='outline-dark' id="optionsDirection-radio-1" value={'ltr'} onClick={(e)=>{props.settextSettings({...props.textSettings, textDirection: 'ltr'})}}>
            {t('Left to right')}
            </ToggleButton>
            <ToggleButton variant='outline-dark'  id="optionsDirection-radio-2" value={'rtl'} onClick={(e)=>{props.settextSettings({...props.textSettings, textDirection: 'rtl'})}}>
              {t('Right to left')}
            </ToggleButton>
          </ToggleButtonGroup>
          </InputGroup>

          <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1">{t('Text color:')} </InputGroup.Text>
        <RgbColorPicker  color={props.textSettings.color} onChange={(e) => {
          //console.log(e)
          props.settextSettings({...props.textSettings, color: new etro.Color(e.r, e.g, e.b, 1)})
        }} />
          </InputGroup>

          <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1">{t('Text stroke color:')} </InputGroup.Text>
        <RgbColorPicker  color={props.textSettings.textStroke.color} onChange={(e)=> {
          props.settextSettings({...props.textSettings, textStroke: {...props.textSettings.textStroke, color: new etro.Color(e.r, e.g, e.b, 1)}})
          }} />
          </InputGroup>

          <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1">{t('Text position:')} </InputGroup.Text>
        <canvas width={props.videoX/5} height={props.videoY/5} id="textCanvas" ref={canvasRef}/>
          </InputGroup>

        </>
    );
}
  
  export default MyGenText;