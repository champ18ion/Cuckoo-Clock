const currTime = document.getElementById("current-time");
const setHour = document.getElementById("hours");
const setMinute = document.getElementById("minutes");
const setSecond = document.getElementById("seconds");
const setAmPm = document.getElementById("pm-am");
const setAlarmButton = document.getElementById("submit-button");
const alarmContainer = document.getElementById("alarms-list");

window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, setHour);

  dropDownMenu(0, 59, setMinute);

  dropDownMenu(0, 59, setSecond);

  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);

// displaying the current Time
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US");
  currTime.innerHTML = time;

  return time;
}
// deploying the dropdown menu
function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

// taking input from dropdown
function getInput(e) {
  e.preventDefault();
  const hourValue = setHour.value;
  const minuteValue = setMinute.value;
  const secondValue = setSecond.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm");
  alarm.innerHTML = `
                <div class="time">${time}</div>
                <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
                `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) =>
    deleteAlarm(e, time, intervalId)
  );

  alarmContainer.prepend(alarm);
}

// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

// delete alarm
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// auto day and night theme
const din = new Date();
if (7 <= din.getHours() && din.getHours() < 10) {
  if (document.body) {
    document.body.className = "day";
  }
} else {
  if (document.body) {
    document.body.className = "night";
  }
}
