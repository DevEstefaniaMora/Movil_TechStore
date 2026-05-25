// services/categoryService.js
import { apiFetch } from './api';

export const getCategories = () =>
  apiFetch('/api/Category');

export const createCategory = (category) =>
  apiFetch('/api/Category', {
    method: 'POST',
    body: JSON.stringify(category),
  });

export const getProductsByCategory = (id) =>
  apiFetch(`/api/Category/${id}/products`);

export const updateCategory = (category) =>
  apiFetch('/api/Category', {
    method: 'PATCH',
    body: JSON.stringify(category),
  });

export const deleteCategory = (id) =>
  apiFetch(`/api/Category/id?id=${id}`, {
    method: 'DELETE',
  });