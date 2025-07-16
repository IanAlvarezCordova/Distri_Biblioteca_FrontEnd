// src/services/authService.ts
import { fetchAPI } from './api';

export const authService = {
  // Login: obtiene token y luego el perfil del usuario
  login: async (email: string, password: string) => {
    const loginResponse = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const { token } = loginResponse;
    if (!token) throw new Error('No se recibió token');

    localStorage.setItem('token', token);

    // Obtener perfil del usuario usando el token
    const user = await fetchAPI('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // Registro de usuario
  register: async (nombre: string, apellido: string, email: string, password: string) => {
    await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });
  },

  // Obtener usuario autenticado desde localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        authService.logout();
        return false;
      }
      return true;
    } catch {
      authService.logout();
      return false;
    }
  },

  // Obtener roles del usuario autenticado
  getRoles: () => {
    const user = authService.getUser();
    return user?.roles || [];
  },
};