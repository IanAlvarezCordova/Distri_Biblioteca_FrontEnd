//src/services/prestamoService.ts
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

export const prestamoService = {
    findAll: async () => {
        return await fetchAPI('/prestamo');
    },
    findOne: async (id: number) => {
        return await fetchAPI(`/prestamo/${id}`);
    },
    findByUsuarioId: async (usuarioId: number) => {
        return await fetchAPI(`/prestamo/usuario/${usuarioId}`);
    },
    create: async (data: {
        libro: { id: number };
        usuario: { id: number };
        fecha_prestamo: Date;
        devuelto: boolean;
    }) => {
        return await fetchAPI('/prestamo', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    update: async (id: number, data: {
        fecha_devolucion?: Date;
        devuelto: boolean;
    }) => {
        return await fetchAPI(`/prestamo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: async (id: number) => {
        return await fetchAPI(`/prestamo/${id}`, {
            method: 'DELETE',
        });
    },
};