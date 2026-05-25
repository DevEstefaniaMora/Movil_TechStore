// services/productService.js
import { apiFetch } from './api';

export const getProducts = () =>
  apiFetch('/api/Product');

export const createProduct = (product) =>
  apiFetch('/api/Product', {
    method: 'POST',
    body: JSON.stringify(product),
  });

export const updateProduct = (product) =>
  apiFetch('/api/Product', {
    method: 'PATCH',
    body: JSON.stringify(product),
  });

export const deleteProduct = (id) =>
  apiFetch(`/api/Product/id?id=${id}`, {
    method: 'DELETE',
  });