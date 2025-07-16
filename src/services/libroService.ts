// src/services/libroService.ts
import { fetchAPI } from './api';

interface Libro {
    id: number;
    titulo: string;
    autor: { id: number; nombre: string };
    categoria: { id: number; nombre: string };
    disponible: boolean;
}

interface DashboardStats {
    librosDisponibles: number;
    prestamos: number;
    devoluciones: number;
    librosPorCategoria: { nombre: string; total: number }[];
    prestamosDevolucionesMensuales: { mes: string; prestamos: number; devoluciones: number }[];
}


export const libroService = {
  findAll: async (): Promise<Libro[]> => fetchAPI('/libro'),
  findById: async (id: number): Promise<Libro> => fetchAPI(`/libro/${id}`),
  create: async (data: Partial<Libro>): Promise<Libro> =>
    fetchAPI('/libro', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: Partial<Libro>): Promise<Libro> =>
    fetchAPI(`/libro/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number): Promise<void> =>
    fetchAPI(`/libro/${id}`, { method: 'DELETE' }),
  getDashboardStats: async (): Promise<DashboardStats> =>
    fetchAPI('/libro/dashboard'),
};