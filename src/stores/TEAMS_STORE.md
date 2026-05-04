# Teams Store

The teams store is a global Pinia store that manages team data throughout the application.

## Features

- **Team data management**: Stores and manages all team information
- **Loading states**: Tracks loading state during team operations
- **Error handling**: Manages error states for team operations
- **Simple API**: Straightforward methods for common operations
- **Global access**: Available throughout the entire app via Pinia store

## Usage

### Import the store

```typescript
import { useTeamsStore } from '@/stores/teams';

const teamsStore = useTeamsStore();
```

### Set teams data

```typescript
const teams: ITeam[] = [
  /* ... */
];
teamsStore.setTeams(teams);
```

### Handle loading state

```typescript
teamsStore.setLoading(true);
// ... perform operation
teamsStore.setLoading(false);
```

### Handle errors

```typescript
try {
  // ... some operation
} catch (error) {
  teamsStore.setError(error as Error);
}
```

## API Reference

### State

#### `teams: Ref<ITeam[]>`

Array of all team data.

#### `isLoading: Ref<boolean>`

Loading state indicator for team operations.

#### `error: Ref<Error | null>`

Current error state, or `null` if no error.

### Methods

#### `setTeams(newTeams: ITeam[])`

Sets the teams array and clears the loading state.

- `newTeams`: Complete array of team data
- Automatically sets `isLoading` to `false`

#### `setLoading(loadingState: boolean)`

Sets the loading state.

- `loadingState`: `true` to indicate loading, `false` otherwise

#### `setError(newError: Error | null)`

Sets the error state.

- `newError`: The error to set, or `null` to clear the error

## Example: Load Teams

```typescript
import { computed } from 'vue';
import { useTeamsStore } from '@/stores/teams';
import TeamService from '@/services/team';

const teamsStore = useTeamsStore();
const teamService = new TeamService();

const teams = computed(() => teamsStore.teams);
const isLoading = computed(() => teamsStore.isLoading);
const error = computed(() => teamsStore.error);

async function loadTeams() {
  teamsStore.setLoading(true);
  teamsStore.setError(null);

  try {
    await teamService.fetch(); // Service handles store updates
  } catch (error) {
    teamsStore.setError(error as Error);
  }
}
```

## Example: Display Teams List

```typescript
import { computed } from 'vue';
import { useTeamsStore } from '@/stores/teams';

const teamsStore = useTeamsStore();

const teams = computed(() => teamsStore.teams);
const isLoading = computed(() => teamsStore.isLoading);

// In template
<div v-if="isLoading">Loading teams...</div>
<div v-else>
  <div v-for="team in teams" :key="team.id">
    <img :src="team.flagUrl" :alt="team.name" />
    {{ team.name }}
  </div>
</div>
```

## Example: Find Team by ID

```typescript
import { computed } from 'vue';
import { useTeamsStore } from '@/stores/teams';

const teamsStore = useTeamsStore();

function getTeamById(teamId: number) {
  return teamsStore.teams.find((team) => team.id === teamId);
}

// Or as computed property
const selectedTeam = computed(() => teamsStore.teams.find((team) => team.id === selectedTeamId.value));
```

## Example: Filter Teams

```typescript
import { computed } from 'vue';
import { useTeamsStore } from '@/stores/teams';

const teamsStore = useTeamsStore();

// Filter teams by group
const getTeamsByGroup = (group: string) => {
  return teamsStore.teams.filter((team) => team.group === group);
};

// All groups
const groups = computed(() => {
  const uniqueGroups = new Set(teamsStore.teams.map((t) => t.group));
  return Array.from(uniqueGroups).sort();
});
```

## Implementation Details

- Uses Vue 3 Composition API with `ref`
- Type definitions in `teams.types.ts`
- Automatically clears loading state when teams are set
- Error state must be manually managed
- Simple, focused API for team data management
- Team data typically includes: id, name, flag/logo URLs, group, etc.
