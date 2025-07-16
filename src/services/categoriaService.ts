// src/services/categoriaService.ts
import { fetchAPI } from './api';

interface Categoria {
  id: number;
  nombre: string;
}

export const categoriaService = {
  findAll: async (): Promise<Categoria[]> => fetchAPI('/categoria'),
  findOne: async (id: number): Promise<Categoria> => fetchAPI(`/categoria/${id}`),
  create: async (data: { nombre: string }): Promise<Categoria> =>
    fetchAPI('/categoria', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: { nombre: string }): Promise<Categoria> =>
    fetchAPI(`/categoria/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number): Promise<void> =>
    fetchAPI(`/categoria/${id}`, { method: 'DELETE' }),
};