class Stopwatch {
  constructor() {
    this.startTime = null
    this.elapsedTime = 0
    this.timerInterval = null
    this.isRunning = false
    this.lapCount = 0

    // Get DOM elements
    this.timeDisplay = document.getElementById("time-display")
    this.startPauseBtn = document.getElementById("start-pause-btn")
    this.lapBtn = document.getElementById("lap-btn")
    this.resetBtn = document.getElementById("reset-btn")
    this.lapList = document.getElementById("lap-list")
    this.display = document.querySelector(".display")

    // Bind event listeners
    this.initEventListeners()
  }

  initEventListeners() {
    this.startPauseBtn.addEventListener("click", () => this.toggleStopwatch())
    this.lapBtn.addEventListener("click", () => this.recordLap())
    this.resetBtn.addEventListener("click", () => this.resetStopwatch())
  }

  toggleStopwatch() {
    if (this.isRunning) {
      this.pauseStopwatch()
    } else {
      this.startStopwatch()
    }
  }

  startStopwatch() {
    this.startTime = Date.now() - this.elapsedTime
    this.isRunning = true

    // Update display every 10ms for smooth animation
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime
      this.updateDisplay()
    }, 10)

    // Update UI
    this.startPauseBtn.textContent = "Pause"
    this.startPauseBtn.classList.add("pause")
    this.lapBtn.disabled = false
    this.display.classList.add("running")
  }

  pauseStopwatch() {
    clearInterval(this.timerInterval)
    this.isRunning = false

    // Update UI
    this.startPauseBtn.textContent = "Start"
    this.startPauseBtn.classList.remove("pause")
    this.lapBtn.disabled = true
    this.display.classList.remove("running")
  }

  resetStopwatch() {
    clearInterval(this.timerInterval)
    this.isRunning = false
    this.elapsedTime = 0
    this.startTime = null
    this.lapCount = 0

    // Update display
    this.updateDisplay()

    // Clear lap times
    this.lapList.innerHTML = ""

    // Update UI
    this.startPauseBtn.textContent = "Start"
    this.startPauseBtn.classList.remove("pause")
    this.lapBtn.disabled = true
    this.display.classList.remove("running")
  }

  recordLap() {
    if (this.isRunning) {
      this.lapCount++
      const lapTime = this.formatTime(this.elapsedTime)
      this.addLapToList(this.lapCount, lapTime)
    }
  }

  addLapToList(lapNumber, lapTime) {
    const lapItem = document.createElement("div")
    lapItem.className = "lap-item"
    lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapNumber}</span>
            <span class="lap-time">${lapTime}</span>
        `

    // Add to top of list
    this.lapList.insertBefore(lapItem, this.lapList.firstChild)

    // Scroll to top
    this.lapList.scrollTop = 0
  }

  updateDisplay() {
    const formattedTime = this.formatTime(this.elapsedTime)
    this.timeDisplay.textContent = formattedTime
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`
  }
}

// Initialize the stopwatch when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new Stopwatch()
})

// Add keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Prevent default behavior for these keys
  if (["Space", "KeyR", "KeyL"].includes(event.code)) {
    event.preventDefault()

    switch (event.code) {
      case "Space":
        document.getElementById("start-pause-btn").click()
        break
      case "KeyR":
        document.getElementById("reset-btn").click()
        break
      case "KeyL":
        if (!document.getElementById("lap-btn").disabled) {
          document.getElementById("lap-btn").click()
        }
        break
    }
  }
})
