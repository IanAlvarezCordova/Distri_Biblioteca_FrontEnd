const API_URL = import.meta.env.VITE_API_URL;

// Caché para solicitudes GET
const cache = new Map();

// Utilidad para convertir cualquier tipo de headers a objeto plano
function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  // Log detallado con pila de llamadas para depuración
  console.log(`📡 Request to: ${API_URL}${endpoint}, Method: ${options.method || 'GET'}, Caller: ${new Error().stack?.split('\n')[2]}`);

  // Verificar caché para solicitudes GET
  const cacheKey = `${endpoint}_${options.method || 'GET'}`;
  if (options.method === 'GET' && cache.has(cacheKey)) {
    console.log(`📦 Cache hit for: ${endpoint}`);
    return cache.get(cacheKey);
  }

  const token = localStorage.getItem('token');
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const extraHeaders = normalizeHeaders(options.headers);
  const headers = { ...baseHeaders, ...extraHeaders };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Manejo de errores por status
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
        throw new Error(`No autorizado, server: ${errorData.message || ''}`.trim());
      }
      if (response.status === 403) {
        throw new Error(`No tienes permisos para realizar esta acción, server: ${errorData.message || ''}`.trim());
      }
      if (response.status === 404) {
        throw new Error('No encontrado');
      }
      throw new Error(errorMessage);
    }

    // Manejo de respuestas vacías (204 No Content)
    if (response.status === 204) {
      return;
    }

    // Manejo de respuesta exitosa (201 Created, 200 OK, etc)
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    // Guardar en caché solo para solicitudes GET
    if (options.method === 'GET') {
      cache.set(cacheKey, data);
    }

    return data;
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