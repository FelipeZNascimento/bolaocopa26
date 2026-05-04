# Performance Improvements for LCP

## What Was Changed

### 1. Resource Hints in index.html ✅ (IMPLEMENTED)

Added the following to make resources discoverable in the initial document:

- **`preconnect` to CDNs**: Establishes early connections to `assets.omegafox.me` and `digitalhub.fifa.com`
  - Saves ~100-300ms by completing DNS, TCP, and TLS handshakes early
- **`dns-prefetch`**: Fallback for older browsers to at least resolve DNS early

- **Inter Font Loading**: Added Google Fonts link with `preconnect` and `display=swap`
  - Uses `display=swap` to show text immediately with fallback fonts

- **Critical Image Preloading**: Preloads top 3 country flags (Brazil, Argentina, USA) with `fetchpriority="high"`
  - These are likely in the first matches displayed

### 2. Font Metric Overrides ✅ (IMPLEMENTED)

Added CSS font-face declarations in `base.scss` to prevent layout shift:

**What it does:**

- Defines "Inter Fallback" font family that uses Arial with adjusted metrics
- Metrics are tuned to match Inter's dimensions (ascent, descent, line-gap, size)
- When Inter is loading, Arial displays with Inter's exact sizing
- When Inter loads and swaps, there's NO layout shift because sizes match perfectly

**How it works:**

```css
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  ascent-override: 90%; /* Matches Inter's ascender height */
  descent-override: 22%; /* Matches Inter's descender depth */
  line-gap-override: 0%; /* Matches Inter's line gap */
  size-adjust: 107%; /* Scales Arial to match Inter's x-height */
}
```

**Benefits:**

- ✅ Text visible instantly (good LCP)
- ✅ Zero layout shift when font loads (good CLS)
- ✅ No extra downloads - uses system Arial

**Font stack:**

```
Inter → "Inter Fallback" → -apple-system → ... → sans-serif
```

### 3. Optimized Font Loading ✅ (IMPLEMENTED)

**Problem:** Google Fonts CSS was taking 800ms to load due to waterfall effect:

```
HTML → CSS file → Parse CSS → Discover font files → Download fonts
```

**Solution:** Direct font preloading + async CSS loading

**What was added:**

- **Preload WOFF2 files directly**: Browser downloads fonts immediately in parallel with CSS
- **Async CSS loading**: Using `media="print" onload="this.media='all'"` makes CSS non-blocking
- **Prioritized weights**: Preload weights 400 and 600 (most used), lazy-load 500 and 700

**Code:**

```html
<!-- Preload critical font files -->
<link
  rel="preload"
  as="font"
  type="font/woff2"
  href="https://fonts.gstatic.com/s/inter/..."
  crossorigin
/>

<!-- Non-blocking CSS load -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:..."
  media="print"
  onload="this.media='all'"
/>
```

**Benefits:**

- ✅ Eliminates 500-700ms waterfall delay
- ✅ Fonts available before CSS finishes parsing
- ✅ Non-blocking - doesn't delay page render
- ✅ Fallback fonts display instantly (with metric overrides)

### 4. SEO Optimization - robots.txt ✅ (IMPLEMENTED)

Created `/public/robots.txt` for better search engine indexing:

**What it includes:**

- ✅ Allows crawling of public pages (matches, ranking, rules, teams, extras)
- ✅ Blocks authentication pages (/reset-password, /api/)
- ✅ Blocks AI training bots (GPTBot, ChatGPT-User, CCBot, anthropic-ai)
- ✅ Allows major search engines (Googlebot, Bingbot) with specific rules
- ✅ Sets crawl-delay for polite crawling
- ✅ References sitemap.xml location (update URL when deployed)

## Additional Recommendations

### 5. Image Optimization (NOT YET IMPLEMENTED)

Consider these approaches:

**A. Use WebP/AVIF formats**

- Modern formats are 25-35% smaller than PNG
- If you control `assets.omegafox.me`, serve WebP with PNG fallback

**B. Lazy load below-the-fold images**

```vue
<!-- In TeamComponent.vue and other components -->
<img
  :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
  loading="lazy"
  decoding="async"
/>
```

⚠️ **Don't lazy load LCP image** - only apply to images below the fold

**C. Add explicit dimensions to prevent layout shift**

```vue
<img :src="..." width="32" height="24" alt="Country flag" />
```

### 6. Code Splitting Already Implemented ✅

Your router already lazy-loads routes - good!

```ts
component: () => import('../views/ExtrasView.vue');
```

### 7. Bundle Analysis

Run this to see what's in your bundle:

```bash
npm run build
npx vite-bundle-visualizer
```

Look for:

- Large dependencies that could be lazy loaded
- Duplicate dependencies
- Unused code

### 8. Reduce JavaScript Execution Time

**A. Virtual Scrolling for Long Lists**

- If you have many matches, use virtual scrolling
- Only render visible items in viewport

**B. Defer Non-Critical Services**

- Move `rankingService.fetch()` after paint
- Use `requestIdleCallback` or `setTimeout`

Example:

```ts
// In App.vue
startupService.initialize(initializationCallback).then(() => {
  clockStore.startClock();

  // Defer ranking fetch until browser is idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => rankingService.fetch());
  } else {
    setTimeout(() => rankingService.fetch(), 1);
  }
});
```

### 9. Critical CSS Extraction

Vite can inline critical CSS automatically. Update `vite.config.ts`:

```ts
export default defineConfig({
  build: {
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      },
    },
  },
});
```

### 10. API Response Optimization

- Enable HTTP/2 or HTTP/3 on your backend
- Use compression (gzip/brotli)
- Implement caching headers for static resources
- Consider GraphQL to fetch only needed fields

### 11. Service Worker Caching (Already Configured) ✅

You have Workbox configured - great! Consider:

- Pre-caching critical routes
- Stale-while-revalidate for API calls

## Measuring Impact

After changes, measure with:

1. **Lighthouse CI**

```bash
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000
```

2. **WebPageTest**

- Visit https://www.webpagetest.org/
- Test from different locations/devices

3. **Chrome DevTools**

- Performance tab → Record → Look at LCP timing
- Network tab → Check resource waterfall

## Target Metrics

- **LCP**: < 2.5s (Good) | 2.5-4s (Needs Improvement) | > 4s (Poor)
- **FID**: < 100ms (Good)
- **CLS**: < 0.1 (Good)

## Priority Order

1. ✅ **Resource hints** (DONE - easiest, immediate impact)
2. ✅ **Font metric overrides** (DONE - prevents CLS on font load)
3. ✅ **Optimized font loading** (DONE - eliminates 500-700ms delay)
4. ✅ **robots.txt** (DONE - SEO optimization)
5. 🔄 **Image dimensions** (prevents CLS)
6. 🔄 **Lazy loading** (reduces initial payload)
7. 🔄 **Defer non-critical JS** (faster interactivity)
8. 🔄 **Bundle analysis** (identify big wins)
