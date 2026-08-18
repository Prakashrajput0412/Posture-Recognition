/**
 * Initializes the Posture Recognition application.
 */
function initializeApplication() {
    initializePoseDetection();
}


/**
 * p5.js setup function.
 */
function setup() {
    initializeApplication();
}


/**
 * p5.js draw function.
 *
 * The visualization module will later use the detected
 * pose data to draw keypoints and skeleton information.
 */
function draw() {
    if (!poses || poses.length === 0) {
        return;
    }

    const detectedPose = poses[0].pose;

    if (!detectedPose) {
        return;
    }

    const postureResult = analyzePosture(detectedPose);

    console.log(postureResult);
}