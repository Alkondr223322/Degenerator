import etro from "etro";

async function createAudioLayerAsync(audioFile, videoDur, audioSettings, isLooped){
    return new Promise((resolve) => {

        if(audioFile === ''){
            resolve([])
        }

        const audio = document.createElement('audio');
        audio.src = audioFile;
        audio.loop = isLooped
        
        const timeoutId = setTimeout(() => {
          audio.removeEventListener('canplaythrough', onLoad);
          //console.log('timeout :<')
          resolve([]);
        }, 10000);
    
        function onLoad() {
          clearTimeout(timeoutId);
          audio.removeEventListener('canplaythrough', onLoad);
          let layerArr = []
          const audiolayer = new etro.layer.Audio({
            startTime: audioSettings.startTime,
            duration: videoDur * audioSettings.playbackRate,
            source: audio,
            sourceStartTime: 0, // default: 0
            muted: false, // default: false
            volume: audioSettings.volume, // default: 1
            playbackRate: audioSettings.playbackRate, // default: 1
          });
    
          layerArr.push(audiolayer)

          resolve(layerArr);
        }
    
        audio.addEventListener('canplaythrough', onLoad);
        
      });
}

  export default createAudioLayerAsync;