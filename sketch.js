let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/x0S6_4oTu/';

let video;
let flippedVideo;
let label = "";
let scan;
let actualItem = -1;
let labels = ["Hand", "Water Bottle"];
let cooldown = -1;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(document.body.clientWidth, window.innerHeight); 
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  scan = 0;

  flippedVideo = ml5.flipImage(video)
  classifyVideo();
}

function insideRect(x, y, w, h) {
  return mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h;
}

let cooldownOver = true;
function draw() {
  background(50);
  image(flippedVideo, width/2-640/2, height/2-480/2);
  strokeWeight(2);
  // fill(255);
  // textSize(16);
  // textAlign(CENTER);
  // text(label, width / 2, height - 4);

  fill(0, 200, 0);
  if (insideRect(width/2 - 150/2, height/2 + 280, 150, 60)) {
    fill(0, 128, 0);
  }

  noStroke();
  rect (width/2 - 150/2, height/2 + 280, 150, 60);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(50);
  
  text("Scan", width/2, height/2 + 280 + 60/2);

  if (cooldown > 0) {
    cooldown -= 5;
    stroke(255, 0, 0);
    strokeWeight(5);
    let y = 2 * Math.abs(240 - cooldown);
    line (width/2-640/2, height/2+480/2-y, width/2+640/2, height/2+480/2-y);
  } else if (!cooldownOver) {
    cooldownOver = true;
    console.log(actualItem);
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
  if (results[0].confidence >= 0.7) {
    actualItem = labels.indexOf(label.trim());
  } else {
    actualItem = -1;
  }
  classifyVideo();
}

function mouseReleased() {
  if (insideRect(width/2 - 150/2, height/2 + 280, 150, 60)) {
    cooldown = 480;
    cooldownOver = false;
  }
}

function windowResized() {
  resizeCanvas(document.body.clientWidth, window.innerHeight);
}