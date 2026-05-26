import { onMounted, onUnmounted, ref } from 'vue';

// Breakpoints
const SMALL_MOBILE_MAX = 480;
const MOBILE_MAX = 768;
const TABLET_MAX = 1280;

class ViewportService {
  public isDesktop = ref(false);
  public isMobile = ref(false);
  public isSmallMobile = ref(false);
  public isTablet = ref(false);

  private resizeHandler: () => void;

  constructor() {
    this.resizeHandler = this.updateViewport.bind(this);
    this.updateViewport();
  }

  public startWatching() {
    window.addEventListener('resize', this.resizeHandler);
  }

  public stopWatching() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  private updateViewport() {
    const width = window.innerWidth;

    this.isSmallMobile.value = width <= SMALL_MOBILE_MAX;
    this.isMobile.value = width <= MOBILE_MAX;
    this.isTablet.value = width > MOBILE_MAX && width < TABLET_MAX;
    this.isDesktop.value = width >= TABLET_MAX;
  }
}

// Singleton instance
const viewportService = new ViewportService();

/**
 * Composable for reactive viewport detection
 *
 * @returns Object with reactive viewport breakpoint values
 * @example
 * const { isMobile, isTablet, isDesktop } = useViewport();
 */
export function useViewport() {
  onMounted(() => {
    viewportService.startWatching();
  });

  onUnmounted(() => {
    viewportService.stopWatching();
  });

  return {
    isDesktop: viewportService.isDesktop,
    isMobile: viewportService.isMobile,
    isSmallMobile: viewportService.isSmallMobile,
    isTablet: viewportService.isTablet,
  };
}

export default viewportService;
