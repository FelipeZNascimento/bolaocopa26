# Notification Service

The notification service is a global Pinia store that manages toast notifications throughout the app using PrimeVue's Toast component.

## Features

- **Three urgency types**: `error`, `info` (message), and `success`
- **Queue management**: Automatically manages notification lifecycle
- **Auto-dismiss**: Notifications auto-dismiss after a configurable duration (default: 3000ms)
- **Global access**: Available throughout the entire app via Pinia store

## Usage

### Import the store

```typescript
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
```

### Show notifications

#### Success notification

```typescript
notificationStore.success('Operation completed successfully!');
notificationStore.success('User created', 'Success', 5000); // Custom summary and duration
```

#### Error notification

```typescript
notificationStore.error('Something went wrong!');
notificationStore.error('Failed to save data', 'Error', 4000); // Custom summary and duration
```

#### Info/Message notification

```typescript
notificationStore.message('Please check your email for confirmation');
notificationStore.message('Processing...', 'Info', 3000); // Custom summary and duration
```

### Clear all notifications

```typescript
notificationStore.clearAll();
```

## API Reference

### Methods

#### `success(detail: string, summary?: string, life?: number)`

Shows a success notification.

- `detail`: The main message to display (required)
- `summary`: The title/summary (optional, defaults to "Success")
- `life`: Duration in milliseconds (optional, defaults to 3000)

#### `error(detail: string, summary?: string, life?: number)`

Shows an error notification.

- `detail`: The main message to display (required)
- `summary`: The title/summary (optional, defaults to "Error")
- `life`: Duration in milliseconds (optional, defaults to 3000)

#### `message(detail: string, summary?: string, life?: number)`

Shows an info notification.

- `detail`: The main message to display (required)
- `summary`: The title/summary (optional, defaults to "Info")
- `life`: Duration in milliseconds (optional, defaults to 3000)

#### `clearAll()`

Removes all notifications from the screen.

## Example: Form Submission

```typescript
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();

async function handleSubmit() {
  try {
    await apiCall();
    notificationStore.success('Form submitted successfully!');
  } catch (error) {
    notificationStore.error(error.message || 'Failed to submit form');
  }
}
```

## Example: Multiple Notifications

```typescript
// Show multiple notifications - they will queue automatically
notificationStore.message('Starting upload...');
setTimeout(() => {
  notificationStore.success('Upload complete!');
}, 2000);
```

## Implementation Details

- Uses PrimeVue's `useToast` composable
- Each notification gets a unique ID for queue management
- Notifications are automatically removed from the queue after their lifetime expires
- The `<PrimeToast />` component must be present in App.vue (already configured)
