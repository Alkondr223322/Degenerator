import axios from "axios";



async function genSpeech(fullPrompt, gender){
    fullPrompt = fullPrompt.trim()
    if(fullPrompt.length === 0){
        return false
    }

    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/gen/genSpeech`, {fullPrompt, gender}, {responseType: 'arraybuffer'})
    .then(async result => {
        console.log(result)
        alert("Speech generation successful")
        //let audioBuff = result.data.message
        //let audioBuff = await result.arrayBuffer(); 
        const audioBuff = result.data;
        console.log(result)
        console.log(audioBuff)
        const ctx = new AudioContext();
        const audioFile = await ctx.decodeAudioData(audioBuff);
        const audiobufferToBlob = require('audiobuffer-to-blob');
        const blob = audiobufferToBlob(audioFile);
        const url = URL.createObjectURL(blob);
        // const new_blob = new Blob( [ result.data ], { type: 'audio/mp3' } )
        // const url = URL.createObjectURL( result.data );
        return url
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

export default genSpeech