export interface INotification {
  detail: string;
  id: string;
  life?: number;
  severity: TNotificationSeverity;
  summary?: string;
}

export type TNotificationSeverity = 'error' | 'info' | 'success';
