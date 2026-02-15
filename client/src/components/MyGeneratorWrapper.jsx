import {Button} from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import userReduceBalance from "../API/userReduceBalance";
import { jwtDecode } from "jwt-decode";
import etro from "etro";

import MyGeneratorsAccordion from "./MyGeneratorsAccordion";
import genText from "../API/genText";
import genSpeech from "../API/genSpeech";
import genImages from "../API/genImages";
import genMusic from "../API/genMusic";
import genSora from "../API/genSora";
import { useTranslation} from "react-i18next";
import composeMusic from "../middleware/composeMusic";
import blobToBase64 from "../middleware/blobToBase64";
import b64toBlob from "../middleware/b64toBlob";
import projectSave from "../API/projectSave";
import getUserProjects from "../API/getUserProjects";
import getUserProject from "../API/getUserProject";
import { use } from "react";

function MyGeneratorWrapper(props) { 
    const { t } = useTranslation();
    const [projectName, setprojectName] = useState('New Project'); 
    const [topic, setTopic] = useState(''); 
    const [videoDuration, setvideoDuration] = useState(10); 
    const [imageCount, setimageCount] = useState(5); 
    const [genBlocked, setgenBlocked] = useState(false); 

    const [videoX, setvideoX] = useState(720); 
    const [videoY, setvideoY] = useState(1280); 

    const [textPrompt, setTextPrompt] = useState(`
Write text for a short-form video with a single narrator telling an interesting fact on the topic of [topic], the text mustn't be longer than 4 sentences long, and your response should contain only what the narrator says`);
    const [imagesPrompt, setImagesPrompt] = useState(`
Background images suitable for a short-form video on the topic of [topic]`);
    const [musicPrompt, setMusicPrompt] = useState(`
Background music suitable for a short-form video on the topic of [topic]`);
    const [soraPrompt, setSoraPrompt] = useState(`
Background video suitable for a short-form video on the topic of [topic]`);

    const [needMusic, setneedMusic] = useState(true); 
    const [needTTSMale, setneedTTSMale] = useState(true);
    const [needTTSFemale, setneedTTSFemale] = useState(false);
    const [needImages, setneedImages] = useState(true); 
    const [needText, setneedText] = useState(true); 
    const [needSora, setneedSora] = useState(true); 

    const [videoText, setvideoText] = useState('');
    const [textLayerArr, settextLayerArr] = useState([])
    const [textSettings, settextSettings] = useState({
        startTime: 0,
        duration: videoDuration,
        text: 'Hello World',
        x: 0, // default: 0
        y: 0, // default: 0
        width: 1080, // default: null (full width)
        height: 1920, // default: null (full height)
        opacity: 1, // default: 1
        color: etro.parseColor('white'), // default: new etro.Color(0, 0, 0, 1)
        font: '10px sans-serif', // default: '10px sans-serif'
        textX: videoX/2, // default: 0
        textY: videoY*0.75, // default: 0
        textAlign: 'left', // default: 'left'
        textBaseline: 'alphabetic', // default: 'alphabetic'
        textDirection: 'ltr', // default: 'ltr'
        textStroke: { // default: null (no stroke)
            color: etro.parseColor('black'),
            thickness: 2, // default: 1
        }
    })

    const [musicFile, setMusicFile] = useState('');
    const [musicLayerArr, setmusicLayerArr] = useState([])
    const [musicSettings, setmusicSettings] = useState({
        startTime: 0,
        duration: videoDuration,
        source: '',
        sourceStartTime: 0, // default: 0
        muted: false, // default: false
        volume: 1, // default: 1
        playbackRate: 1, // default: 1
        bassIns: 'Synth',
        melodyIns: 'Synth',
        chordsIns: 'Synth',
        bassArr: [],
        melodyArr: [],
        chordsArr: [],
    })

    const [speechFile, setspeechFile] = useState('');
    const [speechLayerArr, setspeechLayerArr] = useState([])
    const [speechSettings, setspeechSettings] = useState({
        startTime: 0,
        duration: videoDuration,
        source: '',
        sourceStartTime: 0, // default: 0
        muted: false, // default: false
        volume: 1, // default: 1
        playbackRate: 1, // default: 1
    })

    const [imagesArray, setimagesArray] = useState([]);
    const [imageLayerArr, setimageLayerArr] = useState([])
    const [imageSettings, setimageSettings] = useState({
        startTime: 0,
        duration: videoDuration,
        source: '',
        sourceX: 0, // default: 0
        sourceY: 0, // default: 0
        sourceWidth: videoX, // default: null (full width)
        sourceHeight: videoY, // default: null (full height)
        x: 0, // default: 0
        y: 0, // default: 0
        width: videoX, // default: null (full width)
        height: videoY, // default: null (full height)
        opacity: 1, // default: 1
    })
    const [smoothTransition, setsmoothTransition] = useState(true);

    const [baseImage, setBaseImage] = useState([]);
    const [soraFile, setSoraFile] = useState([])
    const [soraLayerArr, setSoraLayerArr] = useState([])
    const [soraVideoDuration, setSoraVideoDuration] = useState('4')
    const [soraSettings, setSoraSettings] = useState({
        startTime: 0,
        duration: videoDuration,
        source: '',
        sourceX: 0, // default: 0
        sourceY: 0, // default: 0
        sourceWidth: videoX, // default: null (full width)
        sourceHeight: videoY, // default: null (full height)
        x: 0, // default: 0
        y: 0, // default: 0
        width: videoX, // default: null (full width)
        height: videoY, // default: null (full height)
        opacity: 1, // default: 1
    })

    async function generateContent(){
        // Заблокувати інтерфейс
        setgenBlocked(true)

        // Перевірити чи увійшов користувач до системи
        console.log(topic)
        let balanceRes;
        if(props.token === ''){
            // Якщо ні, відкрити вікно логіну, розблокувати інтерфейс, зупинити генерацію
            props.handleShowLogin()
            setgenBlocked(false)
            return
        }
        // Розрахувати ціну генерації
        let price = (
            (needText ? props.basePrice : 0) + 
            (needMusic ? props.basePrice : 0) + 
            ((needTTSFemale || needTTSMale) ? props.basePrice : 0) + 
            (needImages ? props.imagePrice * imageCount + props.basePrice: 0) +
            (needSora ? props.soraPrice * videoDuration + props.basePrice: 0)
        ).toFixed(2)
        // Перевірити чи достатньо грошей на акаунті користувача
        if(props.balance < price){
            // Якщо ні, відкрити вікно оплати, розблокувати інтерфейс, зупинити генерацію
            props.handleShowPayment()
            setgenBlocked(false)
            return
        }

        let textGenRes = videoText
        // Якщо обрано опцію генерації тексту, відправити відповідний запит на сервер
        if(needText){
            textGenRes = await genText(topic, textPrompt)
            if(!textGenRes){
                // При помилці вивести повідомлення, розблокувати інтерфейс, зупинити генерацію
                alert('Something went wrong, funds for this portion of generation will not be taken, generation aborted')
                setgenBlocked(false)
                return
            }
            // Записати результат генерації у змінну
            setvideoText(textGenRes)
            // Списати вартість генерації тексту з балансу користувача
            balanceRes = await userReduceBalance(props.basePrice, jwtDecode(props.token).userId)
            if(balanceRes){
                props.setBalance(balanceRes)
            }
        }

        // Якщо обрано опцію генерації голосу, відправити відповідний запит на сервер відповідно до статі голосу
        if(needTTSFemale){
            let speechGenRes = await genSpeech(textGenRes, 'Female')
            if(!speechGenRes){
                // При помилці вивести повідомлення, розблокувати інтерфейс, зупинити генерацію
                alert('Something went wrong, funds for this portion of generation will not be taken, generation aborted')
                setgenBlocked(false)
                return
            }
            // Записати результат генерації у змінну
            setspeechFile(speechGenRes)
            // Списати вартість генерації голосу з балансу користувача
            balanceRes = await userReduceBalance(props.basePrice, jwtDecode(props.token).userId)
            if(balanceRes){
                props.setBalance(balanceRes)
            }
        }else if(needTTSMale){
            let speechGenRes = await genSpeech(textGenRes, 'Male')
            if(!speechGenRes){
                // При помилці вивести повідомлення, розблокувати інтерфейс, зупинити генерацію
                alert('Something went wrong, funds for this portion of generation will not be taken, generation aborted')
                setgenBlocked(false)
                return
            }
            // Записати результат генерації у змінну
            setspeechFile(speechGenRes)
            // Списати вартість генерації голосу з балансу користувача
            balanceRes = await userReduceBalance(props.basePrice, jwtDecode(props.token).userId)
            if(balanceRes){
                props.setBalance(balanceRes)
            }
        }

        // Якщо обрано опцію генерації музики, відправити відповідний запит на сервер
        if(needMusic){
            // Згенерувати ноти
            let musicGenRes = await genMusic(topic, musicPrompt)
            if(!musicGenRes){
                 // При помилці вивести повідомлення, розблокувати інтерфейс, зупинити генерацію
                alert('Something went wrong, funds for this portion of generation will not be taken, generation aborted')
                setgenBlocked(false)
                return
            }
            // Записати результат генерації у змінну
            setmusicSettings({...musicSettings, bassArr: musicGenRes[0], melodyArr: musicGenRes[1], chordsArr: musicGenRes[2]})
            //setMusicFile(musicGenRes)
            // Скомпонувати музику
            let composeRes = await composeMusic(musicSettings.bassIns, musicSettings.melodyIns, musicSettings.chordsIns, musicGenRes[0], musicGenRes[1], musicGenRes[2])
            if(!composeRes){
                // При помилці вивести повідомлення, розблокувати інтерфейс, зупинити генерацію
                alert('Something went wrong, funds for this portion of generation will not be taken, generation aborted')
                setgenBlocked(false)
                return
            }
            // Записати результат генерації у змінну
            setMusicFile(composeRes)
            // Списати вартість генерації музики з балансу користувача
            balanceRes = await userReduceBalance(props.basePrice, jwtDecode(props.token).userId)
            if(balanceRes){
                props.setBalance(balanceRes)
            }
        }

        // Якщо обрано опцію генерації зображень, відправити відповідний запит на сервер
        if(needImages){
            let imageGenRes = await genImages(topic, imagesPrompt, imageCount, videoDuration)
            if(!imageGenRes){
                // При помилці вивести повідомлення, розблокувати інтерфейс, зупинити генерацію
                alert('Something went wrong, funds for this portion of generation will not be taken, generation aborted')
                setgenBlocked(false)
                return
            }
            // Записати результат генерації у змінну
            setimagesArray([...imagesArray, ...imageGenRes])
            // Списати вартість генерації музики з балансу користувача
            balanceRes = await userReduceBalance(props.imagePrice * imageCount + props.basePrice, jwtDecode(props.token).userId)
            if(balanceRes){
                props.setBalance(balanceRes)
            }
        }
        // Якщо обрано опцію генерації відео Sora, відправити відповідний запит на сервер
        if(needSora){
            let soraGenRes = await genSora(topic, soraPrompt, baseImage, soraVideoDuration, `${videoX}x${videoY}`)

            if(!soraGenRes){
                // При помилці вивести повідомлення, розблокувати інтерфейс, зупинити генерацію
                alert('Something went wrong, funds for this portion of generation will not be taken, generation aborted')
                setgenBlocked(false)
                return
            }
            // Записати результат генерації у змінну
            setSoraFile([soraGenRes])
            // Списати вартість генерації відео Sora з балансу користувача
            balanceRes = await userReduceBalance(props.soraPrice * soraVideoDuration + props.basePrice, jwtDecode(props.token).userId)
            if(balanceRes){
                props.setBalance(balanceRes)
            }
        }
        // Розблокувати інтерфейс
        setgenBlocked(false)
    }

    useEffect(()=>{
        if(needTTSMale){setneedTTSFemale(false)}
    }, [needTTSMale])
    useEffect(()=>{
        if(needTTSFemale){setneedTTSMale(false)}
    }, [needTTSFemale])






    function readTextFile(file){
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsText(file)
          });

    }

    async function exportProject(){
        setgenBlocked(true)
        let projObj = {}
        projObj.projectName = projectName
        projObj.topic = topic
        projObj.videoDuration = videoDuration
        projObj.imageCount = imageCount
        projObj.videoX = videoX
        projObj.videoY = videoY
        projObj.textPrompt = textPrompt
        projObj.imagesPrompt = imagesPrompt
        projObj.musicPrompt = musicPrompt

        projObj.needImages = needImages
        projObj.needText = needText
        projObj.needMusic = needMusic
        projObj.needTTSMale = needTTSMale
        projObj.needTTSFemale = needTTSFemale

        projObj.smoothTransition = smoothTransition
        projObj.videoText = videoText
        projObj.textSettings = textSettings

        projObj.musicSettings = musicSettings

        projObj.speechSettings = speechSettings

        projObj.imageSettings = imageSettings

        projObj.needSora = needSora
        
        projObj.soraPrompt = soraPrompt

        projObj.soraVideoDuration = soraVideoDuration
        projObj.soraSettings = soraSettings

        let exportBaseImage = []

        for(let i = 0; i < baseImage.length; i++){
            let exportImgObj = {}
            exportImgObj.index = baseImage[i].index
            
            let imageBlob = baseImage[i].file
            let image64 = await blobToBase64(imageBlob)
            //console.log(image64)
            exportImgObj.file = image64
            exportBaseImage.push(exportImgObj)
        }

        projObj.baseImage = exportBaseImage

        let exportSoraFile = []

        for(let i = 0; i < soraFile.length; i++){
            let exportImgObj = {}
            exportImgObj.volume = soraFile[i].volume
            exportImgObj.startAt = soraFile[i].startAt
            exportImgObj.endAt = soraFile[i].endAt
            let imageBlob = soraFile[i].file
            let image64 = await blobToBase64(imageBlob)
            //console.log(image64)
            exportImgObj.file = image64
            exportSoraFile.push(exportImgObj)
        }

        projObj.soraFile = exportSoraFile

        if(musicFile !== ''){
            let musicblob = await fetch(musicFile).then(r => r.blob())
            let music64 = await blobToBase64(musicblob)
            //console.log(music64)
            projObj.musicFile = music64
        }else{
            projObj.musicFile = ''
        }
        
        if(speechFile !== ''){
            let speechBlob = await fetch(speechFile).then(r => r.blob())
            let speech64 = await blobToBase64(speechBlob)
            //console.log(speech64)
            projObj.speechFile = speech64
        }else{
            projObj.speechFile = ''
        }

        let exportImgArr = []

        for(let i = 0; i < imagesArray.length; i++){
            let exportImgObj = {}
            exportImgObj.startAt = imagesArray[i].startAt
            exportImgObj.endAt = imagesArray[i].endAt
            exportImgObj.index = imagesArray[i].index
            
            let imageBlob = imagesArray[i].file
            let image64 = await blobToBase64(imageBlob)
            //console.log(image64)
            exportImgObj.file = image64
            exportImgArr.push(exportImgObj)
        }

        projObj.imagesArray = exportImgArr

        return projObj
    }

    async function exportProjectCloud() {
        if(props.token === ''){
            alert('Please log in first')
            return
        }
        let projObj = await exportProject()
        await projectSave(projObj, jwtDecode(props.token).userId)
        setgenBlocked(false)
    }

    async function exportProjectDrive() {
        let projObj = await exportProject()
        console.log(projObj)
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(projObj)], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = projectName;
        a.click();
        setgenBlocked(false)
    }

    async function importProjectCloudLoadList(){
        if(props.token === ''){
            alert('Please log in first')
            return
        }
        let projList = await getUserProjects(jwtDecode(props.token).userId)
        setgenBlocked(false)
        console.log(projList)
        const projectButtons = projList.projects.map((proj) => (
            <Button variant="dark" size="lg"
                key={proj._id}
                value={proj.objID}
                onClick={() => importProjectCloud(proj.objID)}
            >
                {proj.name}
            </Button>
        ));
        props.setCloudProjectButtons(projectButtons)
        props.handleShowCloudImport()
        return projList
    }

    async function importProjectCloud(objID) {
        try {
            // Fetch the project file from server
            const projFile = await getUserProject(jwtDecode(props.token).userId, objID);

            if (!projFile) {
                alert("Could not load project file");
                return;
            }

            // Import the project into the editor
            importProject(projFile);

        } catch (error) {
            console.error("Error importing project from cloud:", error);
            alert("Error importing project");
        }
}

    async function importProject(projFile){
        //console.log(projFile)
        let contents = await readTextFile(projFile)
        //console.log(contents)
        let projObj = JSON.parse(contents)
        setgenBlocked(true)

        setTopic(projObj.topic)
        setvideoDuration(projObj.videoDuration)
        setimageCount(projObj.imageCount)
        setvideoX(projObj.videoX)
        setvideoY(projObj.videoY)
        setTextPrompt(projObj.textPrompt)
        setImagesPrompt(projObj.imagesPrompt)
        setMusicPrompt(projObj.musicPrompt)
        setprojectName(projObj.projectName)


        setneedImages(projObj.needImages)
        setneedText(projObj.needText)
        setneedMusic(projObj.needMusic)
        setneedTTSMale(projObj.needTTSMale)
        setneedTTSFemale(projObj.needTTSFemale)

        setsmoothTransition(projObj.smoothTransition)
        setvideoText(projObj.videoText)
        settextSettings(projObj.textSettings)
        setmusicSettings(projObj.musicSettings)
        setspeechSettings(projObj.speechSettings)
        setimageSettings(projObj.imageSettings)

        setneedSora(projObj.needSora)
        setSoraPrompt(projObj.soraPrompt)
        setSoraVideoDuration(projObj.soraVideoDuration)
        setSoraSettings(projObj.soraSettings)
        
        let importBaseImg = []
        for(let i = 0; i < projObj.baseImage.length; i++){
            let importImgObj = {}
            importImgObj.index = projObj.baseImage[i].index
            
            let imageb64 = projObj.baseImage[i].file
            const imageBlob = b64toBlob(imageb64)
            let imageFile = new File([imageBlob], 'image', {type: imageBlob.type})
            //console.log(image64)
            importImgObj.file = imageFile
            importBaseImg.push(importImgObj)
        }
        setBaseImage([...importBaseImg])

        let importSoraFile = []
        for(let i = 0; i < projObj.soraFile.length; i++){
            let importImgObj = {}
            importImgObj.startAt = projObj.soraFile[i].startAt
            importImgObj.endAt = projObj.soraFile[i].endAt
            importImgObj.volume = projObj.soraFile[i].volume
            
            let imageb64 = projObj.soraFile[i].file
            const imageBlob = b64toBlob(imageb64)
            let imageFile = new File([imageBlob], 'video', {type: imageBlob.type})
            //console.log(image64)
            importImgObj.file = imageFile
            importSoraFile.push(importImgObj)
        }
        setSoraFile([...importSoraFile])

        if(projObj.musicFile !== ''){
            const musicBlob = b64toBlob(projObj.musicFile);
            const musicBlobURL = URL.createObjectURL(musicBlob);
            setMusicFile(musicBlobURL)
        }

        if(projObj.speechFile !== ''){
            const speechBlob = b64toBlob(projObj.speechFile);
            const speechBlobURL = URL.createObjectURL(speechBlob);
            setspeechFile(speechBlobURL)
        }

        let importImgArr = []
        for(let i = 0; i < projObj.imagesArray.length; i++){
            let importImgObj = {}
            importImgObj.startAt = projObj.imagesArray[i].startAt
            importImgObj.endAt = projObj.imagesArray[i].endAt
            importImgObj.index = projObj.imagesArray[i].index
            
            let imageb64 = projObj.imagesArray[i].file
            const imageBlob = b64toBlob(imageb64)
            let imageFile = new File([imageBlob], 'image', {type: imageBlob.type})
            //console.log(image64)
            importImgObj.file = imageFile
            importImgArr.push(importImgObj)
        }
        setimagesArray([...importImgArr])

        setgenBlocked(false)

    }

    return (
        <div className="d-grid gap-3 border ">
            {/* <Button onClick={()=>console.log(textSettings)}>dasdasdda</Button> */}
    <InputGroup className="my-3 p-2 ">
        <InputGroup.Text id="basic-addon1" style={{minWidth: "50%"}}>{t('Project name:')} </InputGroup.Text>
        <Form.Control
            style={{minWidth: "50%"}}
            aria-label="project name"
            aria-describedby="basic-addon1"
            value={projectName}
            onChange={(e) => {setprojectName(e.target.value);}}
            disabled={genBlocked}
        />
        
        <Button variant="dark" onClick={exportProjectDrive} disabled={genBlocked} style={{minWidth: "25%"}}>{t('Export project')} </Button>
        <Button variant="dark" disabled={genBlocked} id="inputGroupFileAddon03" style={{minWidth: "25%"}} onClick={()=>{
            let fileinput = document.getElementById('inputGroupFile03')
            fileinput.click()
        }}> {t('Import project')}</Button>

        <Button variant="dark" onClick={exportProjectCloud} disabled={genBlocked} style={{minWidth: "25%"}}>{t('Save to cloud')} </Button>
        <Button variant="dark" disabled={genBlocked} id="inputGroupFileAddon03" style={{minWidth: "25%"}} onClick={importProjectCloudLoadList}> {t('Import from cloud')}</Button>

        <Form.Control type="file" hidden id="inputGroupFile03" ria-describedby="inputGroupFileAddon03" aria-label="Upload" accept="application/json" disabled={genBlocked} onChange={(e)=>{
            if (e.target.files[0]) {
             console.log(e.target.files[0])

             let filet = e.target.files[0].type
             console.log(filet)
             if(filet === 'application/json'){
                //console.log('good')
                importProject(e.target.files[0])
             }
             let imageInput = document.getElementById('inputGroupFile03')
             imageInput.value = null

            }
          }}/>
    </InputGroup>
    
    <InputGroup className="mb-3 p-2 ">
        <InputGroup.Text id="basic-addon1">{t('Video topic:')} </InputGroup.Text>
        <Form.Control
            aria-label="video text"
            aria-describedby="basic-addon1"
            value={topic}
            onChange={(e) => {setTopic(e.target.value);}}
            disabled={genBlocked}
        />
    </InputGroup>
    <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Total video duration:')} {videoDuration} {t('seconds')}</Form.Label>
        <Form.Range min={1} max={60} value={videoDuration} onChange={(e)=>setvideoDuration(e.target.value)} disabled={genBlocked}/>
    </InputGroup>
    {/* <InputGroup className="mb-3 p-2 ">
        <Form.Label>{t('Amount of images to generate:')} {imageCount}</Form.Label>
        <Form.Range min={1} max={10} value={imageCount} onChange={(e)=>setimageCount(e.target.value)} disabled={genBlocked}/>
    </InputGroup> */}

    <InputGroup className="mb-3 p-2 d-flex justify-content-between">
    <Form.Check  className="me-3" 
            type="switch"
            id="custom-switch-TTS"
            label={t("Generate text")}
            onChange={(e)=>{setneedText(e.target.checked)}}
            disabled={genBlocked}
            checked={needText}
        />
    <Form.Check  className="me-3" 
            type="switch"
            id="custom-switch-TTS"
            label={t("Generate images")}
            onChange={(e)=>{setneedImages(e.target.checked)}}
            disabled={genBlocked}
            checked={needImages}
        />
        <Form.Check className="me-3"
            type="switch"
            id="custom-switch-music"
            label={t("Generate music")}
            checked={needMusic}
            onChange={(e)=>{setneedMusic(e.target.checked)}}
            disabled={genBlocked}
        />
    <Form.Check  className="me-3" 
            type="switch"
            id="custom-switch-TTS"
            label={t("Generate TTS male voice")}
            onChange={(e)=>{setneedTTSMale(e.target.checked)}}
            disabled={genBlocked}
            checked={needTTSMale}
        />
    <Form.Check  className="me-3" 
            type="switch"
            id="custom-switch-TTS"
            label={t("Generate TTS female voice")}
            onChange={(e)=>{setneedTTSFemale(e.target.checked)}}
            disabled={genBlocked}
            checked={needTTSFemale}
        />
    <Form.Check  className="me-3" 
            type="switch"
            id="custom-switch-Sora"
            label={t("Generate video using Sora")}
            onChange={(e)=>{setneedSora(e.target.checked)}}
            disabled={genBlocked}
            checked={needSora}
        />
    </InputGroup>

    <MyGeneratorsAccordion videoText={videoText} setvideoText={setvideoText} 
        textLayerArr={textLayerArr} settextLayerArr={settextLayerArr} textSettings={textSettings} settextSettings = {settextSettings}
        videoX={videoX} videoY={videoY} videoDuration={videoDuration}
        musicFile={musicFile} setMusicFile={setMusicFile} musicLayerArr={musicLayerArr} setmusicLayerArr={setmusicLayerArr} musicSettings={musicSettings} setmusicSettings={setmusicSettings}
        speechFile={speechFile} setspeechFile={setspeechFile} speechLayerArr={speechLayerArr} setspeechLayerArr={setspeechLayerArr} speechSettings={speechSettings} setspeechSettings={setspeechSettings}
        imagesArray={imagesArray} setimagesArray={setimagesArray} imageLayerArr={imageLayerArr} setimageLayerArr={setimageLayerArr} imageSettings={imageSettings} setimageSettings={setimageSettings}
        smoothTransition = {smoothTransition} setsmoothTransition = {setsmoothTransition} genBlocked={genBlocked} projectName={projectName}
        textPrompt={textPrompt} setTextPrompt={setTextPrompt} imagesPrompt={imagesPrompt} setImagesPrompt={setImagesPrompt} musicPrompt={musicPrompt} setMusicPrompt={setMusicPrompt}
        baseImage={baseImage} setBaseImage={setBaseImage} soraSettings={soraSettings} setSoraSettings={setSoraSettings} soraFile={soraFile} soraPrompt={soraPrompt} setSoraPrompt={setSoraPrompt}
        soraLayerArr={soraLayerArr} setSoraLayerArr={setSoraLayerArr} setSoraFile={setSoraFile} soraVideoDuration={soraVideoDuration} setSoraVideoDuration={setSoraVideoDuration}
        imageCount={imageCount} setimageCount={setimageCount}
        needMusic={needMusic} setneedMusic={setneedMusic} needTTSMale={needTTSMale} setneedTTSMale={setneedTTSMale}
        needTTSFemale={needTTSFemale} setneedTTSFemale={setneedTTSFemale} needImages={needImages} setneedImages={setneedImages}
        needText={needText} setneedText={setneedText} needSora={needSora} setneedSora={setneedSora}
        />
    <Button className="mb-3 p-2" variant="dark" onClick={generateContent} disabled={genBlocked}>
              {/* {t('Generate content:')} {(props.basePrice + (needImages ? props.imagePrice * imageCount : 0) + (needMusic ? props.musicPrice * videoDuration : 0)).toFixed(2)}$ */}
              {t('Generate content:')} {(
                (needText ? props.basePrice : 0) + 
                (needMusic ? props.basePrice : 0) + 
                ((needTTSFemale || needTTSMale) ? props.basePrice : 0) + 
                (needImages ? props.imagePrice * imageCount + props.basePrice: 0) + 
                (needSora ? props.soraPrice * soraVideoDuration + props.basePrice: 0)
            ).toFixed(2)}$
    </Button>  
    </div>
  );
}

export default MyGeneratorWrapper;