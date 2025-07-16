//src/services/prestamoService.ts
import { fetchAPI } from './api';

export interface Prestamo {
    id: number;
    libro: { id: number; titulo: string };
    usuario: { id: number; nombre: string; apellido: string };
    fecha_prestamo: string;
    fecha_devolucion: string | null;
    devuelto: boolean;
}


export const prestamoService = {
  findAll: async () => fetchAPI('/prestamo'),
  findOne: async (id: number) => fetchAPI(`/prestamo/${id}`),
  findByUsuarioId: async (usuarioId: number) => fetchAPI(`/prestamo/usuario/${usuarioId}`),
  create: async (data: any) =>
    fetchAPI('/prestamo', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: { fecha_devolucion?: Date; devuelto: boolean }) =>
    fetchAPI(`/prestamo/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) => fetchAPI(`/prestamo/${id}`, { method: 'DELETE' }),
};