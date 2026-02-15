import etro from "etro";
import createSmoothImageLayer from "./createSmoothImageLayer";

async function createSingleImageLayer(image, imageSettings, isSmooth){
    return new Promise((resolve) => {
        let filet = image.file.type.split('/')[0]
        console.log(filet)
        let img
        if(filet === 'image'){
          img = document.createElement('img')
          img.src = URL.createObjectURL(image.file)
        }else{
          img = document.createElement('video')
          img.src = URL.createObjectURL(image.file)
        }

        
        const timeoutId = setTimeout(() => {
          img.removeEventListener('onload', onLoad);
          console.log('timeout :<')
          resolve(null);
        }, 10000);
    
        async function onLoad() {
          clearTimeout(timeoutId);
          img.removeEventListener('onload', onLoad);
          let res = null
          let iDuration = image.endAt - image.startAt

          if(isSmooth && filet === 'image'){
            res = await createSmoothImageLayer(img, imageSettings, image, iDuration)
            resolve(res);
          }
          else{
            let imageLayer
            if(filet === 'image'){
              imageLayer = new etro.layer.Image({
                startTime: image.startAt,
                duration: iDuration,
                source: img,
                sourceX: 0, // default: 0
                sourceY: 0, // default: 0
                sourceWidth: null, // default: null (full width)
                sourceHeight: null, // default: null (full height)
                x: 0, // default: 0
                y: 0, // default: 0
                width: Math.max(img.naturalWidth, imageSettings.width), // default: null (full width)
                height: Math.max(img.naturalHeight, imageSettings.height), // default: null (full height)
                opacity: imageSettings.opacity, // default: 1
              });
            }else{
              imageLayer = new etro.layer.Video({
                startTime: image.startAt,
                duration: iDuration,
                source: img,
                sourceX: 0, // default: 0
                sourceY: 0, // default: 0
                sourceWidth: null, // default: null (full width)
                sourceHeight: null, // default: null (full height)
                sourceStartTime: 0, // default: 0
                x: 0, // default: 0
                y: 0, // default: 0
                width: Math.max(img.videoWidth, imageSettings.width), // default: null (full width)
                height: Math.max(img.videoHeight, imageSettings.height), // default: null (full height)
                opacity: imageSettings.opacity, // default: 1
                muted: false, // default: false
                volume: image.volume, // default: 1
                playbackRate: 1, // default: 1
              });
            }
            
            let effect
            if(filet === 'image'){
              effect = new etro.effect.Transform({
                matrix: new etro.effect.Transform.Matrix()
                  .scale(imageSettings.width/img.naturalWidth, imageSettings.height/img.naturalHeight),
              })
            }else{
              console.log(imageSettings.width/img.width)
              console.log(img)
              console.log(img.videoWidth)
              console.log(imageSettings.width)
              effect = new etro.effect.Transform({
                matrix: new etro.effect.Transform.Matrix()
                  .scale(imageSettings.width/img.videoWidth, imageSettings.height/img.videoHeight),
              })
            }


            imageLayer.addEffect(effect)
            // resArr.push(imageLayer)
            res = imageLayer
          }
          resolve(res);
        }
    
        img.addEventListener('onload', onLoad);
        const event = new Event("onload");
        if(filet === 'image'){
          img.onload = () => {img.dispatchEvent(event);}
        }else{
          img.oncanplaythrough = () => {img.dispatchEvent(event);}
        }
        
        
      });
}

async function createImageLayerAsync(imageArr, imageSettings, isSmooth){
    let layerArr = []
    let smoothUrls = []
    console.log(imageArr)
    
    // console.log(imageSettings)
    // console.log('?????????????????????????????????????')
    // console.log(imageArr.length)
    for(let i = 0; i < imageArr.length; i++){
        let filet = imageArr[i].file.type.split('/')[0]
        console.log('lessgo')
        let res = await createSingleImageLayer(imageArr[i], imageSettings, isSmooth)
        console.log('RES:')
        console.log(res)
        if(res && !isSmooth){
            layerArr.push(res)
        }else if(res && isSmooth && filet === 'image'){
          smoothUrls.push(res)
        }else if(res && isSmooth && filet === 'video'){
          layerArr.push(res)
        }
    }

    if(isSmooth){
      for(let i = 0; i < smoothUrls.length; i++){

        const vidLayer = new etro.layer.Video({
          startTime: smoothUrls[i].startAt,
          duration: smoothUrls[i].iDuration,
          source: smoothUrls[i].ourl, // also accepts an `HTMLVideoElement`
          sourceX: 0, // default: 0
          sourceY: 0, // default: 0
          sourceWidth: imageSettings.sourceWidth, // default: null (full width)
          sourceHeight: imageSettings.sourceHeight, // default: null (full height)
          sourceStartTime: 0, // default: 0
          x: 0, // default: 0
          y: 0, // default: 0
          width: imageSettings.width, // default: null (full width)
          height: imageSettings.height, // default: null (full height)
          opacity: imageSettings.opacity, // default: 1
          muted: true, // default: false
          volume: 1, // default: 1
          playbackRate: 1, // default: 1
        });
        layerArr.push(vidLayer)
      }

    }

    return layerArr;
}

  export default createImageLayerAsync;