import { onUnmounted } from 'vue';

let lockCount = 0;

export function useScrollLock() {
  let isLocked = false;

  function lock() {
    if (isLocked) return;
    isLocked = true;
    lockCount++;
    document.documentElement.style.overflow = 'hidden';
  }

  function unlock() {
    if (!isLocked) return;
    isLocked = false;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.documentElement.style.overflow = '';
    }
  }

  onUnmounted(unlock);

  return { lock, unlock };
}
