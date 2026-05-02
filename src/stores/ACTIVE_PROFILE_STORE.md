# Active Profile Store

The active profile store is a global Pinia store that manages the currently active user profile being viewed in the application.

## Features

- **Profile management**: Stores and manages the active profile data
- **Loading states**: Tracks loading state during profile operations
- **Error handling**: Manages error states for profile operations
- **Global access**: Available throughout the entire app via Pinia store

## Usage

### Import the store

```typescript
import { useActiveProfileStore } from '@/stores/activeProfile';

const activeProfileStore = useActiveProfileStore();
```

### Set active profile

```typescript
const user: IUser = { id: 1, name: 'John Doe', /* ... */ };
activeProfileStore.setActiveProfile(user);
```

### Clear active profile

```typescript
activeProfileStore.setActiveProfile(null);
```

### Handle loading state

```typescript
activeProfileStore.setLoading(true);
// ... perform operation
activeProfileStore.setLoading(false);
```

### Handle errors

```typescript
try {
  // ... some operation
} catch (error) {
  activeProfileStore.setError(error as Error);
}
```

## API Reference

### State

#### `activeProfile: Ref<IUser | null>`

The currently active user profile, or `null` if no profile is selected.

#### `isLoading: Ref<boolean>`

Loading state indicator for profile operations.

#### `error: Ref<Error | null>`

Current error state, or `null` if no error.

### Methods

#### `setActiveProfile(profile: IUser | null)`

Sets the active profile and clears the loading state.

- `profile`: The user profile to set as active, or `null` to clear

#### `setLoading(loadingState: boolean)`

Sets the loading state.

- `loadingState`: `true` to indicate loading, `false` otherwise

#### `setError(newError: Error | null)`

Sets the error state.

- `newError`: The error to set, or `null` to clear the error

## Example: Loading a User Profile

```typescript
import { useActiveProfileStore } from '@/stores/activeProfile';

const activeProfileStore = useActiveProfileStore();

async function loadUserProfile(userId: number) {
  activeProfileStore.setLoading(true);
  activeProfileStore.setError(null);
  
  try {
    const user = await fetchUserById(userId);
    activeProfileStore.setActiveProfile(user);
  } catch (error) {
    activeProfileStore.setError(error as Error);
    activeProfileStore.setActiveProfile(null);
  } finally {
    activeProfileStore.setLoading(false);
  }
}
```

## Example: Checking Active Profile in Components

```typescript
import { computed } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile';

const activeProfileStore = useActiveProfileStore();

const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoading = computed(() => activeProfileStore.isLoading);

// In template
<div v-if="isLoading">Loading...</div>
<div v-else-if="activeProfile">
  {{ activeProfile.name }}
</div>
```

## Implementation Details

- Uses Vue 3 Composition API with `ref`
- Profile data structure defined in `activeProfile.types.ts`
- Automatically clears loading state when profile is set
- Error state must be manually managed
