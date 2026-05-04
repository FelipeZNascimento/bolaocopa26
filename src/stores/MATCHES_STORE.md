# Matches Store

The matches store is a global Pinia store that manages match data, scores, and user bets throughout the application.

## Features

- **Match data management**: Stores and manages all match information
- **User bet tracking**: Tracks the logged-in user's bets for each match
- **Granular update tracking**: Tracks which specific matches are being updated
- **Loading states**: Global loading state for match operations
- **Error handling**: Manages error states for match operations
- **Bet management**: Update and reset user bets
- **Global access**: Available throughout the entire app via Pinia store

## Usage

### Import the store

```typescript
import { useMatchesStore } from '@/stores/matches';

const matchesStore = useMatchesStore();
```

### Set matches data

```typescript
const matches: IMatch[] = [
  /* ... */
];
matchesStore.setMatches(matches);
```

### Update logged user bets

```typescript
// Update a specific match bet
matchesStore.updateLoggedUserBets(matchId, {
  scoreHome: 2,
  scoreAway: 1,
});
```

### Reset logged user bets

```typescript
// Clear all user bets (e.g., on logout)
matchesStore.resetLoggedUserBets();
```

### Track updating matches

```typescript
// Mark a match as updating
matchesStore.setUpdatingMatch(true, matchId);

// Mark as done updating
matchesStore.setUpdatingMatch(false, matchId);

// Check if a match is updating
const isUpdating = matchesStore.updatingMatches.includes(matchId);
```

### Handle loading state

```typescript
matchesStore.setLoading(true);
// ... perform operation
matchesStore.setLoading(false);
```

### Handle errors

```typescript
try {
  // ... some operation
} catch (error) {
  matchesStore.setError(error as Error);
}
```

## API Reference

### State

#### `matches: Ref<IMatch[]>`

Array of all match data.

#### `isLoading: Ref<boolean>`

Global loading state for match operations.

#### `updatingMatches: Ref<number[]>`

Array of match IDs currently being updated (for granular loading indicators).

#### `error: Ref<Error | null>`

Current error state.

### Methods

#### `setMatches(newMatches: IMatch[])`

Sets the matches array.

- `newMatches`: Complete array of match data

#### `updateLoggedUserBets(matchId: number, bet: { scoreHome: number | null; scoreAway: number | null })`

Updates the logged-in user's bet for a specific match.

- `matchId`: ID of the match to update
- `bet`: Object containing `scoreHome` and `scoreAway` predictions
- Merges new bet data with existing bet data for the match

#### `resetLoggedUserBets()`

Clears all logged user bets by setting `loggedUserBets` to `null` for all matches.

#### `setUpdatingMatch(loadingState: boolean, matchId: number | null)`

Tracks individual match update states.

- `loadingState`: `true` to add match to updating list, `false` to remove
- `matchId`: ID of the match being updated
- Adds/removes match ID from `updatingMatches` array

#### `setLoading(loadingState: boolean)`

Sets the global loading state.

#### `setError(newError: Error | null)`

Sets the error state.

## Example: Load Matches

```typescript
import { computed } from 'vue';
import { useMatchesStore } from '@/stores/matches';
import MatchService from '@/services/match';

const matchesStore = useMatchesStore();
const matchService = new MatchService();

const matches = computed(() => matchesStore.matches);
const isLoading = computed(() => matchesStore.isLoading);

async function loadMatches() {
  matchesStore.setLoading(true);
  matchesStore.setError(null);

  try {
    await matchService.fetch(); // Service handles store updates
  } catch (error) {
    matchesStore.setError(error as Error);
  }
}
```

## Example: Submit Match Bet

```typescript
import { useMatchesStore } from '@/stores/matches';
import BetService from '@/services/bet';

const matchesStore = useMatchesStore();
const betService = new BetService();

async function submitBet(matchId: number, scoreHome: number, scoreAway: number) {
  // Track this specific match as updating
  matchesStore.setUpdatingMatch(true, matchId);

  try {
    await betService.update(matchId, { scoreHome, scoreAway });

    // Optimistically update the UI
    matchesStore.updateLoggedUserBets(matchId, { scoreHome, scoreAway });
  } catch (error) {
    matchesStore.setError(error as Error);
  } finally {
    matchesStore.setUpdatingMatch(false, matchId);
  }
}
```

## Example: Display Match with Loading State

```typescript
import { computed } from 'vue';
import { useMatchesStore } from '@/stores/matches';

const matchesStore = useMatchesStore();

const match = computed(() => matchesStore.matches.find(m => m.id === matchId));
const isUpdating = computed(() =>
  matchesStore.updatingMatches.includes(matchId)
);

// In template
<div>
  <div v-if="isUpdating">Updating...</div>
  <div v-else>
    {{ match.home.team.name }} vs {{ match.away.team.name }}
  </div>
</div>
```

## Example: Reset Bets on Logout

```typescript
import { useMatchesStore } from '@/stores/matches';

const matchesStore = useMatchesStore();

function logout() {
  // Clear all user bets
  matchesStore.resetLoggedUserBets();

  // ... other logout logic
}
```

## Implementation Details

- Uses Vue 3 Composition API with `ref`
- Type definitions in `matches.types.ts`
- `updatingMatches` array allows for per-match loading indicators
- `updateLoggedUserBets` merges new bet data with existing data
- `resetLoggedUserBets` sets all `loggedUserBets` to `null` but preserves match data
- Match data includes scores, team info, status, and bet information
