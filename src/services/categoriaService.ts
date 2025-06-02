// src/services/categoriaService.ts
const API_URL = "http://localhost:3000";

const fetchAPI = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }
  return response.json();
};

export const categoriaService = {
  findAll: async () => {
    return await fetchAPI('/categoria');
  },

  findOne: async (id: number) => {
    return await fetchAPI(`/categoria/${id}`);
  },

  create: async (data: { nombre: string }) => {
    return await fetchAPI('/categoria', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: { nombre: string }) => {
    return await fetchAPI(`/categoria/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return await fetchAPI(`/categoria/${id}`, {
      method: 'DELETE',
    });
  },
};