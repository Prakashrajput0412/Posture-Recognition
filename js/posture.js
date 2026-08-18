/**
 * Analyzes the detected pose and returns a posture result.
 *
 * @param {Object} pose - A single detected pose.
 * @returns {Object} Posture analysis result.
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
 * Finds a specific body keypoint by its name.
 *
 * @param {Array} keypoints - PoseNet keypoints.
 * @param {string} name - Name of the required keypoint.
 * @returns {Object|null} Matching keypoint or null.
 */
function getKeypoint(keypoints, name) {
    if (!Array.isArray(keypoints)) {
        return null;
    }

    const keypoint = keypoints.find(
        (point) => point.part === name
    );

    if (!keypoint || !keypoint.position) {
        return null;
    }

    return keypoint;
}


/**
 * Checks whether a keypoint has enough confidence
 * to be used for posture analysis.
 *
 * @param {Object} keypoint - PoseNet keypoint.
 * @param {number} minimumConfidence - Minimum required confidence.
 * @returns {boolean} True if the keypoint is reliable.
 */
function isReliableKeypoint(keypoint, minimumConfidence = 0.5) {
    if (!keypoint) {
        return false;
    }

    const score = keypoint.score ?? keypoint.confidence;

    if (typeof score !== "number") {
        return true;
    }

    return score >= minimumConfidence;
}


/**
 * Calculates the midpoint between two points.
 *
 * @param {Object} firstPoint - First point.
 * @param {Object} secondPoint - Second point.
 * @returns {Object} Midpoint coordinates.
 */
function calculateMidpoint(firstPoint, secondPoint) {
    return {
        x: (firstPoint.x + secondPoint.x) / 2,
        y: (firstPoint.y + secondPoint.y) / 2
    };
}


/**
 * Calculates the horizontal distance between two points.
 *
 * @param {Object} firstPoint - First point.
 * @param {Object} secondPoint - Second point.
 * @returns {number} Horizontal distance.
 */
function calculateHorizontalDistance(firstPoint, secondPoint) {
    return Math.abs(firstPoint.x - secondPoint.x);
}


/**
 * Calculates the vertical difference between two points.
 *
 * @param {Object} firstPoint - First point.
 * @param {Object} secondPoint - Second point.
 * @returns {number} Vertical difference.
 */
function calculateVerticalDifference(firstPoint, secondPoint) {
    return Math.abs(firstPoint.y - secondPoint.y);
}


/**
 * Calculates posture information from pose keypoints.
 *
 * @param {Object} pose - A single detected pose.
 * @returns {Object} Calculated posture information.
 */
function calculatePosture(pose) {
    const keypoints = pose.keypoints;

    const nose = getKeypoint(keypoints, "nose");
    const leftShoulder = getKeypoint(keypoints, "leftShoulder");
    const rightShoulder = getKeypoint(keypoints, "rightShoulder");

    const requiredKeypoints = [
        nose,
        leftShoulder,
        rightShoulder
    ];

    const hasReliableKeypoints = requiredKeypoints.every(
        (keypoint) => isReliableKeypoint(keypoint)
    );

    if (!hasReliableKeypoints) {
        return {
            label: "Insufficient pose data",
            isGood: false
        };
    }

    const shoulderMidpoint = calculateMidpoint(
        leftShoulder.position,
        rightShoulder.position
    );

    const headOffset = calculateHorizontalDistance(
        nose.position,
        shoulderMidpoint
    );

    const shoulderTilt = calculateVerticalDifference(
        leftShoulder.position,
        rightShoulder.position
    );

    /*
     * These thresholds are initial values.
     * They should be calibrated after testing the application
     * with different users and camera positions.
     */
    const MAX_HEAD_OFFSET = 80;
    const MAX_SHOULDER_TILT = 30;

    const headAlignmentIsGood =
        headOffset <= MAX_HEAD_OFFSET;

    const shoulderAlignmentIsGood =
        shoulderTilt <= MAX_SHOULDER_TILT;

    const isGood =
        headAlignmentIsGood &&
        shoulderAlignmentIsGood;

    return {
        label: isGood ? "Good Posture" : "Poor Posture",
        isGood: isGood,
        metrics: {
            headOffset: headOffset,
            shoulderTilt: shoulderTilt
        }
    };
}


/**
 * Creates a standardized posture result.
 *
 * @param {string} label - Posture label.
 * @param {boolean} isGood - Whether posture is considered good.
 * @returns {Object} Standardized posture result.
 */
function createPostureResult(label, isGood) {
    return {
        label: label,
        isGood: isGood
    };
}