function setupVisualization() {
    createCanvas(640, 480);
}


function drawVisualization() {
    image(video, 0, 0, width, height);

    if (!poses || poses.length === 0) {
        return;
    }

    const pose = poses[0].pose;

    if (!pose) {
        return;
    }

    // Draw keypoints
    for (const keypoint of pose.keypoints) {
        if (keypoint.score > 0.5) {
            fill(255, 0, 0);
            noStroke();
            circle(
                keypoint.position.x,
                keypoint.position.y,
                10
            );
        }
    }

    // Draw skeleton
    const skeleton = poses[0].skeleton;

    if (skeleton) {
        stroke(0, 255, 0);
        strokeWeight(2);

        for (const connection of skeleton) {
            const partA = connection[0];
            const partB = connection[1];

            line(
                partA.position.x,
                partA.position.y,
                partB.position.x,
                partB.position.y
            );
        }
    }
}