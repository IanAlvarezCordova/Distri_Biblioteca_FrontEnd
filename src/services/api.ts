//src/services/api.ts
// En desarrollo usar el proxy, en producción usar la URL completa
const API_URL = import.meta.env.PROD ? "http://localhost:3000" : "/api";

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  console.log('🔗 fetchAPI llamado con:', {
    url: `${API_URL}${endpoint}`,
    method: options.method || 'GET',
    headers: options.headers
  });

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || 'GET',
      mode: 'cors', // Explícitamente habilitar CORS
      cache: 'no-cache', // Deshabilitar cache
      credentials: 'omit', // No enviar cookies por defecto
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📡 Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    if (!response.ok) {
      let errorMessage = `Error en la petición: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('❌ Error data del servidor:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no puede parsear JSON, usa el mensaje por defecto
        console.log('❌ No se pudo parsear el error como JSON');
      }
      throw new Error(errorMessage);
    }

    // 🛠️ Verifica si hay contenido antes de hacer response.json()
    const text = await response.text();
    console.log('📄 Respuesta text length:', text.length);
    const result = text ? JSON.parse(text) : null;
    console.log('✅ Resultado parseado:', result);
    return result;
  } catch (error) {
    console.error('🚨 Error completo en fetchAPI:', error);
    
    // Type guard para error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.constructor.name : 'Unknown';
    
    console.error('🚨 Tipo de error:', errorName);
    console.error('🚨 Mensaje de error:', errorMessage);
    
    // Si es un error de red (backend no disponible)
    if (error instanceof TypeError && (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch'))) {
      throw new Error('❌ Backend no disponible. Asegúrate de que el servidor esté corriendo en http://localhost:3000');
    }
    throw error;
  }
};
