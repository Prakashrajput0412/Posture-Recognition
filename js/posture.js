/**
 * Analyzes the detected pose.
 */
function analyzePosture(pose) {

    if (!pose || !pose.keypoints) {
        return createPostureResult("No pose detected", false);
    }

    const posture = calculatePosture(pose);

    return createPostureResult(
        posture.label,
        posture.isGood
    );
}


/**
 * Finds a keypoint by name.
 */
function getKeypoint(keypoints, name) {

    if (!Array.isArray(keypoints)) {
        return null;
    }

    const keypoint = keypoints.find(
        point => point.part === name
    );

    return keypoint || null;
}


/**
 * Checks keypoint reliability.
 */
function isReliableKeypoint(
    keypoint,
    minimumConfidence = 0.15
) {

    if (!keypoint || !keypoint.position) {
        return false;
    }

    const score =
        keypoint.score ?? keypoint.confidence;

    if (typeof score !== "number") {
        return true;
    }

    return score >= minimumConfidence;
}


/**
 * Calculates vertical difference.
 */
function calculateVerticalDifference(
    firstPoint,
    secondPoint
) {

    return Math.abs(
        firstPoint.y - secondPoint.y
    );
}


/**
 * Calculates head tilt angle.
 *
 * 0 degrees = horizontal eyes
 * Larger angle = head tilted
 */
function calculateHeadTilt(firstEye, secondEye) {

    const deltaX =
        secondEye.x - firstEye.x;

    const deltaY =
        secondEye.y - firstEye.y;

    if (deltaX === 0) {
        return 90;
    }

    let angle =
        Math.atan2(deltaY, deltaX) *
        (180 / Math.PI);

    /*
     * Convert angles such as 175 degrees
     * into 5 degrees.
     */
    angle = Math.abs(angle);

    if (angle > 90) {
        angle = 180 - angle;
    }

    return angle;
}


/**
 * Calculates posture.
 */
function calculatePosture(pose) {

    const keypoints = pose.keypoints;


    /*
     * HEAD
     */
    const leftEye =
        getKeypoint(keypoints, "leftEye");

    const rightEye =
        getKeypoint(keypoints, "rightEye");

    const nose =
        getKeypoint(keypoints, "nose");


    /*
     * SHOULDERS
     */
    const leftShoulder =
        getKeypoint(
            keypoints,
            "leftShoulder"
        );

    const rightShoulder =
        getKeypoint(
            keypoints,
            "rightShoulder"
        );


    /*
     * Check required keypoints.
     */
    const requiredKeypoints = [
        leftEye,
        rightEye,
        nose,
        leftShoulder,
        rightShoulder
    ];


    const valid =
        requiredKeypoints.every(
            keypoint =>
                isReliableKeypoint(
                    keypoint,
                    0.15
                )
        );


    if (!valid) {

        return {
            label: "Insufficient pose data",
            isGood: false
        };
    }


    /*
     * =========================================
     * HEAD TILT
     * =========================================
     */

    const headTilt =
        calculateHeadTilt(
            leftEye.position,
            rightEye.position
        );


    /*
     * =========================================
     * SHOULDER TILT
     * =========================================
     */

    const shoulderDifference =
        calculateVerticalDifference(
            leftShoulder.position,
            rightShoulder.position
        );


    /*
     * Calculate shoulder width so that
     * the threshold works at different
     * distances from the camera.
     */
    const shoulderWidth =
        Math.abs(
            leftShoulder.position.x -
            rightShoulder.position.x
        );


    let normalizedShoulderTilt = 0;

    if (shoulderWidth > 0) {

        normalizedShoulderTilt =
            shoulderDifference /
            shoulderWidth;
    }


    /*
     * =========================================
     * THRESHOLDS
     * =========================================
     */

    const MAX_HEAD_TILT = 18;

    const MAX_SHOULDER_TILT = 0.25;


    /*
     * =========================================
     * CONDITIONS
     * =========================================
     */

    const headIsStraight =
        headTilt <= MAX_HEAD_TILT;


    const shouldersAreStraight =
        normalizedShoulderTilt <=
        MAX_SHOULDER_TILT;


    /*
     * Final decision.
     */
    const isGood =
        headIsStraight &&
        shouldersAreStraight;


    /*
     * Debug information.
     * Check browser console if needed.
     */
    console.log(
        "Posture:",
        isGood
            ? "GOOD"
            : "POOR",

        "| Head Tilt:",
        headTilt.toFixed(2),

        "| Shoulder Tilt:",
        normalizedShoulderTilt.toFixed(2)
    );


    return {

        label:
            isGood
                ? "Good Posture"
                : "Poor Posture",

        isGood: isGood,

        metrics: {

            headTilt:
                headTilt,

            shoulderTilt:
                normalizedShoulderTilt
        }
    };
}


/**
 * Creates standardized posture result.
 */
function createPostureResult(
    label,
    isGood
) {

    return {
        label: label,
        isGood: isGood
    };
}