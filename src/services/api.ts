// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

// Utilidad para convertir cualquier tipo de headers a objeto plano
function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => { result[key] = value; });
    return result;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const extraHeaders = normalizeHeaders(options.headers);
  const headers = { ...baseHeaders, ...extraHeaders };

  console.log('🔗 fetchAPI llamado con:', {
    url: `${API_URL}${endpoint}`,
    method: options.method || 'GET',
    headers: options.headers
  });

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // --- Manejo de errores por status ---
    if (!response.ok) {
      let errorMessage = `Error en la petición: ${response.statusText}`;
      let errorData: any = {};

      try {
        errorData = await response.json();
      } catch {
        // Si no puede parsear JSON, usa el mensaje por defecto
      }
      // Priorizar el mensaje del backend si está disponible
      if (errorData.message) {
        throw new Error(errorData.message);
      }

      if (response.status === 401) {
        // Combinar los 2 mensajes del backend y el mensaje por defecto
        throw new Error(`No autorizado, server: ${errorData.message || ''}`.trim());
      }
      if (response.status === 403) {
        // Combinar los 2 mensajes del backend y el mensaje por defecto
        throw new Error( `No tienes permisos para realizar esta acción, server: ${errorData.message || ''}`.trim());
      }

      // No encontrado
      if (response.status === 404) {
        throw new Error('No encontrado');
      }
      // Otros errores
      throw new Error(errorMessage);
    }

    // --- Manejo de respuestas vacías (204 No Content) ---
    if (response.status === 204) {
      return;
    }

    // --- Manejo de respuesta exitosa (201 Created, 200 OK, etc) ---
    // Si la respuesta está vacía, retorna null
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    // Error de red o fetch
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      error instanceof TypeError &&
      (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch'))
    ) {
      throw new Error('Backend no disponible. Asegúrate de que el servidor esté corriendo.');
    }
    throw error;
  }
};
