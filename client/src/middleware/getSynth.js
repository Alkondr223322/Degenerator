import * as Tone from "tone";
import b64toBlob from "./b64toBlob";

async function getSynth(insArg){
    let ins = insArg.split(' ')
    switch(ins[0]){
        case 'Synth': return new Tone.Synth()
        case 'Membrane': return new Tone.MembraneSynth()
        case 'Casio': {
            return new Promise((resolve, reject) => {
                const sampler = new Tone.Sampler({
                    urls: {
                        A1: "A1.mp3",
                        A2: "A2.mp3",
                    },
                    baseUrl: "https://tonejs.github.io/audio/casio/",
                    onload: () => {
                        //console.log(sampler)
                        resolve(sampler)
                    }
                });
              })

             }
             case 'Custom': {
                return new Promise((resolve, reject) => {
                    const sampler = new Tone.Sampler({
                        urls: {
                            A1: URL.createObjectURL(b64toBlob(ins[1])),
                        },
                        onload: () => {
                            //console.log(sampler)
                            resolve(sampler)
                        }
                    });
                  })
    
                 }
        default: return new Tone.Synth()
    }

}

export default getSynth;