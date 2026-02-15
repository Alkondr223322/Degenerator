import axios from "axios";

async function genText(topic, prompt){
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
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/gen/genText`, {fullPrompt})
    .then(result => {
        console.log(result)
        alert("Text generation successful")
        let msg = result.data.message.substring(1, result.data.message.length-1);

        return msg
    })
    .catch(err => {
        console.log(err)
        let str = err.message
        if(err.response.data && err.response.data.message){
            str+='\n' + err.response.data.message
        }
        alert(str)
        return false
    })

    return res
}

export default genText