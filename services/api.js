// HTTP + tu IP de ipconfig + puerto 5031
export const BASE_URL = 'http://192.168.0.18:5031';

let authToken = '';
let authUsername = '';

export const setToken = (token) => { authToken = token; };
export const getToken = () => authToken;
export const setUsername = (username) => { authUsername = username; }; // ← nuevo
export const getUsername = ()         => authUsername;  

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 60000);

  let response;
  try {
    response = await fetch(url, { ...options, headers, signal: ctrl.signal });
  } catch (e) {
    clearTimeout(t);
    if (e.name === 'AbortError') throw new Error('Timeout: API no responde');
    throw e;
  }
  clearTimeout(t);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    return data;
  }
  return response.text();
};