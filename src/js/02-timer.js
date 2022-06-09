import '../css/common.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};
let selectedTime = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const presentTime = Date.now();
    selectedTime = selectedDates[0];
    if (presentTime > selectedTime) {
      Notiflix.Notify.failure(`Please choose a date in the future`);
      refs.startBtn.setAttribute('disabled', true);
      return;
    } else {
      refs.startBtn.removeAttribute('disabled');
    }
  },
};
flatpickr('#datetime-picker', options);

const timer = {
  intervalId: null,
  isActive: false,

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    refs.startBtn.setAttribute('disabled', true);

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = selectedTime - currentTime;
      const newTime = convertMs(deltaTime);
      updateClockFace(newTime);

      if (deltaTime <= 0) {
        clearInterval(this.intervalId);
        updateClockFace({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
      }
    }, 1000);
  },
};

function pad(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = pad(Math.floor(ms / day));
  const hours = pad(Math.floor((ms % day) / hour));
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.daysEl.innerHTML = days;
  refs.hoursEl.innerHTML = hours;
  refs.minutesEl.innerHTML = minutes;
  refs.secondsEl.innerHTML = seconds;
}

refs.startBtn.addEventListener('click', () => {
  timer.start();
});
