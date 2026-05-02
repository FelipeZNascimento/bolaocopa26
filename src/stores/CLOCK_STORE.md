# Clock Store

The clock store is a global Pinia store that manages time-related functionality throughout the application, including real-time clock updates, countdowns, and date/time formatting.

## Features

- **Real-time clock**: Updates every second with current time and timestamp
- **Countdown timer**: Calculate time remaining until a target timestamp
- **Date/time formatting**: Format timestamps in Brazilian Portuguese format
- **Round names**: Get display names for tournament rounds
- **Lifecycle management**: Start and stop clock updates

## Usage

### Import the store

```typescript
import { useClockStore } from '@/stores/clock';

const clockStore = useClockStore();
```

### Start and stop the clock

```typescript
// Start the clock (updates every second)
clockStore.startClock();

// Stop the clock when no longer needed
clockStore.stopClock();
```

### Get formatted time

```typescript
// Current time
const currentTime = clockStore.getFormattedTime(); // "14:30"

// Custom timestamp (Unix timestamp in seconds)
const customTime = clockStore.getFormattedTime(1735689600); // "12:00"
```

### Get formatted date

```typescript
// Current date
const currentDate = clockStore.getFormattedDate(); // "02/05"

// Custom timestamp
const customDate = clockStore.getFormattedDate(1735689600); // "31/12"
```

### Get countdown

```typescript
// Returns a formatted countdown string
const countdown = clockStore.getCountdown(targetTimestamp);
// Examples: "2 dias, 3 horas, 45 minutos" or "" if target is in the past
```

### Get round name

```typescript
const roundName = clockStore.getRoundName(1); // "Fase de Grupos"
const roundName = clockStore.getRoundName(5); // "Oitavas de Final"
```

## API Reference

### State

#### `currentTime: Ref<Date>`

Current time as a Date object, updated every second.

#### `currentTimestamp: Ref<number>`

Current Unix timestamp in seconds, updated every second.

### Methods

#### `startClock()`

Starts the clock timer that updates every second. Automatically calls `updateTime()` initially.

#### `stopClock()`

Stops the clock timer and clears the interval.

#### `getFormattedTime(customTimestamp?: number): string`

Returns formatted time in 24-hour format.

- `customTimestamp`: Optional Unix timestamp in seconds. If not provided, uses current time
- Returns: Time string in format "HH:MM" (e.g., "14:30")

#### `getFormattedDate(customTimestamp?: number): string`

Returns formatted date in Brazilian format.

- `customTimestamp`: Optional Unix timestamp in seconds. If not provided, uses current date
- Returns: Date string in format "DD/MM" (e.g., "02/05")

#### `getCountdown(targetTimestamp: number): string`

Calculates and formats the time remaining until a target timestamp.

- `targetTimestamp`: Unix timestamp in seconds
- Returns: Formatted countdown string (e.g., "2 dias, 3 horas, 45 minutos") or empty string if target is in the past

#### `getRoundName(round: number): string`

Gets the display name for a tournament round.

- `round`: Round number
- Returns: Display name from ROUNDS constant or "Rodada {number}" as fallback

## Example: Display Live Clock

```typescript
import { computed, onMounted, onUnmounted } from 'vue';
import { useClockStore } from '@/stores/clock';

const clockStore = useClockStore();

onMounted(() => {
  clockStore.startClock();
});

onUnmounted(() => {
  clockStore.stopClock();
});

const currentTime = computed(() => clockStore.currentTime);
const formattedTime = computed(() => clockStore.getFormattedTime());
```

## Example: Match Countdown

```typescript
import { computed } from 'vue';
import { useClockStore } from '@/stores/clock';

const clockStore = useClockStore();

const match = { startTimestamp: 1735689600 };

const countdown = computed(() => {
  const timeUntilMatch = clockStore.getCountdown(match.startTimestamp);
  return timeUntilMatch || 'Jogo começou';
});

// Template
<div>{{ countdown }}</div>
```

## Example: Display Match Date and Time

```typescript
import { useClockStore } from '@/stores/clock';

const clockStore = useClockStore();

const match = { startTimestamp: 1735689600, round: 1 };

const matchDate = clockStore.getFormattedDate(match.startTimestamp);
const matchTime = clockStore.getFormattedTime(match.startTimestamp);
const roundName = clockStore.getRoundName(match.round);

// Template
<div>{{ roundName }} - {{ matchDate }} às {{ matchTime }}</div>
```

## Implementation Details

- Uses `setInterval` for automatic updates every 1000ms (1 second)
- Timestamps are in Unix format (seconds since epoch)
- Uses Brazilian Portuguese locale for date/time formatting
- Round names are defined in `@/constants/rounds`
- Timer is stored as `window.setInterval` for proper cleanup
- Remember to call `stopClock()` when component unmounts to prevent memory leaks
