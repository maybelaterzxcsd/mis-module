// Базовый URL API. Пока используем заглушку, позже Егор даст реальный адрес.
// В идеале это должно быть в .env файле: import.meta.env.VITE_API_URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Вспомогательная функция для выполнения запросов
async function request<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // По умолчанию добавляем заголовки для JSON
  const headers = {
    'Content-Type': 'application/json',
    // Здесь потом добавим токен авторизации: 'Authorization': `Bearer ${token}`
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    // Если ответ пустой (например, 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Request failed: ${endpoint}`, error);
    throw error;
  }
}

// === API МЕТОДЫ ПО РАЗДЕЛАМ ===

// 1. Пациенты
export const patientsApi = {
  getAll: () => request<any[]>('/patients'),
  getById: (id: string) => request<any>(`/patients/${id}`),
  create: (data: any) => request<any>('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// 2. Протоколы (самое важное для ИИ)
export const protocolsApi = {
  getAll: () => request<any[]>('/protocols'),
  getById: (id: string) => request<any>(`/protocols/${id}`),
  create: (data: any) => request<any>('/protocols', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/protocols/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/protocols/${id}`, { method: 'DELETE' }),
};

// 3. Больничные листы
export const sickLeavesApi = {
  getAll: () => request<any[]>('/sick-leaves'),
  getById: (id: string) => request<any>(`/sick-leaves/${id}`),
  create: (data: any) => request<any>('/sick-leaves', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/sick-leaves/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// 4. Приёмы (Визиты) - для ИИ и расписания
export const visitsApi = {
  getAll: () => request<any[]>('/visits'),
  create: (data: any) => request<any>('/visits', { method: 'POST', body: JSON.stringify(data) }),
  // Метод для отправки голосового ввода на ИИ
  processVoice: (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return request<any>('/visits/process-voice', { 
      method: 'POST', 
      // Не указываем Content-Type, браузер сам поставит multipart/form-data с boundary
      headers: {}, 
      body: formData 
    });
  }
};

// 5. Настройки и профиль врача
export const profileApi = {
  get: () => request<any>('/profile'),
  update: (data: any) => request<any>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};