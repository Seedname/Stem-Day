let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/x0S6_4oTu/';

let video;
let flippedVideo;
let label = "";
let scan;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(document.body.clientWidth, window.innerHeight); 
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  scan = 0;

  flippedVideo = ml5.flipImage(video)
  classifyVideo();
}

function draw() {
  background(0);
  image(flippedVideo, width/2-320/2, height/2-240/2);

  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
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
  classifyVideo();
}

function windowResized() {
  resizeCanvas(document.body.clientWidth, window.innerHeight);
}