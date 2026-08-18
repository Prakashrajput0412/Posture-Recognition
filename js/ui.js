// Get the posture status element
const postureStatus = document.getElementById("posture-status");

// Update posture status on the screen
function updatePostureStatus(status) {
    if (postureStatus) {
        postureStatus.textContent = status;
    }
}

// Show loading/model message
function showLoadingMessage(message) {
    if (postureStatus) {
        postureStatus.textContent = message;
    }
}

// Show error message
function showErrorMessage(message) {
    if (postureStatus) {
        postureStatus.textContent = message;
    }
}

// Clear the status message
function clearStatus() {
    if (postureStatus) {
        postureStatus.textContent = "";
    }
}
