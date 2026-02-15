import etro from "etro";

async function createSmoothImageLayer(img, imageSettings, image, iDuration){
    let smoothFrames = 3;
    let layerArr = []

    for(let i = 0; i < smoothFrames; i++){
        const inLayer = new etro.layer.Image({
          startTime: 0 + (iDuration * (0.1/smoothFrames) * i),
          duration: iDuration * (0.1/smoothFrames),
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

        const effect = new etro.effect.Transform({
          matrix: new etro.effect.Transform.Matrix()
            .scale(imageSettings.width/img.naturalWidth, imageSettings.height/img.naturalHeight),
        })
        const blureffect = new etro.effect.Pixelate({
          pixelSize: (smoothFrames-i) * 20
        })
        inLayer.addEffect(effect)
        inLayer.addEffect(blureffect)
        layerArr.push(inLayer)
      }
      const imageLayer = new etro.layer.Image({
        startTime: iDuration * 0.1,
        duration: iDuration * 0.8,
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
      const effect = new etro.effect.Transform({
        matrix: new etro.effect.Transform.Matrix()
          .scale(imageSettings.width/img.naturalWidth, imageSettings.height/img.naturalHeight),
      })
      imageLayer.addEffect(effect)
      layerArr.push(imageLayer)

      for(let i = 0; i < smoothFrames; i++){
        const outLayer = new etro.layer.Image({
          startTime: iDuration * 0.9 + (iDuration * (0.1/smoothFrames) * i),
          duration: iDuration * (0.1/smoothFrames),
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

        const effect = new etro.effect.Transform({
          matrix: new etro.effect.Transform.Matrix()
            .scale(imageSettings.width/img.naturalWidth, imageSettings.height/img.naturalHeight),
        })
        const blureffect = new etro.effect.Pixelate({
          pixelSize: (1+i) * 20
        })
        outLayer.addEffect(effect)
        outLayer.addEffect(blureffect)
        layerArr.push(outLayer)
      }
    let canvas = document.createElement('canvas')
    canvas.width = imageSettings.width
    canvas.height = imageSettings.height
    let movie = new etro.Movie({ canvas });

    //   let tmp = document.getElementById('tempID')
    //   tmp.appendChild(canvas)
    //   movie.play()

    for(let i = 0; i < layerArr.length; i++){
        movie.addLayer(layerArr[i])
    }

    const blob = await movie.record({
        frameRate: 30, // fps for the recording's video track
        type: 'video/webm;codecs=vp8', // MIME type for the recording (defaults to 'video/webm')
        video: true, // whether to render visual layers (defaults to true)
        audio: false, // whether to render layers with audio (defaults to true)
      });
      console.log(`Done. The recording is ${blob.size} bytes long`);
    let obj = {ourl: URL.createObjectURL(blob), startAt: image.startAt, iDuration: iDuration}

    // const aElement = document.createElement('a');
    // aElement.setAttribute('download', 'Degenproject');
    // const href = URL.createObjectURL(blob);
    // aElement.href = href;
    // aElement.setAttribute('target', '_blank');
    // aElement.click();
    // URL.revokeObjectURL(href)

    return obj
}

export default createSmoothImageLayer;