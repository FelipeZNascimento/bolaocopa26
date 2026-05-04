/**
 * Creates a debounced version of a function that can be cancelled
 *
 * @example
 * const { debounced, cancel } = createCancellableDebounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debounced('test');
 * cancel(); // Cancels the pending execution
 */

export function createCancellableDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): {
  cancel: () => void;
  debounced: (...args: Parameters<T>) => void;
} {
  let timerId: null | ReturnType<typeof setTimeout> = null;

  const cancel = (): void => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  const debounced = (...args: Parameters<T>): void => {
    cancel();

    timerId = setTimeout(() => {
      func(...args);
      timerId = null;
    }, delay);
  };

  return {
    cancel,
    debounced,
  };
}

/**
 * Generic debounce service for delaying function execution
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debouncedSearch('test'); // Will execute after 300ms of inactivity
 */

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timerId: null | ReturnType<typeof setTimeout> = null;

  return function debounced(...args: Parameters<T>): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func(...args);
      timerId = null;
    }, delay);
  };
}
