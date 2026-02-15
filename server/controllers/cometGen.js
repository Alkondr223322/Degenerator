const OpenAI = require('openai');
const fs = require('fs');
const { error } = require('console');

// gen text
const genText = async (req, res, next) => {
    const { fullPrompt } = req.body;
    // console.log(req.body)
    
    console.log(fullPrompt);

    const openai = new OpenAI({
        apiKey: process.env.GPT_KEY, // This is also the default, can be omitted
        dangerouslyAllowBrowser: true
      });

    try{
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
               {"role": "system", "content": 'You are writing texts for short-form videos with a single narrator telling an interesting fact on the requested topic, the text mustn\'t be longer than 4 sentences long, and your responses should contain only what the narrator says`);'},
              {"role": "user", "content": fullPrompt}
          ],
          });
          console.log(chatCompletion.choices[0].message.content);
        res.json({ message: chatCompletion.choices[0].message.content });
    }catch{
        next(error);
    }
  };

  const genImage = async (req, res, next) => {
    const { fullPrompt, imageCount } = req.body;
    const openai = new OpenAI({
      apiKey: process.env.GPT_KEY, // This is also the default, can be omitted
      dangerouslyAllowBrowser: true
    });


    try{

      const imgresponse = await openai.images.generate({
        model: "dall-e-2",
        prompt: fullPrompt,
        size: "1024x1024",
        quality: "standard",
        n: Number.parseInt(imageCount),
        response_format: 'b64_json'
      })

      console.log(imgresponse)
      console.log(imgresponse.ok)
      res.json({ base64Arr: imgresponse.data })
  }catch(e){
      //console.log(error)
      next(e);
  }
  }

  const genMusic = async (req, res, next) => {
    const { fullPrompt } = req.body;
    // console.log(req.body)
    
    console.log(fullPrompt);

    const openai = new OpenAI({
        apiKey: process.env.GPT_KEY, // This is also the default, can be omitted
        dangerouslyAllowBrowser: true
      });

    try{
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
               {"role": "system", "content": 'You create music tracks that consist of bass, melody, and ambient, and represent each part of the music track as js string, each string contains notes and their duration in the following format: note; duration, . Don\'t write any text or opening statements, just the code. Represent duration and notes in Tone.js format. Don\'t use semitones.'},
              {"role": "user", "content": fullPrompt}
          ],
          });
          console.log(chatCompletion.choices[0].message.content);
        res.json({ message: chatCompletion.choices[0].message.content });
    }catch{
        next(error);
    }
  }

  const genSpeech = async (req, res, next) => {
    const { fullPrompt, gender} = req.body;
    // console.log(req.body)
    
    console.log(fullPrompt);
    let voiceName;
    if(gender == 'Male'){
        voiceName = 'en-US-ChristopherNeural'
    }else{
        voiceName = 'en-US-JennyNeural'
    }

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
    };

    try{
        const speechRes = await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', requestOptions)
        console.log(speechRes)

        let arrayBuffer = await speechRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Send the Buffer as response with appropriate content type
        res.set('Content-Type', 'application/octet-stream'); // Set appropriate content type
        res.send(buffer);

    }catch(e){
        //console.log(error)
        next(e);
    }
    
  }

  async function checkVideoStatus(videoId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `${process.env.SORA_KEY}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    vidStatus = await fetch(`https://api.cometapi.com/v1/videos/${videoId}`, requestOptions)
    vidStatusJSON = await vidStatus.json()
    return vidStatusJSON;
}

async function getVideoContent(videoId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `${process.env.SORA_KEY}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    vidResult = await fetch(`https://api.cometapi.com/v1/videos/${videoId}/content`, requestOptions)
    // const contentType = vidResult.headers.get("content-type");
    // console.log(contentType)
    const buffer = await vidResult.arrayBuffer();
    return Buffer.from(buffer); // Node.js Buffer, if you want to save/send file
    //return vidResult.data
}

  const genVideo = async (req, res, next) => {
    //const { fullPrompt, baseImage, duration, resolution } = req.body;
    const { fullPrompt, duration, resolution } = req.body;
    const baseImage = req.file; // this is your uploaded File()

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
    }
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
    };


    const response = await fetch("https://api.cometapi.com/v1/videos", requestOptions);
    if (!response.ok) {
      // Throw if response status is not OK
      console.log(response)
      errjson = await response.json()
      console.log(errjson)
      throw new Error(`Comet API returned status ${response.status}`);
    }
    const result = await response.json(); // or .text() depending on API
    console.log(result)
    const videoID = result.id
    //const videoID = 'video_68f7ca22ea408198bff8df44a0f3e999068fdab3f64bf395'
    // Poll until done
    let statusResp;
    while (true) {
      console.log('checkign status')
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

    // Now retrieve the video
    console.log('HEEEEELYEAH')
    const contentResp = await getVideoContent(videoID);
    // contentResp may include a URL, or the binary, depending on API
    console.log(contentResp)
    res.json({ base64Vid: contentResp })

  }catch(e){
      //console.log(error)
      next(e);
  }
  }

module.exports = { genText, genImage, genMusic, genSpeech, genVideo};