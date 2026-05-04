# Ranking Store

The ranking store is a global Pinia store that manages ranking data for both season-wide and round-by-round rankings, along with UI preferences for displaying the ranking table.

## Features

- **Dual ranking views**: Separate data for season ranking and round-by-round rankings
- **Independent loading states**: Separate loading states for season and rounds data
- **UI preferences**: Customizable column display and row spacing
- **LocalStorage integration**: Persists display preferences across sessions
- **Error handling**: Separate error states for season and rounds
- **Global access**: Available throughout the entire app via Pinia store

## Usage

### Import the store

```typescript
import { useRankingStore } from '@/stores/ranking';

const rankingStore = useRankingStore();
```

### Set ranking data

```typescript
// Set season-wide ranking
const seasonData: IRankingLine[] = [
  /* ... */
];
rankingStore.setSeason(seasonData);

// Set round-by-round rankings
const roundsData: IRoundRanking[] = [
  /* ... */
];
rankingStore.setRounds(roundsData);
```

### Manage UI preferences

```typescript
// Set column display option
rankingStore.setColumnsOption('complete'); // 'minimal' | 'complete'

// Set row spacing
rankingStore.setRowSpacing('small'); // 'small' | 'medium' | 'large'
```

### Reset to defaults

```typescript
// Reset all preferences to initial state and clear localStorage
rankingStore.setInitialState();
```

### Handle loading states

```typescript
// Season ranking loading
rankingStore.setLoadingSeason(true);
// ... fetch data
rankingStore.setLoadingSeason(false);

// Rounds ranking loading
rankingStore.setLoadingRounds(true);
// ... fetch data
rankingStore.setLoadingRounds(false);
```

### Handle errors

```typescript
// Season error
rankingStore.setErrorSeason(error as Error);

// Rounds error
rankingStore.setErrorRounds(error as Error);
```

## API Reference

### State

#### `seasonRanking: Ref<IRankingLine[]>`

Season-wide ranking data. Empty array if not loaded.

#### `roundsRanking: Ref<IRoundRanking[]>`

Round-by-round ranking data. Empty array if not loaded.

#### `columnsOption: Ref<TColumnsValue>`

Column display preference: `'minimal'` or `'complete'`. Default: `'complete'`.

#### `rowSpacing: Ref<TRowSpacingValue>`

Row spacing preference: `'small'`, `'medium'`, or `'large'`. Default: `'small'`.

#### `isLoadingSeason: Ref<boolean>`

Loading state for season ranking data.

#### `isLoadingRounds: Ref<boolean>`

Loading state for rounds ranking data.

#### `errorSeason: Ref<Error | null>`

Error state for season ranking operations.

#### `errorRounds: Ref<Error | null>`

Error state for rounds ranking operations.

### Methods

#### `setSeason(newSeasonRanking: IRankingLine[])`

Sets the season-wide ranking data. Ensures data is an array.

#### `setRounds(newRoundsRanking: IRoundRanking[])`

Sets the round-by-round ranking data. Ensures data is an array.

#### `setColumnsOption(newValue: TColumnsValue)`

Sets the column display preference and persists to localStorage as `'ranking-columns'`.

- `newValue`: `'minimal'` or `'complete'`

#### `setRowSpacing(newValue: TRowSpacingValue)`

Sets the row spacing preference and persists to localStorage as `'ranking-spacing'`.

- `newValue`: `'small'`, `'medium'`, or `'large'`

#### `setLoadingSeason(loadingState: boolean)`

Sets the loading state for season ranking.

#### `setLoadingRounds(loadingState: boolean)`

Sets the loading state for rounds ranking.

#### `setErrorSeason(newError: Error | null)`

Sets the error state for season ranking.

#### `setErrorRounds(newError: Error | null)`

Sets the error state for rounds ranking.

#### `setInitialState()`

Resets all preferences to default values and clears related localStorage entries:

- `columnsOption` → `'complete'`
- `rowSpacing` → `'small'`
- Removes: `'ranking-columns'`, `'ranking-spacing'`, `'ranking-position'`

## Example: Load Season Ranking

```typescript
import { computed } from 'vue';
import { useRankingStore } from '@/stores/ranking';
import RankingService from '@/services/ranking';

const rankingStore = useRankingStore();
const rankingService = new RankingService();

const seasonRanking = computed(() => rankingStore.seasonRanking);
const isLoading = computed(() => rankingStore.isLoadingSeason);
const error = computed(() => rankingStore.errorSeason);

async function loadSeasonRanking() {
  rankingStore.setLoadingSeason(true);
  rankingStore.setErrorSeason(null);

  try {
    await rankingService.fetchSeason(); // Service handles store updates
  } catch (error) {
    rankingStore.setErrorSeason(error as Error);
  }
}
```

## Example: UI Preference Controls

```typescript
import { computed } from 'vue';
import { useRankingStore } from '@/stores/ranking';

const rankingStore = useRankingStore();

const columnsOption = computed(() => rankingStore.columnsOption);
const rowSpacing = computed(() => rankingStore.rowSpacing);

function toggleColumns() {
  const newValue = columnsOption.value === 'complete' ? 'minimal' : 'complete';
  rankingStore.setColumnsOption(newValue);
}

function changeSpacing(spacing: TRowSpacingValue) {
  rankingStore.setRowSpacing(spacing);
}
```

## Example: Display Round Rankings

```typescript
import { computed } from 'vue';
import { useRankingStore } from '@/stores/ranking';

const rankingStore = useRankingStore();

const roundsRanking = computed(() => rankingStore.roundsRanking);
const isLoading = computed(() => rankingStore.isLoadingRounds);

// Get ranking for a specific round
const getRoundRanking = (roundNumber: number) => {
  return roundsRanking.value.find(r => r.round === roundNumber);
};

// In template
<div v-if="isLoading">Loading rounds...</div>
<div v-else>
  <div v-for="round in roundsRanking" :key="round.round">
    Round {{ round.round }}: {{ round.rankings.length }} users
  </div>
</div>
```

## Example: Initialize Preferences from LocalStorage

```typescript
import { onMounted } from 'vue';
import { useRankingStore } from '@/stores/ranking';

const rankingStore = useRankingStore();

onMounted(() => {
  // Load preferences from localStorage
  const savedColumns = localStorage.getItem('ranking-columns') as TColumnsValue;
  const savedSpacing = localStorage.getItem('ranking-spacing') as TRowSpacingValue;

  if (savedColumns) {
    rankingStore.setColumnsOption(savedColumns);
  }

  if (savedSpacing) {
    rankingStore.setRowSpacing(savedSpacing);
  }
});
```

## Implementation Details

- Uses Vue 3 Composition API with `ref`
- Type definitions in `ranking.types.ts` and `configuration.types.ts`
- Separate loading and error states for season and rounds data
- UI preferences automatically persist to localStorage
- Data arrays are validated on set (ensures array type)
- Initial state can be restored with `setInitialState()`
- Column and spacing preferences affect table rendering in components
