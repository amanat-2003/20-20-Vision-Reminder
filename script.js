// Create a web worker
const timerWorker = new Worker('time_worker.js');

// DOM Elements
const workTimerDisplay = document.getElementById("workTimer");
const startWorkButton = document.getElementById("startWorkButton");
const stopWorkButton = document.getElementById("stopWorkButton");
const playPauseWorkButton = document.getElementById("playPauseWorkButton");

const breakTimerDisplay = document.getElementById("breakTimer");
const startBreakButton = document.getElementById("startBreakButton");
const stopBreakButton = document.getElementById("stopBreakButton");
const playPauseBreakButton = document.getElementById("playPauseBreakButton");

const workTimerInput = document.getElementById("workTimerInput");
const breakTimerInput = document.getElementById("breakTimerInput");

let notificationSound1 = document.getElementById("notificationSound1_english");
let notificationSound2 = document.getElementById("notificationSound2_english");

// Get the language selection dropdown
const languageSelect = document.getElementById("languageSelect");

// Function to update the language of the audio based on selection
function updateAudioLanguage(language) {
    if (language === "hindi") {
        notificationSound1 = document.getElementById("notificationSound1_hindi");
        notificationSound2 = document.getElementById("notificationSound2_hindi");
    } else if (language === "english") {
        notificationSound1 = document.getElementById("notificationSound1_english");
        notificationSound2 = document.getElementById("notificationSound2_english");
    }
}

// Set the initial audio language based on the dropdown value
languageSelect.addEventListener("change", function () {
    updateAudioLanguage(languageSelect.value);
});

// Initialize the audio language (default is English)
updateAudioLanguage(languageSelect.value);

// Listen for messages from the worker
timerWorker.addEventListener('message', (event) => {
    switch (event.data.type) {
        case 'workTimerUpdate':
            workTimerDisplay.textContent = event.data.time;
            if (event.data.finished) {
                startBreakButton.style.display = "none";
                stopBreakButton.style.display = "inline";
                playPauseBreakButton.style.display = "inline";
                notificationSound1.play();
            }
            break;
        case 'workTimerStopped':
            workTimerDisplay.textContent = event.data.time;
            startWorkButton.style.display = "inline";
            stopWorkButton.style.display = "none";
            playPauseWorkButton.style.display = "none";
            playPauseWorkButton.querySelector("img").src = "pause.png";
            break;
        case 'workTimerPaused':
            playPauseWorkButton.querySelector("img").src = "play.png";
            break;
        case 'workTimerResumed':
            playPauseWorkButton.querySelector("img").src = "pause.png";
            break;

        case 'breakTimerUpdate':
            breakTimerDisplay.textContent = event.data.time;
            if (event.data.finished) {
                startWorkButton.style.display = "none";
                stopWorkButton.style.display = "inline";
                playPauseWorkButton.style.display = "inline";
                notificationSound2.play();
            }
            break;
        case 'breakTimerStopped':
            breakTimerDisplay.textContent = event.data.time;
            startBreakButton.style.display = "inline";
            stopBreakButton.style.display = "none";
            playPauseBreakButton.style.display = "none";
            playPauseBreakButton.querySelector("img").src = "pause.png";
            break;
        case 'breakTimerPaused':
            playPauseBreakButton.querySelector("img").src = "play.png";
            break;
        case 'breakTimerResumed':
            playPauseBreakButton.querySelector("img").src = "pause.png";
            break;
    }
});

// Event listeners for Work Timer buttons
startWorkButton.addEventListener("click", () => {
    const workTime = parseInt(workTimerInput.value) * 60 * 1000; // Convert minutes to milliseconds
    timerWorker.postMessage({
        type: 'startWorkTimer',
        duration: workTime,
        inputValue: workTimerInput.value
    });
    startWorkButton.style.display = "none";
    stopWorkButton.style.display = "inline";
    playPauseWorkButton.style.display = "inline";
});

playPauseWorkButton.addEventListener("click", () => {
    const currentSrc = playPauseWorkButton.querySelector("img").src;
    if (currentSrc.includes("pause.png")) {
        timerWorker.postMessage({ type: 'pauseWorkTimer' });
    } else {
        timerWorker.postMessage({ type: 'resumeWorkTimer' });
    }
});

stopWorkButton.addEventListener("click", () => {
    timerWorker.postMessage({ type: 'stopWorkTimer' });
});

// Event listeners for Break Timer buttons
startBreakButton.addEventListener("click", () => {
    const breakTime = parseInt(breakTimerInput.value) * 1000; // Convert seconds to milliseconds
    timerWorker.postMessage({
        type: 'startBreakTimer',
        duration: breakTime,
        inputValue: breakTimerInput.value
    });
    startBreakButton.style.display = "none";
    stopBreakButton.style.display = "inline";
    playPauseBreakButton.style.display = "inline";
});

playPauseBreakButton.addEventListener("click", () => {
    const currentSrc = playPauseBreakButton.querySelector("img").src;
    if (currentSrc.includes("pause.png")) {
        timerWorker.postMessage({ type: 'pauseBreakTimer' });
    } else {
        timerWorker.postMessage({ type: 'resumeBreakTimer' });
    }
});

stopBreakButton.addEventListener("click", () => {
    timerWorker.postMessage({ type: 'stopBreakTimer' });
});

