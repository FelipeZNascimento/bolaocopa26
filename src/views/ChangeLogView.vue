<template>
  <div class="changelog-container">
    <h1>Changelog</h1>
    <p class="subtitle">App Updates and Improvements</p>

    <div class="changelog-list">
      <div
        v-for="entry in changelogEntries"
        :key="entry.version"
        class="changelog-entry"
      >
        <div class="entry-header">
          <h2>{{ entry.version }}</h2>
          <span class="entry-date">{{ entry.date }}</span>
        </div>

        <ul class="entry-changes">
          <li
            v-for="(change, index) in entry.changes"
            :key="index"
          >
            {{ change }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const changelogEntries = ref([
  {
    changes: [
      '[Translation] Updates and missing translations added',
      '[Home] On mobile, drag & drop functionality has been improved for better usability',
      '🐛 [Notifications] On mobile, notifications are showing up again',
      '🐛 [Matches] Blocked and added notifications for inactive users trying to bet',
      '🐛 [Extras] Blocked and added notifications for inactive users trying to bet',
    ],
    date: '19/05/2026',
    version: 'v1.0.2',
  },
  {
    changes: [
      '[App] Success notification toaster now dont overlap with the header on desktop',
      '[Rules] Fix PIX Copy & Paste text',
      '[Rules] Added more details for foreign currency payments',
      '[Translation] Updates and missing translations added',
      "[Ranking] Fix 'find me' functionality on ranking",
      '[Ranking] Favorites functionality are easier to find',
      '[Home] Next matches widget now correctly shows upcoming matches with no relation to the selected round',
    ],
    date: '19/05/2026',
    version: 'v1.0.1',
  },
  {
    changes: [
      '[App] Launch of Bolão Copa 26',
      '[Auth] User authentication system',
      '[Match] Match betting functionality',
      '[Ranking] Leaderboard and rankings',
      '[Favorites] Favorites system',
    ],
    date: 'Initial Release - 18/05/2026',
    version: 'v1.0.0',
  },
]);
</script>

<style scoped lang="scss">
.changelog-container {
  max-width: 800px;
  padding: var(--l-spacing);
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.subtitle {
  margin-bottom: var(--l-spacing);
  font-size: var(--m-font-size);
}

.changelog-list {
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
}

.changelog-entry {
  padding-bottom: var(--l-spacing);
  padding-left: var(--l-spacing);
  border-left: 4px solid var(--bolao-c-gold);
}

.entry-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--l-spacing);
}

.entry-header h2 {
  margin: 0;
  font-size: var(--l-font-size);
}

.entry-date {
  font-size: var(--s-font-size);
}

.entry-changes {
  padding-left: var(--l-spacing);
  margin: 0;
  line-height: 1.8;
  list-style-type: disc;
}

.entry-changes li {
  margin-bottom: var(--xs-spacing);
}

@media (width <= 600px) {
  .changelog-container {
    padding: var(--l-spacing);
  }

  .entry-header {
    flex-direction: column;
    gap: var(--xs-spacing);
    align-items: flex-start;
  }
}
</style>
