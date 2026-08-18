function drawKeypoints(poses) {
    for (let i = 0; i < poses.length; i++) {
        const pose = poses[i];

        for (let j = 0; j < pose.keypoints.length; j++) {
            const keypoint = pose.keypoints[j];

            if (keypoint.score > 0.5) {
                drawKeypoint(keypoint);
            }
        }
    }
}


function drawKeypoint(keypoint) {
    const x = keypoint.position.x;
    const y = keypoint.position.y;

    ellipse(x, y, 10, 10);
}


function drawSkeleton(poses) {
    for (let i = 0; i < poses.length; i++) {
        const pose = poses[i];

        for (let j = 0; j < pose.skeleton.length; j++) {
            const partA = pose.skeleton[j][0];
            const partB = pose.skeleton[j][1];

            drawSkeletonLine(partA, partB);
        }
    }
}


function drawSkeletonLine(partA, partB) {
    line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
    );
}