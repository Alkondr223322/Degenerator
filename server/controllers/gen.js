const OpenAI = require('openai');
const fs = require('fs');
const { error } = require('console');

// Text generation
const genText = async (req, res, next) => {
    const { fullPrompt } = req.body; // get generation prompt from request body
        
    console.log(fullPrompt);

    const openai = new OpenAI({
        apiKey: process.env.GPT_KEY, 
        dangerouslyAllowBrowser: true
      }); // create openAI client

    try{
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
               {"role": "system", "content": 'You are writing texts for short-form videos with a single narrator telling an interesting fact on the requested topic, the text mustn\'t be longer than 4 sentences long, and your responses should contain only what the narrator says`);'},
              {"role": "user", "content": fullPrompt}
          ],
          }); // request and await text generation from chatPGT
          console.log(chatCompletion.choices[0].message.content);
        res.json({ message: chatCompletion.choices[0].message.content }); // respond to client with result
    }catch{
        next(error); // if error: send error response
    }
  };
  // Image generation
  const genImage = async (req, res, next) => {
    const { fullPrompt, imageCount } = req.body; // get generation prompt from request body and how many images to generate
    const openai = new OpenAI({
      apiKey: process.env.GPT_KEY, 
      dangerouslyAllowBrowser: true
    }); // create openAI client


    try{

      const imgresponse = await openai.images.generate({
        model: "dall-e-2",
        prompt: fullPrompt,
        size: "1024x1024",
        n: Number.parseInt(imageCount),
        response_format: 'b64_json'
      })  // request and await image generation from dalle-e 2

      console.log(imgresponse)
      console.log(imgresponse.ok)
      res.json({ base64Arr: imgresponse.data }) // respond to client with result
  }catch(e){
      //console.log(error)
      next(e); // if error: send error response
  }
  }
  // Music generatiom
  const genMusic = async (req, res, next) => {
    const { fullPrompt } = req.body; // get generation prompt from request body
    // console.log(req.body)
    
    console.log(fullPrompt);

    const openai = new OpenAI({
        apiKey: process.env.GPT_KEY, 
        dangerouslyAllowBrowser: true
      }); // create openAI client

    try{
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
               {"role": "system", "content": 'You create music tracks that consist of bass, melody, and ambient, and represent each part of the music track as js string, each string contains notes and their duration in the following format: note; duration, . Don\'t write any text or opening statements, just the code. Represent duration and notes in Tone.js format. Don\'t use semitones.'},
              {"role": "user", "content": fullPrompt}
          ],
          }); // request and await note generation from chatPGT
          console.log(chatCompletion.choices[0].message.content);
        res.json({ message: chatCompletion.choices[0].message.content }); // respond to client with result
    }catch{
        next(error); // if error: send error response
    }
  }
  // Speech generation
  const genSpeech = async (req, res, next) => {
    const { fullPrompt, gender} = req.body;  // get generation prompt and chosen voice from request body
    // console.log(req.body)
    
    console.log(fullPrompt);
    let voiceName;
    if(gender == 'Male'){ 
        voiceName = 'en-US-ChristopherNeural'
    }else{
        voiceName = 'en-US-JennyNeural'
    } // pick specific voice based on the choice in the request

    const requestOptions = {
        method: 'POST',
        headers: { 
          'Ocp-Apim-Subscription-Key': process.env.TTS_KEY, 
          //'Authorization': ('Bearer ' + token),
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-64kbitrate-mono-mp3',
          'User-Agent': 'degenerator'
        },
        body: `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='${gender}' name='${voiceName}'>` + fullPrompt + "</voice></speak>"
    }; // Prepare request to azure microsoft TTS

    try{
        const speechRes = await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', requestOptions) // request and await speech generation from TTS
        console.log(speechRes)

        let arrayBuffer = await speechRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer); // turn result into a buffer

        // Send the Buffer as response with appropriate content type
        res.set('Content-Type', 'application/octet-stream'); // Set appropriate content type
        res.send(buffer); 

    }catch(e){
        //console.log(error)
        next(e); // if error: send error response
    }
    
  }
  // Video generation polling helper
  async function checkVideoStatus(videoId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `${process.env.SORA_KEY}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }; // Prepare request to Sora API 

    vidStatus = await fetch(`https://api.cometapi.com/v1/videos/${videoId}`, requestOptions) // request and await video generation status
    vidStatusJSON = await vidStatus.json() // turn response into JSON
    return vidStatusJSON; // return JSON result
}
// Video generation result getter
async function getVideoContent(videoId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `${process.env.SORA_KEY}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }; // Prepare request to Sora API

    vidResult = await fetch(`https://api.cometapi.com/v1/videos/${videoId}/content`, requestOptions)  // request and await video generation result
    const buffer = await vidResult.arrayBuffer();
    return Buffer.from(buffer); // turn response into a buffer and return it
}

  const genVideo = async (req, res, next) => {
    const { fullPrompt, duration, resolution } = req.body; // get generation prompt and chosen video duration and resolution from request body
    const baseImage = req.file; // get base image (if any)

    console.log("Prompt:", fullPrompt);
    console.log("Duration:", duration);
    console.log("Resolution:", resolution);
    if(baseImage){
      console.log(req.file)
      console.log("Uploaded file:", baseImage.originalname, baseImage.mimetype, baseImage.size);
    }
    try{
    if (Number.isNaN(Number.parseFloat(duration))) {
      throw new Error("Invalid duration: must be a number");
    } 
    if (Number.parseFloat(duration) >= 30 || Number.parseFloat(duration) < 1){
      throw new Error("Invalid duration: must be a reasonable number");
    } // validate video parameters
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `${process.env.SORA_KEY}`);
    var formdata = new FormData();
    if (baseImage){
       const blob = new Blob([baseImage.buffer], { type: baseImage.mimetype });
      formdata.append("input_reference", blob, baseImage.originalname);
    }
    formdata.append("prompt", `Generate a video based on this prompt: ${fullPrompt}`);
    formdata.append("model", "sora-2");
    formdata.append("seconds", `${duration}`);
    formdata.append("size", `${resolution}`);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    }; // Prepare request to Sora API 


    const response = await fetch("https://api.cometapi.com/v1/videos", requestOptions); // request and await beginning video generation   
    if (!response.ok) {
      // Throw if response status is not OK
      console.log(response)
      errjson = await response.json()
      console.log(errjson)
      throw new Error(`Comet API returned status ${response.status}`);
    } // catch errors
    const result = await response.json(); // transform response into JSON
    console.log(result)
    const videoID = result.id // get video ID from response

    // Poll until done
    let statusResp;
    while (true) {
      statusResp = await checkVideoStatus(videoID);
      console.log(statusResp)
      if (statusResp.data.status === "SUCCESS") {
        break;
      }
      if (statusResp.data.status === "FAILED") {
        throw new Error("Video generation failed: " + JSON.stringify(statusResp));
      }

      // wait some time before polling again
      await new Promise((r) => setTimeout(r, 2000));
    }

    // retrieve the video
    const contentResp = await getVideoContent(videoID); 
    console.log(contentResp)
    res.json({ base64Vid: contentResp }) // respond to client with result

  }catch(e){
      //console.log(error)
      next(e); // if error: send error response
  }
  }

module.exports = { genText, genImage, genMusic, genSpeech, genVideo};