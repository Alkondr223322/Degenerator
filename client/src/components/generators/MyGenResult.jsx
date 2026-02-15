import React, { useEffect, useRef, useState } from "react";
import etro from "etro";
import { InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import createTextLayer from "../../middleware/createTextLayer";
import createAudioLayerAsync from "../../middleware/createAudioLayerAsync";
import createImageLayerAsync from "../../middleware/createImageLayerAsync";
import createSoraLayerAsync from "../../middleware/createSoraLayerAsync";
import { useTranslation} from "react-i18next";

function MyGenResult(props) {
    const { t } = useTranslation();
    const canvasRef = useRef();
    const movieRef = useRef();
    const [playBlocked, setplayBlocked] = useState(true); 
    const [downloadBlocked, setdownloadBlocked] = useState(true); 

    async function combineMovie(){
        // if(props.imagesArray.length > 10){
        //     alert('You\'ve added more images than a video can handle. Max image count is 10')
        //     return
        // }

        setplayBlocked(true)
        setdownloadBlocked(true)
        const canvas = canvasRef.current;
        let movie = movieRef.current 
        if(movie){
            console.log(movie)
            movie.pause()
        }
        movie = new etro.Movie({ canvas });

        

        // let resText = createTextLayer(props.videoText, props.videoDuration, props.textSettings, props.videoX)
        // console.log(resText)
        // props.settextLayerArr([...resText])
        // console.log(props.textLayerArr)
        // for(let i = 0; i < props.textLayerArr.length; i++){
        //     movie.addLayer(props.textLayerArr[i])
        // }



        console.log(props.speechLayerArr)
        let resSpeech = await createAudioLayerAsync(props.speechFile, props.videoDuration, props.speechSettings, false)
        props.setspeechLayerArr(resSpeech)
        console.log(resSpeech)
        console.log(props.speechLayerArr)
        for(let i = 0; i < resSpeech.length; i++){
            movie.addLayer(resSpeech[i])
        }

        let resMusic = await createAudioLayerAsync(props.musicFile, props.videoDuration, props.musicSettings, true)
        props.setmusicLayerArr(resMusic)
        console.log(resMusic)
        console.log(props.musicLayerArr)
        for(let i = 0; i < resMusic.length; i++){
            movie.addLayer(resMusic[i])
        }

        let resSora = await createSoraLayerAsync(props.soraFile, props.soraSettings)
        props.setSoraLayerArr(resSora)
        console.log(resSora)
        console.log(props.setSoraLayerArr)
        for(let i = 0; i < resSora.length; i++){
            movie.addLayer(resSora[i])
        }

        let resImage = await createImageLayerAsync(props.imagesArray, props.imageSettings, props.smoothTransition)
        props.setimageLayerArr(resImage)
        console.log(resImage)
        console.log(props.imageLayerArr)
        for(let i = 0; i < resImage.length; i++){
            movie.addLayer(resImage[i])
        }
        
        console.log(resSpeech)
        let textDur = props.videoDuration
        let textSpeed = 1
        if(resSpeech.length > 0){
            textSpeed = props.speechSettings.playbackRate
            textDur = resSpeech[0].duration /textSpeed
            
        }
        let resText = createTextLayer(props.videoText, textDur, props.textSettings, props.videoX, textSpeed)
        console.log(resText)
        props.settextLayerArr(resText)
        for(let i = 0; i < resText.length; i++){
            movie.addLayer(resText[i])
        }

        movieRef.current = movie;
        setplayBlocked(false)
        setdownloadBlocked(false)
    }

    function combineMovieSafe(){
        try{
            combineMovie()
        }catch(e){
            alert('An error has occured, check that all media has loaded properly')
            alert(e)
        }
    }

    function playMovie(){
        try{        
        const canvas = canvasRef.current;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const movie = movieRef.current;
        if(movieRef.current){
            console.log(movie)
            movie.stop()
            movie.play()
        }}
        catch(e){
            console.log(e)
        }

    }

    return(
        <div className="d-flex flex-column justify-content-center flex-wrap align-self-center " style={{maxWidth: "75vw", width:"100%"}}>
            <InputGroup className="p-2 d-grid" id="tempID">
                <Button variant="dark" onClick={combineMovieSafe}>{t('Compile a video')}</Button>
            </InputGroup>
            <InputGroup className="p-2 d-grid">
                <Button variant="dark" onClick={playMovie} disabled={playBlocked}>{t('Play')}</Button>
            </InputGroup>
            <InputGroup className="p-2 d-grid">
            <Button className="mb-3" variant="dark" disabled={playBlocked || downloadBlocked} onClick={async () => {
                const movie = movieRef.current;
                if(!movie){return}
                if(movie){movie.stop()}
                setdownloadBlocked(true)
                const blob = await movie.record({
                frameRate: 30, // fps for the recording's video track
                //duration: undefined, // how long to record, in seconds (by default, the movie will record to the end)
                type: 'video/webm;codecs=vp8', // MIME type for the recording (defaults to 'video/webm')
                video: true, // whether to render visual layers (defaults to true)
                audio: true, // whether to render layers with audio (defaults to true)
                });
                console.log(`Done. The recording is ${blob.size} bytes long`);
                //let url = URL.createObjectURL(blob);

                const aElement = document.createElement('a');
                aElement.setAttribute('download', props.projectName);
                const href = URL.createObjectURL(blob);
                aElement.href = href;
                aElement.setAttribute('target', '_blank');
                aElement.click();
                URL.revokeObjectURL(href)
                setdownloadBlocked(false)
                // const result = resultRef.current;
                // result.src = url;
                // result.hidden = false
                // window.location.assign(url);
            }}>{t('Download!')}</Button>
            </InputGroup>
          
            <canvas style={{maxWidth: "75vw"}} width={props.videoX} height={props.videoY} ref={canvasRef}></canvas>
        </div>
    );
}
  
  export default MyGenResult;