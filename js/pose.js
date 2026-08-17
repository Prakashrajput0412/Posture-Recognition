let video;
let poseNet;
let poses = [];

function setupPoseDetection() {
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    poseNet = ml5.poseNet(video, modelReady);

    poseNet.on("pose", function(results) {
        poses = results;
    });
}

function modelReady() {
    console.log("PoseNet model loaded successfully.");
}