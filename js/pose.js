// Stores the webcam video and PoseNet model
let video;
let poseNet;

// Stores the latest pose detection results
let poses = [];

/**
 * Initializes webcam capture and PoseNet.
 */
function initializePoseDetection() {
    video = createCapture(VIDEO);

    video.size(640, 480);
    video.hide();

    poseNet = ml5.poseNet(video, handleModelReady);

    poseNet.on("pose", handlePoseResults);
}

/**
 * Called when the PoseNet model is loaded.
 */
function handleModelReady() {
    console.log("PoseNet model loaded successfully.");
}

/**
 * Receives pose detection results.
 * @param {Array} results - Detected pose results.
 */
function handlePoseResults(results) {
    poses = results;

    console.log("Pose results received:", results.length);
}