// src/services/usuarioService.ts
import { fetchAPI } from './api';

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    username: string;
    ultimo_acceso?: string;
    roles: { id: number; nombre: string }[];
    password?: string; // Agregar para soportar actualización
    currentPassword?: string; // Agregar para soportar validación
}

export interface Rol {
  id: number;
  nombre: string;
}

export const usuarioService = {
  findAll: async (): Promise<Usuario[]> => fetchAPI('/usuario'),
  findById: async (id: number): Promise<Usuario> => fetchAPI(`/usuario/${id}`),
  update: async (id: number, data: Partial<Usuario> & { currentPassword?: string }): Promise<Usuario> =>
    fetchAPI(`/usuario/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            nombre: data.nombre,
            apellido: data.apellido,
            username: data.username,
            email: data.email,
            password: data.password,
            currentPassword: data.currentPassword,
        }),
    }),
  asignarRol: async (idUsuario: number, idRol: number): Promise<Usuario> =>
    fetchAPI(`/usuario/${idUsuario}/roles/${idRol}`, { method: 'POST' }),
  removerRol: async (idUsuario: number, idRol: number): Promise<Usuario> =>
    fetchAPI(`/usuario/${idUsuario}/roles/${idRol}`, { method: 'DELETE' }),
  delete: async (id: number): Promise<void> =>
    fetchAPI(`/usuario/${id}`, { method: 'DELETE' }),
  getRoles: async (): Promise<Rol[]> => fetchAPI('/rol'),
};