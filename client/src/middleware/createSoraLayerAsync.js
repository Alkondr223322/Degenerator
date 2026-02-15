import etro from "etro";

async function createSingleImageLayer(soraFile, soraSettings){
    return new Promise((resolve) => {

        let img = document.createElement('video')
        img.src = URL.createObjectURL(soraFile.file)

        const timeoutId = setTimeout(() => {
          img.removeEventListener('onload', onLoad);
          console.log('timeout :<')
          resolve(null);
        }, 10000);
    
        async function onLoad() {
          clearTimeout(timeoutId);
          img.removeEventListener('onload', onLoad);
          let res = null
          let iDuration = soraFile.endAt - soraFile.startAt


          let imageLayer
          imageLayer = new etro.layer.Video({
          startTime: soraFile.startAt,
          duration: iDuration,
          source: img,
          sourceX: 0, // default: 0
          sourceY: 0, // default: 0
          sourceWidth: null, // default: null (full width)
          sourceHeight: null, // default: null (full height)
          sourceStartTime: 0, // default: 0
          x: 0, // default: 0
          y: 0, // default: 0
          width: Math.max(img.videoWidth, soraSettings.width), // default: null (full width)
          height: Math.max(img.videoHeight, soraSettings.height), // default: null (full height)
          opacity: soraSettings.opacity, // default: 1
          muted: false, // default: false
          volume: soraFile.volume, // default: 1
          playbackRate: 1, // default: 1
        });

            // resArr.push(imageLayer)
            res = imageLayer
          
          resolve(res);
        }
    
        img.addEventListener('onload', onLoad);
        const event = new Event("onload");
        img.oncanplaythrough = () => {img.dispatchEvent(event);}
        
      });
}

async function createSoraLayerAsync(soraFile, soraSettings) {
    let layerArr=[]
    for(let i = 0; i < soraFile.length; i++){
        console.log('lessgo')
        let res = await createSingleImageLayer(soraFile[i], soraSettings)
        console.log('RES:')
        console.log(res)
        layerArr.push(res)
    }
    return layerArr;
}

  export default createSoraLayerAsync;