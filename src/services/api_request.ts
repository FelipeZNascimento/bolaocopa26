export default class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_BOLAO_BASE_URL || '') {
    this.baseUrl = baseUrl;
  }

  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const requestOptions: RequestInit = {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...headers },
      method: 'GET',
    };
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const error = await response.json();
      // get error message from body or default to response status
      throw new Error(error);
    }

    const jsonResponse: { data: T } = await response.json();
    return jsonResponse.data;
  }

  public async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const requestOptions: RequestInit = {
      body: JSON.stringify(data),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...headers },
      method: 'POST',
    };
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const errrorObject = await response.json();
      throw new Error(errrorObject.message);
    }
    const jsonResponse: { data: T } = await response.json();
    return jsonResponse.data;
  }

  public async websocket(endpoint: string) {
    const url = `${this.baseUrl}${endpoint}`;
    return new WebSocket(url);
  }
}
