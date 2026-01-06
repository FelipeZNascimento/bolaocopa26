export default class WebsocketService {
  public websocketInstance: null | WebSocket;
  private baseUrl: string;
  private onMessage: (this: WebSocket, ev: MessageEvent<unknown>) => void;

  constructor(onWebsocketUpdate: (this: WebSocket, ev: MessageEvent<unknown>) => void) {
    this.baseUrl = import.meta.env.VITE_BOLAO_WS_BASE_URL;
    this.onMessage = onWebsocketUpdate;
    this.websocketInstance = null;
  }

  public close() {
    this.websocketInstance?.close();
  }

  public async connect() {
    const url = `${this.baseUrl}`;
    this.websocketInstance = new WebSocket(url);
    this.websocketInstance.onopen = () => console.log('WS opened');
    this.websocketInstance.onmessage = this.onMessage;
    this.websocketInstance.onclose = this.onClose;

    return this.websocketInstance;
  }

  private onClose() {
    console.log('WS closed, trying to reopen');
  }
}
