import etro from "etro";
import randomColor from "randomcolor";

function createImageLayer(imageArr, imageSettings){

  let layerArr = [];
  console.log(imageSettings)
  for(let i = 0; i < imageArr.length; i++){
    let img = document.createElement('img')
    img.src = URL.createObjectURL(imageArr[i].file)
    // img.width = imageSettings.width
    // img.height = imageSettings.height
    console.log(img.width)
    console.log(img.height)
    
    const imageLayer = new etro.layer.Image({
        startTime: imageArr[i].startAt,
        duration: imageArr[i].endAt - imageArr[i].startAt,
        source: img,
        sourceX: 0, // default: 0
        sourceY: 0, // default: 0
        sourceWidth: imageSettings.sourceWidth, // default: null (full width)
        sourceHeight: imageSettings.sourceHeight, // default: null (full height)
        x: 0, // default: 0
        y: 0, // default: 0
        width: imageSettings.width, // default: null (full width)
        height: imageSettings.height, // default: null (full height)
        opacity: imageSettings.opacity, // default: 1
    });

    // const scaleEffect = new etro.effect.Transform({
    //     matrix: new etro.effect.Transform.Matrix()
    //       .scale(608/videoX, 1080/videoY),
    // })
    layerArr.push(imageLayer)
  }
    console.log(layerArr)
    return layerArr;
}

export default createImageLayer;