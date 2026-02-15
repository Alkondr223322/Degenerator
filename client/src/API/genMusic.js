import axios from "axios";
import * as Tone from "tone";


async function genMusic(topic, prompt){
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
    let res = await axios.post(`http://${process.env.REACT_APP_SERVER_PATH}/gen/genMusic`, {fullPrompt})
    .then(async result => {
        console.log(result)
        alert("Music generation successful")
        let msg = result.data.message
        console.log(msg)
        let objs = msg.split('\n')
        let breakpoint = /const .+ =/
        //console.log(objs)
        let bass = objs[0].split(breakpoint)[1].split('"')[1].split(',')
        let melody = objs[1].split(breakpoint)[1].split('"')[1].split(',')
        let chords2 = objs[2].split(breakpoint)[1].split('"')[1].split(',')
        bass.pop()
        melody.pop()
        chords2.pop()

        console.log(bass)
        console.log(melody)
        console.log(chords2)

        return [bass, melody, chords2]
        
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
    // try{



    //     let res = '[["C4", "4n"],["D4", "4n"],["E4", "4n"],["C4", "4n"],["G4", "4n"],["G4", "4n"],["E4", "2n"],["C4", "4n"],["D4", "4n"],["E4", "4n"],["C4", "4n"],["G4", "4n"],["G4", "4n"],["E4", "2n"],["C4", "4n"],["C4", "4n"],["D4", "4n"],["D4", "4n"],["E4", "4n"],["E4", "4n"],["C4", "2n"],["G4", "4n"],["G4", "4n"],["F4", "4n"],["F4", "4n"],["E4", "4n"],["E4", "4n"],["D4", "2n"]]'
        
    //     const bass = [
    //         ['"C2", "1m"'],
    //         ['"C2", "1m"'],
    //         ['"F2", "1m"'],
    //         ['"F2", "1m"'],
    //         ['"G2", "1m"'],
    //         ['"G2", "1m"'],
    //         ['"F2", "1m"'],
    //         ['"F2", "1m"']
    //       ];
          
    //       // Melody track
    //       const melody = [
    //         ['"E4", "4n"'],
    //         ['"G4", "4n"'],
    //         ['"A4", "4n"'],
    //         ['"G4", "4n"'],
    //         ['"E4", "4n"'],
    //         ['"D4", "4n"'],
    //         ['"C4", "2n"']
    //       ];
          
    //       // Chords track
    //       const chords = [
    //         ['"C4", "2m"'],
    //         ['"F4", "2m"'],
    //         ['"G4", "2m"'],
    //         ['"F4", "2m"']
    //       ];


    //     // Combine arrays into a sequence
    //     const recorder = new Tone.Recorder();
    //     const synth = new Tone.PolySynth(Tone.MembraneSynth, {
    //         maxPolyphony: 10,
    //         volume: 0.01
    //       }).connect(recorder);
    //       synth.set({ detune: -500 });
    //     recorder.start();
    //     let musicDur = 0;
    //     for(let i = 0; i < melody.length; i++){
    //         console.log(melody[i][0].slice(1, -1))
    //         let divided = melody[i][0].slice(1, -1).split('", "')
    //         musicDur += Tone.Time(divided[1]).toSeconds();
    //     }

    //     const bassPart = new Tone.Sequence((time, note) => {
    //         //console.log(note)
    //         let divided = note.slice(1, -1).split('", "')
    //         //console.log(divided)
    //         synth.triggerAttackRelease(divided[0], divided[1], time);

    //     }, bass).start(0);
        
    //     const melodyPart = new Tone.Sequence((time, note) => {
    //         //console.log(note)
    //         let divided = note.slice(1, -1).split('", "')
    //         //console.log(divided)
    //         synth.triggerAttackRelease(divided[0], divided[1], time);

    //     }, melody ).start(0);
        
    //     const chordsPart = new Tone.Sequence((time, note) => {
    //         //console.log(note)
    //         let divided = note.slice(1, -1).split('", "')
    //         synth.triggerAttackRelease(divided[0], divided[1], time);
            
    //     }, chords ).start(0);
        
        
    //     // Start recording
    //     Tone.Transport.start();
    //     console.log(musicDur)
    //     await new Promise(r => setTimeout(r, musicDur*1000));
    //     Tone.Transport.stop();
    //     const recording = await recorder.stop();
    //     console.log(recording)
    //     return URL.createObjectURL(recording)
        
        
    // }catch(e){
    //     console.log(e)
    //     return null
    // }
    // wait for the notes to end and stop the recording

    // let res = await axios.post('http://localhost:3000/gen/genMusic', {fullPrompt})
    // .then(async result => {
    //     console.log(result)
    //     alert("Music generation successful")
    //     //let audioBuff = result.data.message
    //     //let audioBuff = await result.arrayBuffer(); 
    //     const audioBuff = result.data;
    //     console.log(result)
    //     console.log(audioBuff)
    //     const ctx = new AudioContext();
    //     const audioFile = await ctx.decodeAudioData(audioBuff);
    //     const audiobufferToBlob = require('audiobuffer-to-blob');
    //     const blob = audiobufferToBlob(audioFile);
    //     const url = URL.createObjectURL(blob);
    //     // const new_blob = new Blob( [ result.data ], { type: 'audio/mp3' } )
    //     // const url = URL.createObjectURL( result.data );
    //     return url
    // })
    // .catch(err => {
    //     console.log(err)
    //     let str = err.message
    //     if(err.response && err.response.data && err.response.data.message){
    //         str+='\n' + err.response.data.message
    //     }
    //     alert(str)
    //     return false
    // })

    //return res
}

export default genMusic