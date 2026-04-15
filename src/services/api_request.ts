export default class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_BOLAO_BASE_URL || '') {
    this.baseUrl = baseUrl;
  }

  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    console.log('endpoint: ', endpoint);
    const requestOptions: RequestInit = {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...headers },
      method: 'GET',
    };
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorObject = await response.json();
        errorMessage = errorObject.message || errorObject.error || errorMessage;
      } catch {
        // If JSON parsing fails, use the default error message
      }
      throw new Error(errorMessage);
    }

    const jsonResponse: { data: T } = await response.json();
    return jsonResponse.data;
  }

  public async post<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    const requestOptions: RequestInit = {
      body: JSON.stringify(data),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...headers },
      method: 'POST',
    };
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorObject = await response.json();
        errorMessage = errorObject.message || errorObject.error || errorMessage;
      } catch {
        // If JSON parsing fails, use the default error message
      }
      throw new Error(errorMessage);
    }
    const jsonResponse: { data: T } = await response.json();
    return jsonResponse.data;
  }

  public async websocket(endpoint: string) {
    const url = `${this.baseUrl}${endpoint}`;
    return new WebSocket(url);
  }
}
