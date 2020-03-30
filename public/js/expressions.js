const video = document.querySelector("#video");
const overlay = document.querySelector("#overlay");

const ws = new WebSocket("ws://localhost:7474");

const faceDetectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 160
});
const faceLandmarksTinyModel = true;

async function detect() {
  const results = await faceapi
    .detectSingleFace(video, faceDetectorOptions)
    .withFaceLandmarks(faceLandmarksTinyModel)
    .withFaceExpressions();
  // console.log(results);
  if (results && results.expressions) {
    const dims = faceapi.matchDimensions(overlay, video, true);
    const resizedResults = faceapi.resizeResults(results, dims);
    faceapi.draw.drawDetections(overlay, resizedResults);
    faceapi.draw.drawFaceLandmarks(overlay, resizedResults);
    faceapi.draw.drawFaceExpressions(overlay, resizedResults, 0.05);

    ws.send(JSON.stringify(results.expressions));
  }
  requestAnimationFrame(detect);
}

async function run() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri("/weights"),
    faceapi.nets.faceExpressionNet.loadFromUri("/weights")
  ]);

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;

  video.addEventListener("play", detect);
}

run();
