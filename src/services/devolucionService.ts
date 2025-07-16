//src/services/devolucionService.ts
import { fetchAPI } from './api';

export const devolucionService = {
  findAll: async () => fetchAPI('/devoluciones'),
  findOne: async (id: number) => fetchAPI(`/devoluciones/${id}`),
  create: async (data: { prestamoId: number }) =>
    fetchAPI('/devoluciones', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: { prestamoId: number; fecha_devolucion: Date }) =>
    fetchAPI(`/devoluciones/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) =>
    fetchAPI(`/devoluciones/${id}`, { method: 'DELETE' }),
};