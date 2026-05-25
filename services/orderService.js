// services/orderService.js
import { apiFetch } from './api';

export const getOrders = () =>
  apiFetch('/api/Orders');

export const createOrder = (orderRequest) =>
  apiFetch('/api/Orders', {
    method: 'POST',
    body: JSON.stringify(orderRequest),
  });

export const updateOrder = (order) =>
  apiFetch('/api/Orders', {
    method: 'PATCH',
    body: JSON.stringify(order),
  });

export const deleteOrder = (id) =>
  apiFetch(`/api/Orders/id?id=${id}`, {
    method: 'DELETE',
  });