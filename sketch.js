// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleSize = 100; // 圓的寬高
let hand = { keypoints: [] }; // 單手的 keypoints
let isDragging = false; // 是否正在拖動圓
let previousX, previousY; // 圓的前一個位置

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
  createCanvas(640, 480); // 設定畫布大小為 640x480
  circleX = width / 2; // 圓的初始 X 座標
  circleY = height / 2; // 圓的初始 Y 座標
  previousX = circleX;
  previousY = circleY;

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480); // 設定影像大小與畫布一致
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // 模擬 keypoints 資料（測試用）
  for (let i = 0; i < 21; i++) {
    hand.keypoints.push({ x: random(width), y: random(height) });
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
    isDragging = true; // 開始畫軌跡
  } else {
    isDragging = false; // 停止畫軌跡
  }
}

function checkPinchTouch(hand) {
  // 檢查食指 (keypoints[8]) 與大拇指 (keypoints[4]) 是否同時碰觸圓的邊緣
  let fingerX = hand.keypoints[8].x;
  let fingerY = hand.keypoints[8].y;
  let thumbX = hand.keypoints[4].x;
  let thumbY = hand.keypoints[4].y;

  let distanceToCircleFinger = dist(fingerX, fingerY, circleX, circleY);
  let distanceToCircleThumb = dist(thumbX, thumbY, circleX, circleY);

  if (distanceToCircleFinger < circleSize / 2 && distanceToCircleThumb < circleSize / 2) {
    // 如果大拇指與食指同時碰觸圓，讓圓跟隨兩者的中點移動
    circleX = (fingerX + thumbX) / 2;
    circleY = (fingerY + thumbY) / 2;
    isDragging = true; // 開始畫軌跡
  } else {
    isDragging = false; // 停止畫軌跡
  }
}

function draw() {
  background(255);
  image(video, 0, 0, 640, 480); // 繪製影像，大小與畫布一致

  // 繪製圓
  fill(200, 0, 0);
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // 繪製手的 keypoints 和連線
  drawHand(hand);

  // 檢查大拇指與食指是否同時碰觸圓
  checkPinchTouch(hand);

  // 如果正在夾住圓，畫出軌跡
  if (isDragging) {
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(2);
    line(previousX, previousY, circleX, circleY); // 畫出圓心的移動軌跡
    previousX = circleX;
    previousY = circleY;
  }

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let detectedHand of hands) {
      if (detectedHand.confidence > 0.1) {
        // 繪製手的連線
        drawHand(detectedHand);

        // 繪製 keypoints
        for (let i = 0; i < detectedHand.keypoints.length; i++) {
          let keypoint = detectedHand.keypoints[i];

          // 根據左右手設定顏色
          if (detectedHand.handedness == "Left") {
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
