import axios from "axios";



async function genImages(topic, prompt, imageCount, videoDuration){
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

    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/gen/genImage`, {fullPrompt, imageCount})
    .then(async result => {
        console.log(result)
        alert("Image generation successful")
        //let audioBuff = result.data.message
        //let audioBuff = await result.arrayBuffer(); 
        const base64Arr = result.data.base64Arr;
        let objUrlArr = []
        for(let i = 0; i < base64Arr.length; i++){
            let b64 = base64Arr[i].b64_json
            console.log(b64)
            // let getURes = await fetch(u)
            // let blob = await getURes.blob()
            //let file = new File([blob], 'image', {type: blob.type})
           // var arr = b64.split(',')
            //let mime = arr[0].match(/:(.*?);/)[1]
            let bstr = atob(b64) 
            let n = bstr.length 
            let u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            let file = new File([u8arr], 'image', {type:'image/jpeg'})

            
            objUrlArr.push({file: file, startAt: 0, endAt: videoDuration, index: Date.now()})
        }


        console.log(result)
        console.log(objUrlArr)
        
        return objUrlArr;
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

export default genImages