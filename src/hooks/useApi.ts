/**
 * React Query hooks for API endpoints
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import {
  authApi,
  coreApi,
  subscriptionsApi,
  paymentsApi,
  adminApi,
  getErrorMessage,
} from '@/lib/api';

// ============ Query Keys ============
export const queryKeys = {
  currentUser: ['currentUser'],
  samples: ['samples'],
  platforms: ['platforms'],
  videos: ['videos'],
  jobs: ['jobs'],
  job: (id: number) => ['job', id],
  userResults: ['userResults'],
  packages: ['packages'],
  creditPacks: ['creditPacks'],
  myCredits: ['myCredits'],
  myPayments: ['myPayments'],
  adminUsers: (search?: string, page?: number) => ['admin', 'users', search, page],
  adminUser: (id: number) => ['admin', 'user', id],
  adminUserProfile: (id: number) => ['admin', 'user', 'profile', id],
  adminUserJobs: (id: number, page?: number, status?: string) => ['admin', 'user', 'jobs', id, page, status],
  adminUserTransactions: (id: number, page?: number, type?: string) => ['admin', 'user', 'transactions', id, page, type],
  adminSamples: ['admin', 'samples'],
  adminSample: (id: number) => ['admin', 'sample', id],
  adminVideos: ['admin', 'videos'],
  adminVideo: (id: number) => ['admin', 'video', id],
  adminPackages: ['admin', 'packages'],
  adminPackage: (id: number) => ['admin', 'package', id],
  adminPlatforms: ['admin', 'platforms'],
  adminPlatform: (slug: string) => ['admin', 'platform', slug],
  adminLogs: (status?: string, userId?: number, page?: number) => ['admin', 'logs', status, userId, page],
  // Marketplace Templates
  adminMarketplaceCategories: ['admin', 'marketplace-categories'],
  adminMarketplaceCategory: (id: number) => ['admin', 'marketplace-category', id],
  adminMarketplaceSubcategories: (categoryId?: number) => ['admin', 'marketplace-subcategories', categoryId],
  adminMarketplaceSubcategory: (id: number) => ['admin', 'marketplace-subcategory', id],
  adminTemplatePacks: (subcategoryId?: number) => ['admin', 'template-packs', subcategoryId],
  adminTemplatePack: (id: number) => ['admin', 'template-pack', id],
  adminMarketplaceTemplates: (templatePackId?: number, page?: number) => ['admin', 'marketplace-templates', templatePackId, page],
  adminMarketplaceTemplate: (id: number) => ['admin', 'marketplace-template', id],
};

// ============ Auth Hooks ============

export const useCurrentUser = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: async () => {
      const { data } = await authApi.getCurrentUser();
      return data;
    },
    retry: false,
    ...options,
  });
};

export const useRegister = (options?: UseMutationOptions<AxiosResponse, Error, { phone_number: string; password: string }>) => {
  return useMutation({
    mutationFn: async (data) => authApi.register(data),
    ...options,
  });
};

export const useLogin = (options?: UseMutationOptions<AxiosResponse, Error, { phone_number: string; password: string }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => authApi.login(data),
    onSuccess: (response, ...args) => {
      // Invalidate current user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useRequestOTP = (options?: UseMutationOptions<AxiosResponse, Error, string>) => {
  return useMutation({
    mutationFn: async (phone_number) => authApi.requestOTP(phone_number),
    ...options,
  });
};

export const useVerifyOTP = (options?: UseMutationOptions<AxiosResponse, Error, { phone_number: string; otp_code: string }>) => {
  return useMutation({
    mutationFn: async (data) => authApi.verifyOTP(data),
    ...options,
  });
};

export const useResetPassword = (options?: UseMutationOptions<AxiosResponse, Error, { verification_token: string; new_password: string }>) => {
  return useMutation({
    mutationFn: async (data) => authApi.resetPassword(data),
    ...options,
  });
};

// ============ Core Hooks ============

export const useSamples = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.samples,
    queryFn: async () => {
      const { data } = await coreApi.getSamples();
      return data;
    },
    ...options,
  });
};

export const usePlatforms = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.platforms,
    queryFn: async () => {
      const { data } = await coreApi.getPlatforms();
      return data;
    },
    ...options,
  });
};

export const useJobs = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.jobs,
    queryFn: async () => {
      const { data } = await coreApi.getJobs();
      return data;
    },
    ...options,
  });
};

export const useUserResults = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.userResults,
    queryFn: async () => {
      const { data } = await coreApi.getUserResults();
      return data;
    },
    ...options,
  });
};

export const useJob = (id: number, pollingEnabled: boolean = false, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: async () => {
      const { data } = await coreApi.getJob(id);
      return data;
    },
    refetchInterval: pollingEnabled ? 2000 : false, // Poll every 2 seconds when enabled
    ...options,
  });
};

export const useCreateJob = (options?: UseMutationOptions<AxiosResponse, Error, FormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => coreApi.createJob(formData),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useSelectTheme = (options?: UseMutationOptions<AxiosResponse, Error, { jobId: number; themeId: string }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, themeId }) => coreApi.selectTheme(jobId, themeId),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.job(variables.jobId) });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useGenerateImage = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId) => coreApi.generateImage(jobId),
    onSuccess: (response, jobId, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.job(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.myCredits });
      options?.onSuccess?.(response, jobId, ...args);
    },
    ...options,
  });
};

// ============ Subscriptions Hooks ============

export const usePackages = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.packages,
    queryFn: async () => {
      const { data } = await subscriptionsApi.getPackages();
      return data;
    },
    ...options,
  });
};

// One-time credit packs (for PaywallModal)
export const useCreditPacks = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.creditPacks,
    queryFn: async () => {
      const { data } = await subscriptionsApi.getCreditPacks();
      return data;
    },
    ...options,
  });
};

export const useMyCredits = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.myCredits,
    queryFn: async () => {
      const { data } = await subscriptionsApi.getMyCredits();
      return data;
    },
    ...options,
  });
};

export const useCheckCredits = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  return useMutation({
    mutationFn: async (required_credits) => subscriptionsApi.checkCredits(required_credits),
    ...options,
  });
};

// ============ Payments Hooks ============

export const useCreateStripeCheckout = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  return useMutation({
    mutationFn: async (packageId) => paymentsApi.createStripeCheckout(packageId),
    ...options,
  });
};

// Create PaymentIntent for embedded Stripe checkout
export const useCreatePaymentIntent = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  return useMutation({
    mutationFn: async (packageId) => paymentsApi.createPaymentIntent(packageId),
    ...options,
  });
};

export const useCreateClickPayment = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  return useMutation({
    mutationFn: async (packageId) => paymentsApi.createClickPayment(packageId),
    ...options,
  });
};

export const useMyPayments = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.myPayments,
    queryFn: async () => {
      const { data } = await paymentsApi.getMyPayments();
      return data;
    },
    ...options,
  });
};

// ============ Admin Hooks ============

export const useAdminAnalytics = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const { data } = await adminApi.getAnalytics();
      return data;
    },
    staleTime: 60000, // 1 minute
    ...options,
  });
};

export const useAdminUsers = (search?: string, page?: number, limit?: number, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminUsers(search, page),
    queryFn: async () => {
      const { data } = await adminApi.getUsers({ search, page, limit });
      return data;
    },
    ...options,
  });
};

export const useAdminUser = (userId: number, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminUser(userId),
    queryFn: async () => {
      const { data } = await adminApi.getUser(userId);
      return data;
    },
    ...options,
  });
};

export const useUpdateUser = (options?: UseMutationOptions<AxiosResponse, Error, { userId: number; data: { is_staff?: boolean; is_active?: boolean } }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }) => adminApi.updateUser(userId, data),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUser(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers() });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useAdjustCredits = (options?: UseMutationOptions<AxiosResponse, Error, { userId: number; amount: number; notes: string }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, amount, notes }) => adminApi.adjustCredits(userId, { amount, notes }),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUser(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers() });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useAdminUserProfile = (userId: number, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminUserProfile(userId),
    queryFn: async () => {
      const { data } = await adminApi.getUserProfile(userId);
      return data;
    },
    enabled: !!userId,
    ...options,
  });
};

export const useAdminUserJobs = (
  userId: number,
  page?: number,
  limit?: number,
  status?: string,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: queryKeys.adminUserJobs(userId, page, status),
    queryFn: async () => {
      const { data } = await adminApi.getUserJobs(userId, { page, limit, status });
      return data;
    },
    enabled: !!userId,
    ...options,
  });
};

export const useAdminUserTransactions = (
  userId: number,
  page?: number,
  limit?: number,
  type?: string,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: queryKeys.adminUserTransactions(userId, page, type),
    queryFn: async () => {
      const { data } = await adminApi.getUserTransactions(userId, { page, limit, type });
      return data;
    },
    enabled: !!userId,
    ...options,
  });
};

export const useAdminSamples = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminSamples,
    queryFn: async () => {
      const { data } = await adminApi.getSamples();
      return data;
    },
    ...options,
  });
};

export const useCreateSample = (options?: UseMutationOptions<AxiosResponse, Error, FormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => adminApi.createSample(formData),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSamples });
      queryClient.invalidateQueries({ queryKey: queryKeys.samples });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdateSample = (options?: UseMutationOptions<AxiosResponse, Error, { sampleId: number; data: any }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sampleId, data }) => adminApi.updateSample(sampleId, data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSamples });
      queryClient.invalidateQueries({ queryKey: queryKeys.samples });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useDeleteSample = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sampleId) => adminApi.deleteSample(sampleId),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSamples });
      queryClient.invalidateQueries({ queryKey: queryKeys.samples });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useAdminPackages = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminPackages,
    queryFn: async () => {
      const { data } = await adminApi.getPackages();
      return data;
    },
    ...options,
  });
};

export const useCreatePackage = (options?: UseMutationOptions<AxiosResponse, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => adminApi.createPackage(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPackages });
      queryClient.invalidateQueries({ queryKey: queryKeys.packages });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdatePackage = (options?: UseMutationOptions<AxiosResponse, Error, { packageId: number; data: any }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ packageId, data }) => adminApi.updatePackage(packageId, data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPackages });
      queryClient.invalidateQueries({ queryKey: queryKeys.packages });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useDeletePackage = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId) => adminApi.deletePackage(packageId),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPackages });
      queryClient.invalidateQueries({ queryKey: queryKeys.packages });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useGenerationLogs = (
  status?: string,
  userId?: number,
  page?: number,
  limit?: number,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: queryKeys.adminLogs(status, userId, page),
    queryFn: async () => {
      const { data } = await adminApi.getGenerationLogs({ status, user_id: userId, page, limit });
      return data;
    },
    ...options,
  });
};

export const useAdminPlatforms = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminPlatforms,
    queryFn: async () => {
      const { data } = await adminApi.getPlatforms();
      return data;
    },
    ...options,
  });
};

export const useAdminPlatform = (slug: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminPlatform(slug),
    queryFn: async () => {
      const { data } = await adminApi.getPlatform(slug);
      return data;
    },
    enabled: !!slug,
    ...options,
  });
};

export const useCreatePlatform = (options?: UseMutationOptions<AxiosResponse, Error, { slug: string; display_name: string; is_active: boolean }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => adminApi.createPlatform(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlatforms });
      queryClient.invalidateQueries({ queryKey: queryKeys.platforms });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdatePlatform = (options?: UseMutationOptions<AxiosResponse, Error, { slug: string; data: Partial<{ display_name: string; is_active: boolean }> }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, data }) => adminApi.updatePlatform(slug, data),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlatform(variables.slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlatforms });
      queryClient.invalidateQueries({ queryKey: queryKeys.platforms });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeletePlatform = (options?: UseMutationOptions<AxiosResponse, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug) => adminApi.deletePlatform(slug),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlatforms });
      queryClient.invalidateQueries({ queryKey: queryKeys.platforms });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

// ============ Video Hooks ============

export const useVideos = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.videos,
    queryFn: async () => {
      const { data } = await coreApi.getVideos();
      return data;
    },
    ...options,
  });
};

export const useAdminVideos = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminVideos,
    queryFn: async () => {
      const { data } = await adminApi.getVideos();
      return data;
    },
    ...options,
  });
};

export const useCreateVideo = (options?: UseMutationOptions<AxiosResponse, Error, FormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => adminApi.createVideo(formData),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminVideos });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdateVideo = (options?: UseMutationOptions<AxiosResponse, Error, { id: number; formData: FormData }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => adminApi.updateVideo(id, formData),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminVideo(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminVideos });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteVideo = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => adminApi.deleteVideo(id),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminVideos });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

// ============ Marketplace Templates Hooks ============

// Categories
export const useAdminMarketplaceCategories = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminMarketplaceCategories,
    queryFn: async () => {
      const { data } = await adminApi.getMarketplaceCategories();
      return data;
    },
    ...options,
  });
};

export const useCreateMarketplaceCategory = (options?: UseMutationOptions<AxiosResponse, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => adminApi.createMarketplaceCategory(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMarketplaceCategories });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdateMarketplaceCategory = (options?: UseMutationOptions<AxiosResponse, Error, { id: number; data: any }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => adminApi.updateMarketplaceCategory(id, data),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMarketplaceCategory(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMarketplaceCategories });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteMarketplaceCategory = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => adminApi.deleteMarketplaceCategory(id),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMarketplaceCategories });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

// Subcategories
export const useAdminMarketplaceSubcategories = (categoryId?: number, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminMarketplaceSubcategories(categoryId),
    queryFn: async () => {
      const { data } = await adminApi.getMarketplaceSubcategories(categoryId);
      return data;
    },
    ...options,
  });
};

export const useCreateMarketplaceSubcategory = (options?: UseMutationOptions<AxiosResponse, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => adminApi.createMarketplaceSubcategory(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-subcategories'] });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdateMarketplaceSubcategory = (options?: UseMutationOptions<AxiosResponse, Error, { id: number; data: any }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => adminApi.updateMarketplaceSubcategory(id, data),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMarketplaceSubcategory(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-subcategories'] });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteMarketplaceSubcategory = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => adminApi.deleteMarketplaceSubcategory(id),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-subcategories'] });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

// Template Packs
export const useAdminTemplatePacks = (subcategoryId?: number, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.adminTemplatePacks(subcategoryId),
    queryFn: async () => {
      const { data } = await adminApi.getTemplatePacks(subcategoryId);
      return data;
    },
    ...options,
  });
};

export const useCreateTemplatePack = (options?: UseMutationOptions<AxiosResponse, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => adminApi.createTemplatePack(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'template-packs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-subcategories'] });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdateTemplatePack = (options?: UseMutationOptions<AxiosResponse, Error, { id: number; data: any }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => adminApi.updateTemplatePack(id, data),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminTemplatePack(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'template-packs'] });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteTemplatePack = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => adminApi.deleteTemplatePack(id),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'template-packs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-subcategories'] });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

// Templates
export const useAdminMarketplaceTemplates = (
  templatePackId?: number,
  page?: number,
  limit?: number,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: queryKeys.adminMarketplaceTemplates(templatePackId, page),
    queryFn: async () => {
      const { data } = await adminApi.getMarketplaceTemplates({
        template_pack_id: templatePackId,
        page,
        limit
      });
      return data;
    },
    ...options,
  });
};

export const useCreateMarketplaceTemplate = (options?: UseMutationOptions<AxiosResponse, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => adminApi.createMarketplaceTemplate(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-templates'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'template-packs'] });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUpdateMarketplaceTemplate = (options?: UseMutationOptions<AxiosResponse, Error, { id: number; data: any }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => adminApi.updateMarketplaceTemplate(id, data),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMarketplaceTemplate(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-templates'] });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteMarketplaceTemplate = (options?: UseMutationOptions<AxiosResponse, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => adminApi.deleteMarketplaceTemplate(id),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketplace-templates'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'template-packs'] });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useUploadTemplatePreview = (options?: UseMutationOptions<AxiosResponse, Error, { templateId: number; formData: FormData }>) => {
  return useMutation({
    mutationFn: async ({ templateId, formData }) => adminApi.uploadTemplatePreview(templateId, formData),
    ...options,
  });
};

export const useUploadImage = (options?: UseMutationOptions<AxiosResponse, Error, FormData>) => {
  return useMutation({
    mutationFn: async (formData) => adminApi.uploadImage(formData),
    ...options,
  });
};

// ============ Helper Hooks ============

export { getErrorMessage };
