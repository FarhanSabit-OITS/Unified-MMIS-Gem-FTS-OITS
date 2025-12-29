import axios from 'axios';
import { GateToken, UserProfile, Vendor } from '../types';

// Initialize the API Client
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mmis_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mmis_token');
      localStorage.removeItem('mmis_user');
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export const ApiService = {
  // --- Auth ---
  auth: {
    login: (credentials: any) => api.post<{user: UserProfile, token: string}>('/auth/login', credentials),
    register: (data: any) => api.post('/auth/register', data),
    verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
    logout: () => {
      localStorage.removeItem('mmis_token');
      localStorage.removeItem('mmis_user');
      window.location.href = '/';
    }
  },

  // --- User Applications (Role Access) ---
  applications: {
    submit: (formData: FormData) => api.post('/applications/role-access', formData, {
      headers: { 'Content-Type': 'multipart/form-data' } // Critical for file upload
    }),
    getMyApplications: () => api.get('/applications/me'),
  },

  // --- Gate & Financials ---
  gate: {
    // Backend should calculate VAT and Total based on category
    getFeeStructure: (category: string) => api.get<{base: number, vat: number, total: number}>(`/gate/fees?category=${category}`),
    
    // Generate the actual token after payment
    createEntryToken: (data: { plate: string, category: string, paymentRef: string }) => api.post<GateToken>('/gate/entry', data),
    
    // Check exit status (calculates overstay)
    scanForExit: (tokenCode: string) => api.post<{token: GateToken, overstayFee: number, duration: number}>('/gate/scan-exit', { tokenCode }),
    
    // Finalize exit
    processExit: (tokenCode: string) => api.post('/gate/exit', { tokenCode }),
    
    getLogs: () => api.get<GateToken[]>('/gate/logs'),
  },

  financials: {
    processPayment: (data: { amount: number; method: string; description: string; taxAmount?: number }) => api.post<{txId: string}>('/financials/pay', data),
  },

  // --- Vendors & General ---
  vendors: {
    getAll: () => api.get<Vendor[]>('/vendors'),
    getById: (id: string) => api.get<Vendor>(`/vendors/${id}`),
  },

  // --- AI ---
  ai: {
    chat: (message: string) => api.post('/ai/chat', { message }),
    summarize: (text: string) => api.post('/ai/summarize', { text }),
  }
};

export default api;