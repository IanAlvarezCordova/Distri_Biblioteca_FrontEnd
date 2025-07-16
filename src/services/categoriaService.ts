// src/services/categoriaService.ts
const API_URL = "http://localhost:3000";

interface Categoria {
    id: number;
    nombre: string;
}

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
    if (response.status === 401 || response.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }

  // Manejar respuestas vacías (como DELETE que devuelve 204)
  if (response.status === 204) return;
  return response.json();
};

export const categoriaService = {
  findAll: async (): Promise<Categoria[]> => {
    return await fetchAPI('/categoria');
  },

  findOne: async (id: number): Promise<Categoria> => {
    return await fetchAPI(`/categoria/${id}`);
  },

  create: async (data: { nombre: string }): Promise<Categoria> => {
    return await fetchAPI('/categoria', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: { nombre: string }): Promise<Categoria> => {
    return await fetchAPI(`/categoria/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    console.log('categoriaService.delete llamado con ID:', id);
    console.log('URL que se va a llamar:', `${API_URL}/categoria/${id}`);
    
    const result = await fetchAPI(`/categoria/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Resultado de la eliminación:', result);
    return result;
  },
};