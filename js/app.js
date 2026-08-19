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
 */
function draw() {
    if (!poses || poses.length === 0) {
        return;
    }

    const detectedPose = poses[0].pose;

    if (!detectedPose) {
        updatePostureStatus("No pose detected");
        return;
    }

    const postureResult = analyzePosture(detectedPose);

    updatePostureStatus(postureResult.label);
}