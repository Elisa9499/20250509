// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleSize = 100; // 圓的寬高
let leftHand = { keypoints: [] }; // 左手的 keypoints
let rightHand = { keypoints: [] }; // 右手的 keypoints

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  circleX = width / 2; // 圓的初始 X 座標
  circleY = height / 2; // 圓的初始 Y 座標

  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // 模擬 keypoints 資料（測試用）
  for (let i = 0; i < 21; i++) {
    leftHand.keypoints.push({ x: random(width), y: random(height) });
    rightHand.keypoints.push({ x: random(width), y: random(height) });
  }
}

function drawHand(hand) {
  // 繪製手的 keypoints 和連線
  stroke(0);
  for (let i = 0; i < hand.keypoints.length; i++) {
    fill(0, 0, 255);
    ellipse(hand.keypoints[i].x, hand.keypoints[i].y, 10); // 繪製 keypoints 圓點
  }

  // 繪製手指的線條
  for (let i = 0; i < 4; i++) {
    line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
  }
  for (let i = 5; i < 8; i++) {
    line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
  }
  for (let i = 9; i < 12; i++) {
    line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
  }
  for (let i = 13; i < 16; i++) {
    line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
  }
  for (let i = 17; i < 20; i++) {
    line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
  }
}

function checkFingerTouch(hand) {
  // 檢查食指 (keypoints[8]) 是否碰觸圓
  let fingerX = hand.keypoints[8].x;
  let fingerY = hand.keypoints[8].y;

  let distanceToCircle = dist(fingerX, fingerY, circleX, circleY);
  if (distanceToCircle < circleSize / 2) {
    // 如果碰觸，讓圓跟隨食指移動
    circleX = fingerX;
    circleY = fingerY;
  }
}

function draw() {
  background(255);
  image(video, 0, 0);

  // 繪製圓
  fill(200, 0, 0);
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // 繪製左右手的 keypoints 和連線
  drawHand(leftHand);
  drawHand(rightHand);

  // 檢查左右手的食指是否碰觸圓
  checkFingerTouch(leftHand);
  checkFingerTouch(rightHand);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Draw hand connections
        drawHand(hand);

        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }
      }
    }
  }
}

