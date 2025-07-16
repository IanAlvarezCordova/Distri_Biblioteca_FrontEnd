// src/services/autorService.ts
import { fetchAPI } from './api';

interface Autor {
    id: number;
    nombre: string;
}

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (promise: Promise<any>) => {
    try {
        const response = await promise;
        return response;
    } catch (error: any) {
        // Puedes personalizar el manejo de errores aquí
        if (error.message?.includes('401') || error.message?.includes('403')) {
            throw new Error('No tienes permisos para realizar esta acción');
        }
        throw error;
    }
};

export const autorService = {
    findAll: async (): Promise<Autor[]> =>
        handleResponse(fetchAPI('/autor', { headers: getAuthHeaders() })),

    findById: async (id: number): Promise<Autor> =>
        handleResponse(fetchAPI(`/autor/${id}`, { headers: getAuthHeaders() })),

    create: async (data: Partial<Autor>): Promise<Autor> =>
        handleResponse(fetchAPI('/autor', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
        })),

    update: async (id: number, data: Partial<Autor>): Promise<Autor> =>
        handleResponse(fetchAPI(`/autor/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
        })),

    delete: async (id: number): Promise<void> =>
        handleResponse(fetchAPI(`/autor/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })),
};