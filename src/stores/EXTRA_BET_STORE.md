# Extra Bet Store

The extra bet store is a global Pinia store that manages special bets (extra bets) such as tournament champion, top scorer, best defense, and best offense predictions.

## Features

- **Multiple bet types**: Champion, top scorer, best player, offense, defense
- **Grouped data views**: Bets organized by team, player, or user
- **Active profile bets**: Tracks the current user's extra bets
- **Results tracking**: Stores and manages extra bet results
- **Dual loading states**: Separate states for loading and updating
- **Error handling**: Manages error states for extra bet operations
- **Global access**: Available throughout the entire app via Pinia store

## Usage

### Import the store

```typescript
import { useExtraBetStore } from '@/stores/extraBet';

const extraBetStore = useExtraBetStore();
```

### Set extra bets data

```typescript
// Set bets grouped by team
const teamBets: ITeamWithExtras[] = [/* ... */];
extraBetStore.setExtraBetsByTeam(teamBets);

// Set top scorer bets grouped by player
const playerBets: IPlayerWithExtras[] = [/* ... */];
extraBetStore.setTopScorerBetsByPlayer(playerBets);

// Set bets grouped by user
const userBets: IUserWithExtras[] = [/* ... */];
extraBetStore.setExtraBetsByUser(userBets);

// Set active profile's bets
const activeBets: IExtraBet[] = [/* ... */];
extraBetStore.setActiveProfileBets(activeBets);

// Set extra bet results
const results: IExtraResults[] = [/* ... */];
extraBetStore.setResults(results);
```

### Manage loading states

```typescript
// Set loading state (fetching data)
extraBetStore.setLoading(true);

// Set updating state (submitting bet changes)
extraBetStore.setUpdating(true);
```

### Reset active profile bets

```typescript
// Clear the active profile's bets (e.g., on logout)
extraBetStore.resetActiveProfileBets();
```

### Handle errors

```typescript
try {
  // ... some operation
} catch (error) {
  extraBetStore.setError(error as Error);
}
```

## API Reference

### State

#### `extraBetsByTeam: Ref<ITeamWithExtras[]>`

All extra bets grouped by team (excludes top scorer bets).

#### `topScorerBetsByPlayer: Ref<IPlayerWithExtras[]>`

Top scorer bets grouped by player.

#### `extraBetsByUser: Ref<IUserWithExtras[]>`

All extra bets grouped by user.

#### `activeProfileBets: Ref<IExtraBet[]>`

The active user's extra bets (flat array).

#### `results: Ref<IExtraResults[]>`

Extra bet results/outcomes.

#### `isLoading: Ref<boolean>`

Loading state for fetching extra bet data.

#### `isUpdating: Ref<boolean>`

Loading state for updating/submitting extra bets.

#### `error: Ref<Error | null>`

Current error state.

### Methods

#### `setExtraBetsByTeam(newValue: ITeamWithExtras[])`

Sets extra bets grouped by team.

#### `setTopScorerBetsByPlayer(newExtras: IPlayerWithExtras[])`

Sets top scorer bets grouped by player.

#### `setExtraBetsByUser(newExtras: IUserWithExtras[])`

Sets extra bets grouped by user.

#### `setActiveProfileBets(newExtras: IExtraBet[])`

Sets the active profile's extra bets.

#### `setResults(newExtras: IExtraResults[])`

Sets the extra bet results.

#### `resetActiveProfileBets()`

Clears the active profile's bets (sets to empty array).

#### `setLoading(loadingState: boolean)`

Sets the loading state for data fetching.

#### `setUpdating(loadingState: boolean)`

Sets the updating state for bet submission.

#### `setError(newError: Error | null)`

Sets the error state.

## Example: Fetch and Display Extra Bets

```typescript
import { computed } from 'vue';
import { useExtraBetStore } from '@/stores/extraBet';
import ExtraBetService from '@/services/extra_bet';

const extraBetStore = useExtraBetStore();
const extraBetService = new ExtraBetService();

const isLoading = computed(() => extraBetStore.isLoading);
const teamBets = computed(() => extraBetStore.extraBetsByTeam);
const activeProfileBets = computed(() => extraBetStore.activeProfileBets);

async function loadExtraBets() {
  extraBetStore.setLoading(true);
  extraBetStore.setError(null);
  
  try {
    await extraBetService.fetch(); // Service handles store updates
  } catch (error) {
    extraBetStore.setError(error as Error);
  }
}

// In template
<div v-if="isLoading">Loading...</div>
<div v-else>
  <div v-for="teamBet in teamBets" :key="teamBet.team.id">
    {{ teamBet.team.name }}: {{ teamBet.bets.length }} bets
  </div>
</div>
```

## Example: Submit Extra Bet

```typescript
import { useExtraBetStore } from '@/stores/extraBet';
import ExtraBetService from '@/services/extra_bet';

const extraBetStore = useExtraBetStore();
const extraBetService = new ExtraBetService();

async function submitExtraBet(extraType: number, teamId: number) {
  extraBetStore.setUpdating(true);
  
  try {
    await extraBetService.update({ extraType, teamId });
    await extraBetService.fetch(); // Refresh data
  } catch (error) {
    extraBetStore.setError(error as Error);
  } finally {
    extraBetStore.setUpdating(false);
  }
}
```

## Example: Display User's Current Bets

```typescript
import { computed } from 'vue';
import { useExtraBetStore } from '@/stores/extraBet';
import { EXTRA_BETS_VALUES } from '@/constants/bets';

const extraBetStore = useExtraBetStore();

const activeProfileBets = computed(() => extraBetStore.activeProfileBets);

const championBet = computed(() => 
  activeProfileBets.value.find(bet => bet.extraType === EXTRA_BETS_VALUES.CHAMPION)
);

const topScorerBet = computed(() => 
  activeProfileBets.value.find(bet => bet.extraType === EXTRA_BETS_VALUES.TOP_SCORER)
);

// In template
<div v-if="championBet">
  Your champion pick: {{ championBet.team.name }}
</div>
<div v-if="topScorerBet">
  Your top scorer pick: {{ topScorerBet.player.name }}
</div>
```

## Implementation Details

- Uses Vue 3 Composition API with `ref`
- Type definitions in `extraBet.types.ts`
- Separate loading states for fetching (`isLoading`) and updating (`isUpdating`)
- Data can be viewed in three different groupings: by team, by player, by user
- Active profile bets are stored separately for easy access
- Results are sorted by `extraType` when set
- Extra bet types defined in `@/constants/bets`
