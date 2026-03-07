/**
 * API Client with JWT authentication
 */

import axios, { AxiosError } from 'axios';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Auto-refresh token on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh token
        const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = data.access;
        localStorage.setItem(TOKEN_KEY, newAccessToken);

        // Update default header
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ============ API Endpoints ============

// Auth API
export const authApi = {
  register: (data: { phone_number: string; password: string }) =>
    apiClient.post('/auth/register/', data),

  login: (data: { phone_number: string; password: string }) =>
    apiClient.post('/auth/login/', data),

  refreshToken: (refresh: string) =>
    apiClient.post('/auth/token/refresh/', { refresh }),

  requestOTP: (phone_number: string) =>
    apiClient.post('/auth/forgot-password/request/', { phone_number }),

  verifyOTP: (data: { phone_number: string; otp_code: string }) =>
    apiClient.post('/auth/forgot-password/verify/', data),

  resetPassword: (data: { verification_token: string; new_password: string }) =>
    apiClient.post('/auth/forgot-password/reset/', data),

  getCurrentUser: () => apiClient.get('/auth/me/'),
};

// Core API
export const coreApi = {
  // Samples (public)
  getSamples: () => apiClient.get('/samples/'),

  // Platforms (public)
  getPlatforms: () => apiClient.get('/platforms/'),

  // Videos (public)
  getVideos: () => apiClient.get('/videos/'),

  // User Results (authenticated)
  getUserResults: () => apiClient.get('/user/results/'),

  // Jobs (authenticated)
  getJobs: () => apiClient.get('/jobs/'),

  getJob: (id: number) => apiClient.get(`/jobs/${id}/`),

  createJob: (formData: FormData) =>
    apiClient.post('/jobs/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  selectTheme: (jobId: number, themeId: string) =>
    apiClient.post(`/jobs/${jobId}/select-theme/`, { theme_id: themeId }),

  generateImage: (jobId: number) =>
    apiClient.post(`/jobs/${jobId}/generate/`),
};

// Subscriptions API
export const subscriptionsApi = {
  getPackages: () => apiClient.get('/subscriptions/packages/'),

  // Get one-time credit packs (for PaywallModal)
  getCreditPacks: () => apiClient.get('/subscriptions/credit-packs/'),

  getMyCredits: () => apiClient.get('/subscriptions/my-credits/'),

  checkCredits: (required_credits: number = 1) =>
    apiClient.post('/subscriptions/check-credits/', { required_credits }),
};

// Payments API
export const paymentsApi = {
  createStripeCheckout: (packageId: number) =>
    apiClient.post('/payments/create-stripe-checkout/', { package_id: packageId }),

  // Create PaymentIntent for embedded checkout
  createPaymentIntent: (packageId: number) =>
    apiClient.post('/payments/create-payment-intent/', { package_id: packageId }),

  createClickPayment: (packageId: number) =>
    apiClient.post('/payments/create-click-payment/', { package_id: packageId }),

  getMyPayments: () => apiClient.get('/payments/my-payments/'),
};

// Admin API
export const adminApi = {
  // Users
  getUsers: (params?: { search?: string; page?: number; limit?: number }) =>
    apiClient.get('/admin/users/', { params }),

  getUser: (userId: number) => apiClient.get(`/admin/users/${userId}/`),

  updateUser: (userId: number, data: { is_staff?: boolean; is_active?: boolean }) =>
    apiClient.patch(`/admin/users/${userId}/update/`, data),

  adjustCredits: (userId: number, data: { amount: number; notes: string }) =>
    apiClient.post(`/admin/users/${userId}/adjust-credits/`, data),

  getUserProfile: (userId: number) =>
    apiClient.get(`/admin/users/${userId}/profile/`),

  getUserJobs: (userId: number, params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get(`/admin/users/${userId}/jobs/`, { params }),

  getUserTransactions: (userId: number, params?: { page?: number; limit?: number; type?: string }) =>
    apiClient.get(`/admin/users/${userId}/transactions/`, { params }),

  // Samples
  getSamples: () => apiClient.get('/admin/samples/'),

  getSample: (sampleId: number) => apiClient.get(`/admin/samples/${sampleId}/`),

  createSample: (formData: FormData) =>
    apiClient.post('/admin/samples/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateSample: (sampleId: number, data: Partial<{ title: string; sort_order: number; is_active: boolean }>) =>
    apiClient.patch(`/admin/samples/${sampleId}/`, data),

  deleteSample: (sampleId: number) =>
    apiClient.delete(`/admin/samples/${sampleId}/delete/`),

  // Videos
  getVideos: () => apiClient.get('/admin/videos/'),

  getVideo: (videoId: number) => apiClient.get(`/admin/videos/${videoId}/`),

  createVideo: (formData: FormData) =>
    apiClient.post('/admin/videos/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateVideo: (videoId: number, formData: FormData) =>
    apiClient.patch(`/admin/videos/${videoId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteVideo: (videoId: number) =>
    apiClient.delete(`/admin/videos/${videoId}/delete/`),

  // Packages
  getPackages: () => apiClient.get('/admin/packages/'),

  getPackage: (packageId: number) => apiClient.get(`/admin/packages/${packageId}/`),

  createPackage: (data: any) =>
    apiClient.post('/admin/packages/create/', data),

  updatePackage: (packageId: number, data: any) =>
    apiClient.patch(`/admin/packages/${packageId}/`, data),

  deletePackage: (packageId: number) =>
    apiClient.delete(`/admin/packages/${packageId}/delete/`),

  // Platforms
  getPlatforms: () => apiClient.get('/admin/platforms/'),

  getPlatform: (slug: string) => apiClient.get(`/admin/platforms/${slug}/`),

  createPlatform: (data: { slug: string; display_name: string; is_active: boolean }) =>
    apiClient.post('/admin/platforms/create/', data),

  updatePlatform: (slug: string, data: Partial<{ display_name: string; is_active: boolean }>) =>
    apiClient.patch(`/admin/platforms/${slug}/update/`, data),

  deletePlatform: (slug: string) =>
    apiClient.delete(`/admin/platforms/${slug}/delete/`),

  // Logs
  getGenerationLogs: (params?: { status?: string; user_id?: number; page?: number; limit?: number }) =>
    apiClient.get('/admin/generation-logs/', { params }),

  // Marketplace Categories
  getMarketplaceCategories: () => apiClient.get('/admin/marketplace-categories/'),

  getMarketplaceCategory: (id: number) => apiClient.get(`/admin/marketplace-categories/${id}/`),

  createMarketplaceCategory: (data: any) =>
    apiClient.post('/admin/marketplace-categories/create/', data),

  updateMarketplaceCategory: (id: number, data: any) =>
    apiClient.patch(`/admin/marketplace-categories/${id}/update/`, data),

  deleteMarketplaceCategory: (id: number) =>
    apiClient.delete(`/admin/marketplace-categories/${id}/delete/`),

  // Marketplace Subcategories
  getMarketplaceSubcategories: (categoryId?: number) =>
    apiClient.get('/admin/marketplace-subcategories/', { params: { category_id: categoryId } }),

  getMarketplaceSubcategory: (id: number) => apiClient.get(`/admin/marketplace-subcategories/${id}/`),

  createMarketplaceSubcategory: (data: any) =>
    apiClient.post('/admin/marketplace-subcategories/create/', data),

  updateMarketplaceSubcategory: (id: number, data: any) =>
    apiClient.patch(`/admin/marketplace-subcategories/${id}/update/`, data),

  deleteMarketplaceSubcategory: (id: number) =>
    apiClient.delete(`/admin/marketplace-subcategories/${id}/delete/`),

  // Template Packs
  getTemplatePacks: (subcategoryId?: number) =>
    apiClient.get('/admin/template-packs/', { params: { subcategory_id: subcategoryId } }),

  getTemplatePack: (id: number) => apiClient.get(`/admin/template-packs/${id}/`),

  createTemplatePack: (data: any) =>
    apiClient.post('/admin/template-packs/create/', data),

  updateTemplatePack: (id: number, data: any) =>
    apiClient.patch(`/admin/template-packs/${id}/update/`, data),

  deleteTemplatePack: (id: number) =>
    apiClient.delete(`/admin/template-packs/${id}/delete/`),

  // Marketplace Templates
  getMarketplaceTemplates: (params?: { template_pack_id?: number; page?: number; limit?: number }) =>
    apiClient.get('/admin/templates/', { params }),

  getMarketplaceTemplate: (id: number) => apiClient.get(`/admin/templates/${id}/`),

  createMarketplaceTemplate: (data: any) =>
    apiClient.post('/admin/templates/create/', data),

  updateMarketplaceTemplate: (id: number, data: any) =>
    apiClient.patch(`/admin/templates/${id}/update/`, data),

  deleteMarketplaceTemplate: (id: number) =>
    apiClient.delete(`/admin/templates/${id}/delete/`),

  uploadTemplatePreview: (templateId: number, formData: FormData) =>
    apiClient.post(`/admin/templates/${templateId}/upload-preview/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Generic image upload
  uploadImage: (formData: FormData) =>
    apiClient.post('/admin/upload-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Helper to handle API errors
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.response?.data) {
      // Extract error message from response
      const data = axiosError.response.data;
      if (typeof data === 'string') return data;
      if (data.error) return data.error;
      if (data.detail) return data.detail;
      if (data.message) return data.message;

      // Handle field errors
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError)) return firstError[0];
      if (typeof firstError === 'string') return firstError;
    }
    return axiosError.message;
  }

  if (error instanceof Error) return error.message;
  return 'Произошла неизвестная ошибка';
};
