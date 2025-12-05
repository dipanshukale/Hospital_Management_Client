// src/services/api.ts
import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, removeAuthToken, removeUser } from '../utils/auth';


// Base URL from environment variable
// In development, explicitly use http://localhost:5000/api
// For production, set VITE_API_URL to your API server URL
const API_URL: string = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    if (token) {
      if (!config.headers) config.headers = {} as InternalAxiosRequestConfig['headers'];
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      removeAuthToken();
      removeUser();
      window.location.href = '/login';
    }
    
    // Handle network errors (connection refused, etc.)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      console.error('Network Error: Unable to connect to the server. Make sure the backend server is running.');
      console.error(`Attempted to connect to: ${backendUrl}`);
      return Promise.reject({
        ...error,
        message: `Unable to connect to the server at ${backendUrl}. Please ensure the backend server is running on port 5000.`,
      });
    }
    
    return Promise.reject(error);
  }
);
// --- Auth API ---
export const authAPI = {
  login: (email: string, password: string) =>
    axios.post("http://localhost:5000/api/auth/login", { email, password }),

  doctorLogin: (email: string, password: string) =>
    axios.post("http://localhost:5000/api/auth/doctorlogin", { email, password }),
};

// --- Doctor API ---
export const doctorAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctor: (id: string) => api.get(`/doctors/${id}`),
  createDoctor: (data: Record<string, any>) => api.post('/doctors', data),
  updateDoctor: (id: string, data: Record<string, any>) => api.put(`/doctors/${id}`, data),
  deleteDoctor: (id: string) => api.delete(`/doctors/${id}`),
  getDoctorsByHospital: (hospitalName: string) => api.get(`/doctors/hospital/${hospitalName}`),
};

// --- Medicine API ---
export const medicineAPI = {
  getMedicines: () => api.get('/medicines'),
  getMedicine: (id: string) => api.get(`/medicines/${id}`),
  createMedicine: (data: Record<string, any>) => api.post('/medicines', data),
  updateMedicine: (id: string, data: Record<string, any>) => api.put(`/medicines/${id}`, data),
  deleteMedicine: (id: string) => api.delete(`/medicines/${id}`),
};

// --- Patient API ---
export const patientAPI = {
  getAllPatients: () => api.get('/patients'),
  getTodayPatients: () => api.get('/patients/today'),
  getPatient: (id: string) => api.get(`/patients/${id}`),
  registerPatient: (data: Record<string, any>) => api.post('/patients', data),
  issuePrescription: (id: string, data: Record<string, any>) =>
    api.put(`/patients/${id}/prescription`, data),
};

export default api;
