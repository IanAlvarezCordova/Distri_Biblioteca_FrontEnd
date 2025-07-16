// src/services/authService.ts
import { fetchAPI } from './api';

export const authService = {
  // Función de test para verificar conectividad
  testConnection: async () => {
    try {
      console.log('🧪 Probando conexión al backend...');
      // Usar el proxy en desarrollo
      const apiUrl = import.meta.env.PROD ? 'http://localhost:3000' : '/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      });
      
      console.log('🧪 Respuesta directa:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const text = await response.text();
      console.log('🧪 Contenido de respuesta:', text);
      
      return true;
    } catch (error) {
      console.error('🧪 Error en test directo:', error);
      console.error('🧪 Detalles del error:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      return false;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      
      // El backend ahora retorna { success: true, message: "Login exitoso", data: { token, user } }
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  register: async (nombre: string, apellido: string, email: string, password: string) => {
    try {
      await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          nombre: nombre.trim(), 
          apellido: apellido.trim(), 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await fetchAPI('/auth/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const { token: newToken, user } = response;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Error al renovar token:', error);
      authService.logout(); // Si falla el refresh, cerrar sesión
      throw error;
    }
  },

  getUser: () => {
    const token = localStorage.getItem('token');
    console.log('🔍 getUser - token existe:', !!token);
    
    if (token) {
      try {
        console.log('🔍 getUser - token:', token.substring(0, 50) + '...');
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 getUser - payload decodificado:', payload);
        
        // Verificar si el token no ha expirado
        if (payload.exp && payload.exp < Date.now() / 1000) {
          console.log('❌ getUser - token expirado');
          authService.logout();
          return null;
        }
        
        const user = { 
          id: payload.id, 
          email: payload.email, 
          nombre: payload.nombre,
          apellido: payload.apellido,
          roles: payload.roles || [] 
        };
        console.log('✅ getUser - usuario devuelto:', user);
        return user;
      } catch (e) {
        console.error('❌ getUser - error al decodificar token:', e);
        authService.logout();
        return null;
      }
    }
    console.log('❌ getUser - no hay token');
    return null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Removemos la redirección forzada que causa el problema
    // window.location.href = '/login'; 
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    console.log('🔍 isAuthenticated - token existe:', !!token);
    
    if (!token) {
      console.log('❌ isAuthenticated - no hay token');
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 isAuthenticated - payload:', payload);
      
      // Verificar si el token no ha expirado
      if (payload.exp && payload.exp < Date.now() / 1000) {
        console.log('❌ isAuthenticated - token expirado');
        authService.logout();
        return false;
      }
      
      console.log('✅ isAuthenticated - token válido');
      return true;
    } catch (e) {
      console.error('❌ isAuthenticated - error al decodificar:', e);
      authService.logout();
      return false;
    }
  },

  getRoles: () => {
    const user = authService.getUser();
    return user?.roles || [];
  },
};