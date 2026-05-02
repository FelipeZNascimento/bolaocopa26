import { defineStore } from "pinia";
import { ref } from "vue";

import { ROUNDS } from "@/constants/rounds";

export const useClockStore = defineStore("clock", () => {
  const currentTime = ref<Date>(new Date());
  const currentTimestamp = ref<number>(
    Math.floor(currentTime.value.getTime() / 1000),
  );
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

  function getFormattedTime(customTimestamp?: number) {
    if (customTimestamp) {
      const customDate = new Date(customTimestamp * 1000);
      return customDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return currentTime.value.toLocaleTimeString();
  }

  function getFormattedDate(customTimestamp?: number) {
    if (customTimestamp) {
      const customDate = new Date(customTimestamp * 1000);
      return customDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }

    return currentTime.value.toLocaleDateString();
  }

  function getRoundName(round: number): string {
    const roundObj = ROUNDS.find((r) => r.num === round);
    return roundObj ? roundObj.display : `Rodada ${round}`;
  }

  function getCountdown(targetTimestamp: number): string {
    const secondsUntil = targetTimestamp - currentTimestamp.value;

    if (secondsUntil <= 0) {
      return "";
    }

    const days = Math.floor(secondsUntil / 86400);
    const hours = Math.floor((secondsUntil % 86400) / 3600);
    const minutes = Math.floor((secondsUntil % 3600) / 60);

    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);
    }
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? "hora" : "horas"}`);
    }
    if (minutes > 0 || parts.length === 0) {
      parts.push(`${minutes} ${minutes === 1 ? "minuto" : "minutos"}`);
    }

    return parts.join(", ");
  }

  return {
    currentTime,
    currentTimestamp,
    getCountdown,
    getFormattedDate,
    getFormattedTime,
    getRoundName,
    startClock,
    stopClock,
  };
});
