import {Button} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation} from "react-i18next";
import Form from 'react-bootstrap/Form';
import blobToBase64 from "../../middleware/blobToBase64";

function MyInstrumentPicker(props) {  
    const { t } = useTranslation();
    return (
      <div className="d-grid" style={{width: '33%'}}>
        <Dropdown >
        <Dropdown.Toggle variant="light" id="dropdown-basic"  style={{width: '100%'}}>
        {t(props.insTitle)}: {t(props.insChoice.split(' ')[0])}
        </Dropdown.Toggle>

        <Dropdown.Menu>
        <Dropdown.Item as='button' key={'SynthIns'} value={'Synth'} onClick={(e)=>{props.setIns(e.target.value)}}>{t('Synth')}</Dropdown.Item>
        <Dropdown.Item as='button' key={'MemIns'} value={'Membrane'} onClick={(e)=>{props.setIns(e.target.value)}}>{t('Membrane')}</Dropdown.Item>
        <Dropdown.Item as='button' key={'CasioIns'} value={'Casio'} onClick={(e)=>{props.setIns(e.target.value)}}>{t('Casio')}</Dropdown.Item>
        <Dropdown.Item as='button' key={'CustomIns'} value={'Custom'} onClick={(e)=>{
            //props.setIns(e.target.value)
            let fileinput = document.getElementById('insPickerInp' + props.pKey)
            fileinput.click()
        }}>{t('Custom instrument')}</Dropdown.Item>

        </Dropdown.Menu>
      </Dropdown>
      
        <Form.Control type="file" hidden id={'insPickerInp' + props.pKey} ria-describedby="inputGroupFileAddon03" aria-label="Upload" accept="audio/*, video/*" onChange={async (e)=>{
            if (e.target.files[0]) {
             console.log(e.target.files[0])

             let filet = e.target.files[0].type.split('/')[0]
             console.log(filet)
             if(filet === 'video' || filet === 'audio'){
                //console.log('Custom ' + await blobToBase64(e.target.files[0]))
                props.setIns('Custom ' + await blobToBase64(e.target.files[0]))
              }
              e.target.value = null
            }
          }}/>
      </div>
  );
}

export default MyInstrumentPicker;