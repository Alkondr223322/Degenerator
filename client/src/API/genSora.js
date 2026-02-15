import axios from "axios";
import { Volume } from "tone";

async function genSora(topic, prompt, baseImage, videoDuration, videoResolution){
    topic = topic.trim()
    prompt = prompt.trim()
    if(topic.length === 0 || prompt.length === 0){
        alert("All fields must be filled out")
        return false
    }
    if(!prompt.includes("[topic]")){
        alert('Generation prompt must include "[topic]" in itself')
        return false
    }
    let fullPrompt = prompt.replace('[topic]', topic)
    

    //let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/gen/genVideo`, {fullPrompt, baseImage: baseImageArg, duration: videoDuration, resolution: videoResolution})
    const formData = new FormData();

    // append text fields
    formData.append("fullPrompt", fullPrompt);
    formData.append("duration", videoDuration);
    formData.append("resolution", videoResolution);

    // append your File() object
    let baseImageArg
    if (baseImage.length === 0){
        baseImageArg = null
    }else{
        baseImageArg = baseImage[0].file
    }
    formData.append("baseImage", baseImageArg);
    console.log(baseImageArg)
    const res = await axios.post(
      `http://${process.env.REACT_APP_SERVER_PATH}/gen/genVideo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'Cache-Control': 'no-cache',
        },
      }
    ).then(async result => {
        console.log(result)
        alert("Sora video generation successful")
        //let audioBuff = result.data.message
        //let audioBuff = await result.arrayBuffer(); 
        
        const base64Vid = result.data.base64Vid;
        const byteArray = new Uint8Array(base64Vid.data);
        const blob = new Blob([byteArray], { type: "video/mp4" });
        var file = new File([blob], "Sora Result", {lastModified: Date.now(), type: blob.type});
        //const url = URL.createObjectURL(blob);
        let soraResultObj = {file: file, startAt: 0, endAt: videoDuration, volume: 1}
        console.log(soraResultObj)
        return soraResultObj;
    })
    .catch(err => {
        console.log(err)
        let str = err.message
        if(err.response && err.response.data && err.response.data.message){
            str+='\n' + err.response.data.message
        }
        alert(str)
        return false
    })

    return res
}

export default genSora