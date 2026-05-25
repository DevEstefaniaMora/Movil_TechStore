import { apiFetch } from './api';

export const getUsers = () =>
  apiFetch('/api/Users');

export const createUser = (users) =>
  apiFetch('/api/Users', {
    method: 'POST',
    body: JSON.stringify(users),
  });

export const updateUsers = (users) =>
  apiFetch('/api/Users', {
    method: 'PATCH',
    body: JSON.stringify(users),
  });

