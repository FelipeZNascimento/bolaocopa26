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
      '🐛 [Matches] FIFAs API is bad and we cant appropriately display penalties, so theyre now hidden',
      `[Matches] If a match goes to penalties, we're now displaying it on the score (even though it doesn't impact the ranking)`,
      '[Matches] Substitutions now are available on the match events',
    ],
    date: '30/06/2026',
    version: 'v1.0.35',
  },
  {
    changes: ['[Admin] Added cache health status', '[Admin] Cache flush now working', '[Match Modal] Minor UI fixes'],
    date: '29/06/2026',
    version: 'v1.0.34',
  },
  {
    changes: [
      '[Ranking] Now operates from cache, triggered only by match updates',
      '[Ranking] New websocket event with updates on ranking - user no longer needs to fetch ranking after match update event',
      '[User Modal] Bets now sorted from the most recent to the oldest',
    ],
    date: '28/06/2026',
    version: 'v1.0.33',
  },
  {
    changes: [
      '🐛 [Ranking] Favorites + No Extras now being displayed correctly',
      '[User Modal] You can now check all bets for a specific user',
      '[Match] Improved color visibility for bets on mobile',
      '[Match] Modal improved to showcase features (bets, events, details)',
      '[Match] Modal now has squads (as per FIFA)',
    ],
    date: '27/06/2026',
    version: 'v1.0.32',
  },
  {
    changes: [
      '[Admin] New features on Admin view (but its a secret)',
      '[Server] Improvements on server stability, logging and error handling to avoid downtime on live update',
    ],
    date: '27/06/2026',
    version: 'v1.0.31',
  },
  {
    changes: [
      `🐛 [Match] Bets on live matches are no longer flickering or being displayed wrongly`,
      `[Match] Refresh button was added if you're too anxious to wait for 30s`,
      '[Match] Finished matches are now more evident and show date and time when it has started',
      '[Match] Matches without bets are now shown with an empty grey ribbon',
      '[Match] Winner team is now highlighted when a match is finished',
      '[User Modal] Lower limit placement is now 163',
    ],
    date: '26/06/2026',
    version: 'v1.0.29 | v1.0.30',
  },
  {
    changes: [
      '[Match] On mobile view, "See more" button is now more evident',
      '[Match] On mobile view, match modal now shows points awarded',
    ],
    date: '14/06/2026',
    version: 'v1.0.28',
  },
  {
    changes: ['🐛 [Match] Bets on live matches were not being updated'],
    date: '14/06/2026',
    version: 'v1.0.27',
  },
  {
    changes: [
      '🐛 [Match] Own goals now are being properly shown',
      '🐛 [Ranking] Now correctly showing round ranking when selected',
      '[Match] Scrollbar is now performing better while showing bets',
      '[Match] Added a toggle on desktop view to hide/show match events',
      '[App] General improvements on performance (websocket is now smarter)',
    ],
    date: '14/06/2026',
    version: 'v1.0.26',
  },
  {
    changes: [
      '🐛 [Ranking] Now updating in real time',
      '[Match] Match modal was changed to improve visibility and performance',
    ],
    date: '12/06/2026',
    version: 'v1.0.25',
  },
  {
    changes: ['🐛 [Extras] Top scorer and best players were being scrambled up'],
    date: '11/06/2026',
    version: 'v1.0.24',
  },
  {
    changes: [
      '🐛 [Extras] Adjusted timing for extras after Cup has started',
      '🐛 [Extras] Showing players names instead of teams for best player and top scorer',
    ],
    date: '11/06/2026',
    version: 'v1.0.23',
  },
  {
    changes: [
      '[App] No more registrations after the limit date and time',
      '[Extras] Improvements on when and how to show champion bets with lower factors',
      '[Match] Improvements on match clock for mobile on light theme',
      '[Match] Stadiums are a little bit larger',
    ],
    date: '10/06/2026',
    version: 'v1.0.22',
  },
  {
    changes: [
      '🐛 [Match] Hide weather when its not available yet',
      '🐛 [Extras] Adjusted grid for new team component dimensions',
    ],
    date: '09/06/2026',
    version: 'v1.0.21',
  },
  {
    changes: [
      '[App] Success notification/toast was impossible to read on light mode',
      '[Extras] Improved display when related to players',
    ],
    date: '09/06/2026',
    version: 'v1.0.20',
  },
  {
    changes: ['🐛 [Extras] MyExtras component not being rendered'],
    date: '09/06/2026',
    version: 'v1.0.19',
  },
  {
    changes: [
      '[Extras] Improved display of progressive bets',
      '[Extras] Now will show points for each extra separately',
      '[WorldCup+] Images added for players (more to come when available)',
      '[WorldCup+] Changed icon for players weight',
      '[WorldCup+] Improved stadiums stickers',
      '[WorldCup+] Improved players images positioning',
      '[WorldCup+] Reordered players so now positions make more sense (coaches -> gks -> defenders -> midfielders -> strikers)',
      '🐛 [Extras] Best player was not being calculated',
      '🐛 [Extras] Selected indicator was not being updated correctly',
      '🐛 [Ranking] Selector for with/without extras was inverted',
    ],
    date: '09/06/2026',
    version: 'v1.0.16-18',
  },
  {
    changes: [
      '🐛 [Extras] Selected indicator was not being updated correctly',
      '[WorldCup+] Improvement on table for referees',
      '[WorldCup+] Google Maps links added for stadiums coordinates',
    ],
    date: '03/06/2026',
    version: 'v1.0.15',
  },
  {
    changes: [
      '[News] Hide Neymar button (!!!!)',
      '[Match] Improvement on live events',
      '[Match] Clicking on the clock now opens match details',
      '[WorldCup+] Stadiums now can be clicked for larger image view',
      '[WorldCup+] Standings for groups and playoffs now split into two different sections for better organization',
      '[WorldCup+] Improvement on table for referees',
      '[Extras] Ready for players extras',
    ],
    date: '03/06/2026',
    version: 'v1.0.14',
  },
  {
    changes: ['[App] Notification system implemented for important updates', `[WorldCup+] Stadiums' images added`],
    date: '30/05/2026',
    version: 'v1.0.13',
  },
  {
    changes: ['🐛 [App] Sign up was not working correctly'],
    date: '29/05/2026',
    version: 'v1.0.12',
  },
  {
    changes: ['🐛 [App] Password reset was not working correctly'],
    date: '26/05/2026',
    version: 'v1.0.11',
  },
  {
    changes: [
      '[App] Mobile: showing nickname instead of name on the menu slider',
      '🐛 [App] Missing translations for inactive users banner',
      '🐛 [App] Returning users were being set as active instead of inactive',
    ],
    date: '26/05/2026',
    version: 'v1.0.10',
  },
  {
    changes: [
      '[App] Increased security measures for user data protection',
      '🐛 [WorldCup+] Player view was sketchy, now fixed',
      '🐛 [App] Now enforcing passwords with at least 6 characters',
    ],
    date: '26/05/2026',
    version: 'v1.0.9',
  },
  {
    changes: ['[WorldCup+] New section added to the app with standings, teams, stadiums, players, referees'],
    date: '26/05/2026',
    version: 'v1.0.8',
  },
  {
    changes: ['[App] Metatags were updated to improve SEO and sharing previews on social media platforms'],
    date: '25/05/2026',
    version: 'v1.0.7',
  },
  {
    changes: [
      '[App] News widget added to the homepage with latest news about the tournament',
      '[App] Modals now block background scrolling when open for better user experience',
      '[App] Teams are now sorted alphabetically by name based on the selected locale',
      '[Matches] Now able to showcase live score changes and events in real time with improved animations',
      '[Matches] Improvements on match display for both desktop and mobile',
      '[Matches] Improvements on match display when a match is live',
      '🐛 [Extras] Countdown on extras for light mode was not readable',
    ],
    date: '25/05/2026',
    version: 'v1.0.6',
  },
  {
    changes: [
      '🐛 [App] Activation email was using a wrong URL for matches page',
      '🐛 [App] Language option is now being persisted on the session after reloading the page',
      '🐛 [App] Matches were not being displayed for logged out users',
      '🐛 [App] Logout was still not working correctly on some cases',
    ],
    date: '21/05/2026',
    version: 'v1.0.5',
  },
  {
    changes: ['🐛 [Extras] Removed a flying timestamp'],
    date: '21/05/2026',
    version: 'v1.0.4',
  },
  {
    changes: [
      '[Telegram] Telegram now has a Bolão bot, to be revelead soon',
      '[App] Countdown component now being reused across the app for better consistency',
      '[App] Emails for Signup and Change Password are now in line with the user interface language',
      '[App] General improvements in logging for better error tracking and debugging',
      '[Translations] Updates and missing translations added',
      '[Extras] New team cards with improved design',
      '[Extras] Under-the-hood improvements for champion change flow',
      '[Teams] New team cards with improved design',
      '[Ranking] When theres a tie in all categories, users are now sorted alphabetically by nickname instead of name',
      '🐛 [App] Logout was not working correctly on some cases',
      '🐛 [App] Flags were not displayed correctly on some devices',
      '🐛 [App] Resetting password for non-registered emails was working correctly?',
    ],
    date: '21/05/2026',
    version: 'v1.0.3',
  },
  {
    changes: [
      '[Translations] Updates and missing translations added',
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
      '[Translations] Updates and missing translations added',
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
