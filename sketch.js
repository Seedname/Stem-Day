let classifier;
// let imageModelURL = 'https://teachablemachine.withgoogle.com/models/x0S6_4oTu/';
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/LADuNsu3V/';

let video;
let flippedVideo;
let label = "";
let scan;
let actualItem = -1;
let labels = ["Human Face", "Robot"];
let cooldown = -1;
let doorImage;
let cooldown2 = -1;
let itemAtTime = -1;

let granted, denied;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  granted = loadSound('granted.mp3');
  denied = loadSound('denied.mp3');
}

function setup() {
  createCanvas(document.body.clientWidth, window.innerHeight); 
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  scan = 0;

  flippedVideo = ml5.flipImage(video);
  doorImage = loadImage("door.jpg");
  classifyVideo();
}

function insideRect(x, y, w, h) {
  return mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h;
}

let scaleFactor;
let cooldownOver = true;
function draw() {
  background(50);
  let scaleFactorX = width/2560;
  let scaleFactorY = height/762;
  scaleFactor = scaleFactorX;
  // if (height > width) {
  //   scaleFactor = scaleFactorY;
  // }
  let newWidth = 6.2*doorImage.width * scaleFactor;
  let newHeight = 6.2*doorImage.height * scaleFactor;
  image(doorImage, -newWidth/2-0.197*newHeight, -newHeight/2+0.08*newHeight, newWidth, newHeight);

  // fill(0, 200, 0);
  // if (insideRect(width/2 - 150/2, height/2 + 280, 150, 60)) {
  //   fill(0, 128, 0);
  // }

  // noStroke();
  // rect (width/2 - 150/2, height/2 + 280, 150, 60);
  // fill(0);
  // textAlign(CENTER, CENTER);
  // textSize(50);

  image(flippedVideo, width/2-0.8*scaleFactor*640/2, height/2-0.8*scaleFactorY*480/2, 0.8*640*scaleFactor, 0.8*480*scaleFactor);
  // fill(255);
  // if (insideRect(width/2+1.075*scaleFactor*640/2, height/2-0.8*scaleFactorY*480/2, 120*scaleFactor, 580*scaleFactor)) {
  //   fill(200);
  // }
  // rect(width/2+1.075*scaleFactor*640/2, height/2-0.8*scaleFactorY*480/2, 120*scaleFactor, 580*scaleFactor);
  strokeWeight(2);
  // fill(255);
  // textSize(16);
  // textAlign(CENTER);
  // text(label, width / 2, height - 4);

  
  // text("Scan", width/2, height/2 + 280 + 60/2);

  if (cooldown > 0) {
    cooldown -= 8 * scaleFactor;
    stroke(255, 0, 0);
    strokeWeight(5);
    let [x, y1, w, h] = [width/2-0.8*scaleFactor*640/2, height/2-0.8*scaleFactorY*480/2, 0.8*640*scaleFactor, 0.8*480*scaleFactor];
    
    let y = 2 * Math.abs(h/2- cooldown);
    // line (width/2-640/2, height/2+480/2-y, width/2+640/2, height/2+480/2-y);
    line (x, y1+y, x+w, y1+y);
  } else if (!cooldownOver) {
    cooldownOver = true;
    cooldown2 = 120;
    itemAtTime = actualItem;
    if (itemAtTime === 0) {
      granted.play();
    } else if (itemAtTime === 1) {
      denied.play();
    }
  } 

  if (cooldown2 > 0) {
    cooldown2 -= 1;
    textAlign(CENTER);
    textSize(25);
    noStroke();

    let [x, y] = [width/2-0.8*scaleFactor*640/2+0.4*640*scaleFactor, height/2-0.8*scaleFactorY*480/2+0.8*640*scaleFactor];
    if (itemAtTime === 0) {
      fill (0, 255, 0);
      text ("Access Granted", x, y);
    } else if (itemAtTime == 1) {
      fill (255, 0, 0);
      text ("Access Denied", x, y);
    } else {
      fill (255, 255, 0)
      text ("Please Try Again", x, y);
    }
  }

  if (mouseIsPressed && insideRect(width/2+1.075*scaleFactor*640/2, height/2-0.8*scaleFactorY*480/2, 120*scaleFactor, 580*scaleFactor)) {
    cooldown = 0.8*480*scaleFactor;
    cooldownOver = false;
  }

}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  if (results[0].confidence >= 0.8) {
    actualItem = labels.indexOf(label.trim());
  } else {
    actualItem = -1;
  }
  classifyVideo();
}

// function mouseReleased() {
//   if (insideRect(width/2+1.075*scaleFactor*640/2, height/2-0.8*scaleFactorY*480/2, 120*scaleFactor, 580*scaleFactor)) {
//     cooldown = 0.8*480*scaleFactor;
//     cooldownOver = false;
//   }
// }

function windowResized() {
  resizeCanvas(document.body.clientWidth, window.innerHeight);
}