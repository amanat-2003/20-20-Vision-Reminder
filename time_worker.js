// timer-worker.js
let workTimer = null;
let breakTimer = null;

let workInputValue = 20; // Default value
let breakInputValue = 20; // Default value

let workTotalTime = workInputValue * 60 * 1000; // Default 20 minutes
let breakTotalTime = breakInputValue * 1000; // Default 20 seconds

let isWorkTimerRunning = false;
let isBreakTimerRunning = false;

let isWorkTimerPaused = false;
let isBreakTimerPaused = false;

// Format time as HH:MM:SS
function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000).toString().padStart(2, "0");
  const minutes = Math.floor((milliseconds % 3600000) / 60000).toString().padStart(2, "0");
  const seconds = Math.floor((milliseconds % 60000) / 1000).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Start Work Timer
function startWorkTimer(duration) {
  if (isWorkTimerRunning || duration <= 0) return;

  workTotalTime = duration;
  isWorkTimerRunning = true;
  
  workTimer = setInterval(() => {
    if (isWorkTimerPaused) return;
    workTotalTime -= 10;
    
    if (workTotalTime <= 0) {
      clearInterval(workTimer);
      workTotalTime = 0;
      postMessage({ 
        type: 'workTimerUpdate', 
        time: formatTime(workTotalTime), 
        finished: true 
      });
      stopWorkTimer();
      startBreakTimer(breakInputValue * 1000);
    } else {
      postMessage({ 
        type: 'workTimerUpdate', 
        time: formatTime(workTotalTime), 
        finished: false 
      });
    }
  }, 10);
}

// Stop Work Timer
function stopWorkTimer() {
  clearInterval(workTimer);
  workTimer = null;
  isWorkTimerRunning = false;
  isWorkTimerPaused = false;
  workTotalTime = workInputValue * 60 * 1000; // Reset to default
  
  postMessage({ 
    type: 'workTimerStopped', 
    time: formatTime(workTotalTime) 
  });
}

// Pause Work Timer
function pauseWorkTimer() {
  isWorkTimerPaused = true;
  postMessage({ type: 'workTimerPaused' });
}

// Resume Work Timer
function resumeWorkTimer() {
  isWorkTimerPaused = false;
  postMessage({ type: 'workTimerResumed' });
}

// Start Break Timer
function startBreakTimer(duration) {
  if (isBreakTimerRunning || duration <= 0) return;

  breakTotalTime = duration;
  isBreakTimerRunning = true;
  
  breakTimer = setInterval(() => {
    if (isBreakTimerPaused) return;
    breakTotalTime -= 10;
    
    if (breakTotalTime <= 0) {
      clearInterval(breakTimer);
      breakTotalTime = 0;
      postMessage({ 
        type: 'breakTimerUpdate', 
        time: formatTime(breakTotalTime), 
        finished: true 
      });
      stopBreakTimer();
      startWorkTimer(workInputValue * 60 * 1000);
    } else {
      postMessage({ 
        type: 'breakTimerUpdate', 
        time: formatTime(breakTotalTime), 
        finished: false 
      });
    }
  }, 10);
}

// Stop Break Timer
function stopBreakTimer() {
  clearInterval(breakTimer);
  breakTimer = null;
  isBreakTimerRunning = false;
  isBreakTimerPaused = false;
  breakTotalTime = breakInputValue * 1000;; // Reset to default
  
  postMessage({ 
    type: 'breakTimerStopped', 
    time: formatTime(breakTotalTime) 
  });
}

// Pause Break Timer
function pauseBreakTimer() {
  isBreakTimerPaused = true;
  postMessage({ type: 'breakTimerPaused' });
}

// Resume Break Timer
function resumeBreakTimer() {
  isBreakTimerPaused = false;
  postMessage({ type: 'breakTimerResumed' });
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data.inputValue) {
    if (event.data.type === 'startWorkTimer') {
        workInputValue = event.data.inputValue;
    } else if (event.data.type === 'startBreakTimer') {
        breakInputValue = event.data.inputValue;
    }
}
  switch (event.data.type) {
    case 'startWorkTimer':
      startWorkTimer(event.data.duration);
      break;
    case 'stopWorkTimer':
      stopWorkTimer();
      break;
    case 'pauseWorkTimer':
      pauseWorkTimer();
      break;
    case 'resumeWorkTimer':
      resumeWorkTimer();
      break;
    case 'startBreakTimer':
      startBreakTimer(event.data.duration);
      break;
    case 'stopBreakTimer':
      stopBreakTimer();
      break;
    case 'pauseBreakTimer':
      pauseBreakTimer();
      break;
    case 'resumeBreakTimer':
      resumeBreakTimer();
      break;
  }
});