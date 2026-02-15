import etro from "etro";
import randomColor from "randomcolor";

// Example function to estimate word duration
function estimateWordDuration(word, syllableDurationInSeconds) {
  // Estimate word length based on characters
  const wordLength = word.length;

  // Estimate duration based on syllables
  const syllableCount = countSyllables(word);
  const durationInSeconds = syllableCount * syllableDurationInSeconds;

  // Adjust for word length
  // let additionalTimeForLength = 0.1 * (wordLength - 5); // Example adjustment factor
  // if(additionalTimeForLength < 0) additionalTimeForLength= 0
  const totalDurationInSeconds = durationInSeconds;

  return totalDurationInSeconds;
}

// Example function to count syllables in a word (you may need a more sophisticated algorithm)
function countSyllables(word) {
  // Simple syllable counting algorithm (not perfect)
  // Counting vowels as a proxy for syllables
  //const vowels = word.match(/[aeiouy]/gi);
  word = word.toLowerCase();                                     //word.downcase!
  if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
    return word.match(/[aeiouy]{1,2}/g) ? word.match(/[aeiouy]{1,2}/g).length : 2;  
}

// Usage example
const syllableDurationInSeconds = 0.22; // Example average duration per syllable

function createTextLayer(description, videoDur, textSettings, videoX, playbackSpeed){
  console.log(description);
  console.log('playbackSpeed ' + playbackSpeed)
  let words = description.split(' ');
  let durationStep = (videoDur - (+textSettings.startTime)) / words.length;
  let startTime = +textSettings.startTime;
  //let fontSize = textSettings.fontSize
  let fontSize = +textSettings.font.split('px')[0]
  let layerArr = [];
  let sentence = "";

  for(let i = 0; i < words.length; i++){
    //console.log((sentence.length + words[i].length) * 50);
    if((sentence.length + words[i].length) * fontSize > (videoX-20) * 1.6){
      sentence = "";
    }
    sentence += words[i] + " ";
    let wDur = estimateWordDuration(words[i], syllableDurationInSeconds);
    if(words[i].slice(-1) === '.' || words[i].slice(-1) === '?' || words[i].slice(-1) === '!'){
      wDur += 0.4
    }
    if(words[i].slice(-1) === ','){
      wDur += 0.05
    }
    wDur = +(wDur / playbackSpeed).toFixed(2)
    const textLayer = new etro.layer.Text({
      startTime: +startTime.toFixed(2),
      duration: wDur,
      text: sentence,
      x: 0, // default: 0
      y: 0, // default: 0
      width: textSettings.width, // default: null (full width)
      height: textSettings.height, // default: null (full height)
      opacity: textSettings.opacity, // default: 1
      // color: textSettings.color, // default: new etro.Color(0, 0, 0, 1)
      color: new etro.Color(textSettings.color.r, textSettings.color.g, textSettings.color.b, textSettings.color.a), // default: new etro.Color(0, 0, 0, 1)
      font: textSettings.font, // default: '10px sans-serif'
      textX: textSettings.textX, // default: 0
      textY: textSettings.textY, // default: 0
      textAlign: textSettings.textAlign, // default: 'left'
      textBaseline: textSettings.textBaseline, // default: 'alphabetic'
      textDirection: textSettings.textDirection, // default: 'ltr'
      textStroke: { // default: null (no stroke)
          // color: textSettings.textStroke.color,
          color: new etro.Color(textSettings.textStroke.color.r, textSettings.textStroke.color.g, textSettings.textStroke.color.b, textSettings.textStroke.color.a),
          thickness: textSettings.textStroke.thickness, // default: 1
      }
    });
    layerArr.push(textLayer)

    startTime += wDur;
  }
    console.log(layerArr)
    return layerArr;
}

export default createTextLayer;