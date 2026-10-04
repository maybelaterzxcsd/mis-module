const API_BASE_URL = 'http://localhost:8000/api/v1';

async function request<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Request failed: ${endpoint}`, error);
    throw error;
  }
}


export const patientsApi = {
  getAll: () => request<any[]>('/patients'),
  getById: (id: string) => request<any>(`/patients/${id}`),
  create: (data: any) => request<any>('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const protocolsApi = {
  getAll: () => request<any[]>('/protocols'),
  getById: (id: string) => request<any>(`/protocols/${id}`),
  create: (data: any) => request<any>('/protocols', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/protocols/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/protocols/${id}`, { method: 'DELETE' }),
};

export const sickLeavesApi = {
  getAll: () => request<any[]>('/sick-leaves'),
  getById: (id: string) => request<any>(`/sick-leaves/${id}`),
  create: (data: any) => request<any>('/sick-leaves', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/sick-leaves/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const visitsApi = {
  getAll: () => request<any[]>('/visits'),
  create: (data: any) => request<any>('/visits', { method: 'POST', body: JSON.stringify(data) }),
  processVoice: (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return request<any>('/visits/process-voice', { 
      method: 'POST', 
      headers: {}, 
      body: formData 
    });
  }
};

export const profileApi = {
  get: () => request<any>('/profile'),
  update: (data: any) => request<any>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};