// src/services/autorService.ts
const API_URL = "http://localhost:3000";

interface Autor {
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

    if (response.status === 204) return;
    return response.json();
};

export const autorService = {
    findAll: async (): Promise<Autor[]> => await fetchAPI('/autor'),
    findById: async (id: number): Promise<Autor> => await fetchAPI(`/autor/${id}`),
    create: async (data: Partial<Autor>): Promise<Autor> => await fetchAPI('/autor', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: async (id: number, data: Partial<Autor>): Promise<Autor> => await fetchAPI(`/autor/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: async (id: number): Promise<void> => await fetchAPI(`/autor/${id}`, { method: 'DELETE' }),
};