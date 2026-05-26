
// services/authService.js
import { apiFetch, setToken,setUsername } from './api';

// Login — recibe email y password, retorna el token JWT
export const login = async (username, password) => {
  const data = await apiFetch('/api/Login/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  // Guarda el token para usarlo en las demás peticiones
  if (data.token) setToken(data.token);
  if (data.username) setUsername(data.username);
  return data;
};

// Registro de usuario nuevo
export const registerUser = async ({username,password}) => {
  return await apiFetch('/api/RegisterUser/User', {
    method: 'POST',
    body: JSON.stringify({username,password }),
  });
};