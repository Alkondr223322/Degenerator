import * as Tone from "tone";
import getSynth from "./getSynth";

async function composeMusic(bassIns, melodyIns, chordsIns, bassArr, melodyArr, chordsArr){
    try {
        console.log(melodyArr)
        if(bassArr.length === 0 || melodyArr.length === 0 || chordsArr.length === 0){
            throw new Error()
        }
        // Combine arrays into a sequence
        const recorder = new Tone.Recorder();
        const synthBass = await getSynth(bassIns)
        const synthMelody = await getSynth(melodyIns)
        const synthChords = await getSynth(chordsIns)
        console.log(synthBass)
        synthBass.connect(recorder)
        synthMelody.connect(recorder)
        synthChords.connect(recorder)
        // const synth = new Tone.PolySynth(Tone.MembraneSynth, {
        //     maxPolyphony: 10,
        //     volume: 0.01
        //   }).connect(recorder);
        
        recorder.start();
        let musicDur = 0;
        let melodyDur = 0
        let bassDur = 0
        let ambientDur = 0
        for(let i = 0; i < melodyArr.length; i++){
            let divided = melodyArr[i].split(';')
            melodyDur += Tone.Time(divided[1].trim()).toSeconds();
        }
        for(let i = 0; i < bassArr.length; i++){
            let divided = bassArr[i].split(';')
            bassDur += Tone.Time(divided[1].trim()).toSeconds();
        }
        for(let i = 0; i < chordsArr.length; i++){
            let divided = chordsArr[i].split(';')
            ambientDur += Tone.Time(divided[1].trim()).toSeconds();
        }
        musicDur = Math.max(melodyDur, bassDur, ambientDur)

        const bassPart = new Tone.Sequence((time, note) => {
            //console.log(note)
            let divided = note.split(';')
            //console.log(divided)
            // console.log('____________________________')
            // console.log(note)
            // console.log(divided)
            // console.log(divided[0].trim())
            // console.log(divided[1].trim())
            // console.log('____________________________')
            synthBass.triggerAttackRelease(divided[0].trim(), divided[1].trim(), time);

        }, bassArr).start(0);
        
        const melodyPart = new Tone.Sequence((time, note) => {
            //console.log(note)
            let divided = note.split(';')
            //console.log(divided)
            // console.log('____________________________')
            // console.log(note)
            // console.log(divided)
            // console.log(divided[0].trim())
            // console.log(divided[1].trim())
            // console.log('____________________________')
            synthMelody.triggerAttackRelease(divided[0].trim(), divided[1].trim(), time);

        }, melodyArr ).start(0);
        
        const chordsPart2 = new Tone.Sequence((time, note) => {
            //console.log(note)
            let divided = note.split(';')
            //console.log(divided)
            // console.log('____________________________')
            // console.log(note)
            // console.log(divided)
            // console.log(divided[0].trim())
            // console.log(divided[1].trim())
            // console.log('____________________________')
            synthChords.triggerAttackRelease(divided[0].trim(), divided[1].trim(), time);

        }, chordsArr).start(0);
        
        
        // Start recording
        Tone.Transport.start();
        console.log(musicDur)
        await new Promise(r => setTimeout(r, musicDur*1000));
        Tone.Transport.stop();
        const recording = await recorder.stop();
        console.log(recording)
        return URL.createObjectURL(recording)
    } catch (error) {
        console.log(error)
        return undefined
    }
  
}

export default composeMusic;