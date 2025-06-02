// src/services/authService.ts
const API_URL = "http://localhost:3000";

const fetchAPI = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }
  return response.json();
};

export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', response.token);
    const user = await fetchAPI('/auth/profile', {
      headers: { Authorization: `Bearer ${response.token}` },
    });
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
  getUser: () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return { id: payload.id, email: payload.email, roles: payload.roles || [] };
        } catch (e) {
            return null;
        }
    }
    return null;
},

  register: async (nombre: string, apellido: string, email: string, password: string) => {
    await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, apellido, email, password }),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getRoles: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return Array.isArray(user.roles)
      ? user.roles.map((role: any) => role.nombre)
      : [];
  },
  
};