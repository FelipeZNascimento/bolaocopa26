# Configuration Store

The configuration store is a global Pinia store that manages application-wide configuration settings, including theme preferences, tournament edition data, and user interface preferences.

## Features

- **Theme management**: Dark/light mode with localStorage persistence
- **Tournament tracking**: Current edition and round information
- **UI preferences**: Ranking position and other display settings
- **Loading states**: Tracks loading state during configuration operations
- **Error handling**: Manages error states
- **LocalStorage integration**: Persists user preferences across sessions

## Usage

### Import the store

```typescript
import { useConfigurationStore } from '@/stores/configuration';

const configurationStore = useConfigurationStore();
```

### Theme management

```typescript
// Set theme (automatically updates DOM and persists to localStorage)
configurationStore.setTheme('dark'); // or 'light'

// Check if dark mode is active
const isDark = configurationStore.isDarkMode(); // returns boolean
```

### Tournament configuration

```typescript
// Set current edition
configurationStore.setCurrentEdition(2026);

// Set current round
configurationStore.setCurrentRound(3);

// Set selected round (for filtering)
configurationStore.setSelectedRound(2);

// Set edition start timestamp
configurationStore.setEditionStart(1735689600);
```

### Ranking preferences

```typescript
// Set ranking position preference
configurationStore.setRankingPosition('all'); // 'active' | 'all'
```

### Reset to defaults

```typescript
// Reset all settings to initial state and clear localStorage
configurationStore.setInitialState();
```

## API Reference

### State

#### `theme: Ref<TThemeValue>`

Current theme setting: `'dark'` or `'light'`. Default: `'dark'`.

#### `rankingPosition: Ref<TRankingPositionValue>`

Ranking position filter: `'active'` (only active users) or `'all'`. Default: `'active'`.

#### `currentEdition: Ref<number | null>`

Current tournament edition/season number.

#### `editionStart: Ref<number | null>`

Start timestamp (Unix seconds) of the current edition.

#### `currentRound: Ref<number | null>`

Current active tournament round.

#### `selectedRound: Ref<number | null>`

User-selected round for viewing (may differ from current round).

#### `isLoading: Ref<boolean>`

Loading state indicator.

#### `error: Ref<Error | null>`

Current error state.

### Methods

#### `setTheme(newTheme: TThemeValue)`

Sets the application theme and updates the DOM and localStorage.

- `newTheme`: `'dark'` or `'light'`
- Updates `data-theme` attribute on `<html>` element
- Adds/removes `dark-mode` class
- Persists to localStorage as `'theme-preference'`

#### `isDarkMode(): boolean`

Returns `true` if current theme is dark mode.

#### `setRankingPosition(newValue: TRankingPositionValue)`

Sets the ranking position filter and persists to localStorage.

- `newValue`: `'active'` or `'all'`

#### `setCurrentEdition(season: number)`

Sets the current tournament edition/season.

#### `setCurrentRound(week: number)`

Sets the current active round.

#### `setSelectedRound(week: number)`

Sets the user-selected round for viewing.

#### `setEditionStart(timestamp: number)`

Sets the start timestamp of the edition.

#### `setLoading(loadingState: boolean)`

Sets the loading state.

#### `setError(newError: Error | null)`

Sets the error state.

#### `setInitialState()`

Resets all settings to default values and clears related localStorage entries:
- `theme` → `'dark'`
- `rankingPosition` → `'active'`
- Removes: `'ranking-columns'`, `'theme-preference'`, `'ranking-position'`

## Example: Theme Switcher

```typescript
import { computed } from 'vue';
import { useConfigurationStore } from '@/stores/configuration';

const configurationStore = useConfigurationStore();

const isDark = computed(() => configurationStore.isDarkMode());

function toggleTheme() {
  const newTheme = isDark.value ? 'light' : 'dark';
  configurationStore.setTheme(newTheme);
}
```

## Example: Round Selector

```typescript
import { computed } from 'vue';
import { useConfigurationStore } from '@/stores/configuration';

const configurationStore = useConfigurationStore();

const currentRound = computed(() => configurationStore.currentRound);
const selectedRound = computed(() => configurationStore.selectedRound);

function selectRound(roundNumber: number) {
  configurationStore.setSelectedRound(roundNumber);
  // Fetch data for the selected round
}
```

## Example: Initialize Configuration

```typescript
import { useConfigurationStore } from '@/stores/configuration';

const configurationStore = useConfigurationStore();

async function initializeApp() {
  configurationStore.setLoading(true);
  
  try {
    const config = await fetchAppConfiguration();
    configurationStore.setCurrentEdition(config.edition);
    configurationStore.setCurrentRound(config.currentRound);
    configurationStore.setEditionStart(config.startTimestamp);
    
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme-preference') as TThemeValue;
    if (savedTheme) {
      configurationStore.setTheme(savedTheme);
    }
  } catch (error) {
    configurationStore.setError(error as Error);
  } finally {
    configurationStore.setLoading(false);
  }
}
```

## Implementation Details

- Uses Vue 3 Composition API with `ref`
- Theme changes immediately update DOM attributes and classes
- Preferences are persisted to localStorage for cross-session persistence
- Type definitions in `configuration.types.ts`
- Initial state can be restored with `setInitialState()`
- Theme is applied to `document.documentElement` for global CSS access
