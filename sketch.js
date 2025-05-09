// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleSize = 100; // 圓的寬高
let hand = { keypoints: [] }; // 單手的 keypoints

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

function checkPinchTouch(hand) {
  // 檢查食指 (keypoints[8]) 與大拇指 (keypoints[4]) 是否同時碰觸圓的邊緣
  let fingerX = hand.keypoints[8].x;
  let fingerY = hand.keypoints[8].y;
  let thumbX = hand.keypoints[4].x;
  let thumbY = hand.keypoints[4].y;

  let distanceToCircleFinger = dist(fingerX, fingerY, circleX, circleY);
  let distanceToCircleThumb = dist(thumbX, thumbY, circleX, circleY);

  if (distanceToCircleFinger < circleSize / 2 && distanceToCircleThumb < circleSize / 2) {
    // 如果食指與大拇指同時碰觸圓，讓圓跟隨兩者的中點移動
    circleX = (fingerX + thumbX) / 2;
    circleY = (fingerY + thumbY) / 2;
  }
}

function draw() {
  background(255);
  image(video, 0, 0);

  // 繪製圓
  fill(200, 0, 0);
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // 繪製手的 keypoints 和連線
  drawHand(hand);

  // 檢查食指與大拇指是否同時碰觸圓
  checkPinchTouch(hand);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let detectedHand of hands) {
      if (detectedHand.confidence > 0.1) {
        // Draw hand connections
        drawHand(detectedHand);

        // Loop through keypoints and draw circles
        for (let i = 0; i < detectedHand.keypoints.length; i++) {
          let keypoint = detectedHand.keypoints[i];

          // Color-code based on left or right hand
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
