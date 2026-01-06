import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useClockStore = defineStore('clock', () => {
  const currentTime = ref<Date>(new Date());
  const currentTimestamp = ref<number>(Math.floor(currentTime.value.getTime() / 1000));
  let timer: null | number = null;

  function startClock() {
    updateTime(); // Initial call

    // Update every second (1000ms)
    timer = window.setInterval(updateTime, 1000);
  }

  function stopClock() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function updateTime() {
    currentTime.value = new Date();
    currentTimestamp.value = Math.floor(currentTime.value.getTime() / 1000);
  }

  function formattedTime(customTimestamp?: number) {
    if (customTimestamp) {
      const customDate = new Date(customTimestamp * 1000);
      return customDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return currentTime.value.toLocaleTimeString();
  }

  function formattedDate(customTimestamp?: number) {
    if (customTimestamp) {
      const customDate = new Date(customTimestamp * 1000);
      return customDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }

    return currentTime.value.toLocaleDateString();
  }

  return {
    currentTime,
    currentTimestamp,
    formattedDate,
    formattedTime,
    startClock,
    stopClock,
  };
});
