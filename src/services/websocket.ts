export const WEBSOCKET_EVENTS = {
  MATCHES_UPDATED: 'MATCHES_UPDATED',
};

export default class WebsocketService {
  public websocketInstance: null | WebSocket;
  private baseUrl: string;
  private onMessage: (ev: MessageEvent<unknown>) => void;

  constructor(onMessage: (ev: MessageEvent<unknown>) => void) {
    // this.baseUrl = import.meta.env.PROD ? 'wss://apicopa.omegafox.me/' : 'ws://localhost:9002/';
    this.baseUrl = import.meta.env.VITE_BOLAO_WS_BASE_URL;
    this.onMessage = onMessage;
    this.websocketInstance = null;
  }

  public close() {
    this.websocketInstance?.close();
  }

  public async connect() {
    const url = `${this.baseUrl}`;
    this.websocketInstance = new WebSocket(url);
    this.websocketInstance.onopen = () => console.log('WS opened');
    this.websocketInstance.onmessage = (ev) => this.onMessage(ev);
    this.websocketInstance.onclose = () => {
      console.log('WS closed, trying to reopen');
      setTimeout(() => this.connect(), 5000);
    };

    return this.websocketInstance;
  }

  public connectIfNeeded() {
    const state = this.websocketInstance?.readyState;
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) return;
    this.connect();
  }
}
