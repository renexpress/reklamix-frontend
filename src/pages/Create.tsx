/**
 * Create Page
 * Premium image generation workflow
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useJob, useCreateJob, useMyCredits } from '@/hooks/useApi';
import { UploadForm } from '@/components/create/UploadForm';
import { AnalyzingProgress } from '@/components/create/AnalyzingProgress';
import { ThemeSelector } from '@/components/create/ThemeSelector';
import { GenerationProgress } from '@/components/create/GenerationProgress';
import { ResultDisplay } from '@/components/create/ResultDisplay';
import { PaywallModal } from '@/components/create/PaywallModal';
import { Badge } from '@/components/ui/badge';
import { Check, Upload, Palette, Sparkles, Image, Brain } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

type WorkflowStep = 'upload' | 'analyzing' | 'select-theme' | 'generate' | 'complete';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadState {
  status: UploadStatus;
  error: string | null;
  formData: FormData | null;
}

// Store pending analysis data when blocked by paywall
interface PendingAnalysisData {
  formData: FormData;
  imageCount: number;
  generationMode: 'marketplace' | 'advertisement';
}

const Create = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [step, setStep] = useState<WorkflowStep>('upload');

  // Track image count for analyzing stage display
  const [pendingImageCount, setPendingImageCount] = useState<number>(1);

  // Track generation mode for proper next-step handling
  const [pendingGenerationMode, setPendingGenerationMode] = useState<'marketplace' | 'advertisement'>('advertisement');

  // Track upload state for immediate transition
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    error: null,
    formData: null,
  });

  // Credit validation state
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<PendingAnalysisData | null>(null);

  // Fetch user credits
  const { data: creditsData, refetch: refetchCredits } = useMyCredits();
  const availableCredits = creditsData?.credits_remaining ?? 0;

  // Only poll when we have a job ID AND upload was successful
  const shouldPoll = step === 'analyzing' && !!currentJobId && uploadState.status === 'success';
  const { data: job } = useJob(currentJobId || 0, shouldPoll, {
    enabled: shouldPoll,
    refetchInterval: shouldPoll ? 1500 : false, // Poll every 1.5s during analyzing
  });

  // Create job mutation - lifted from UploadForm for retry capability
  const createJobMutation = useCreateJob({
    onSuccess: (response) => {
      const createdJob = response.data;
      setCurrentJobId(createdJob.id);
      setPendingGenerationMode(createdJob.generation_mode || 'advertisement');
      setUploadState(prev => ({
        ...prev,
        status: 'success',
        formData: null, // Clear stored form data on success
      }));
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error);

      // Check if this is an insufficient credits error (402)
      const isCreditsError = error?.response?.status === 402 ||
        error?.response?.data?.error_code === 'INSUFFICIENT_CREDITS';

      if (isCreditsError) {
        // Show paywall instead of error state
        const requiredCredits = error?.response?.data?.required_credits || pendingImageCount;
        setPendingImageCount(requiredCredits);
        setShowPaywall(true);
        // Reset upload state to idle so user can try again after purchasing
        setUploadState({ status: 'idle', error: null, formData: null });
        setStep('upload');
        return;
      }

      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
      toast({
        variant: 'destructive',
        title: t('create.upload.toast_error_title'),
        description: errorMessage,
      });
    },
  });

  // Watch for job status changes to transition from analyzing to next step
  useEffect(() => {
    if (!job || step !== 'analyzing' || uploadState.status !== 'success') return;

    if (job.status === 'analysis_complete' || job.status === 'theme_selected') {
      // Analysis complete - move to appropriate next step
      if (job.generation_mode === 'marketplace') {
        setStep('generate');
      } else {
        setStep('select-theme');
      }
    } else if (job.status === 'analysis_failed' || job.status === 'failed') {
      // Analysis failed - show error on analyzing page
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: job.error_message || t('create.analyzing.analysis_failed'),
      }));
    }
  }, [job?.status, step, uploadState.status, t]);

  // Actually start the analysis (called after credit validation passes)
  const proceedWithAnalysis = useCallback((formData: FormData, imageCount: number, generationMode: 'marketplace' | 'advertisement') => {
    // 1. Immediately transition to analyzing stage
    setStep('analyzing');
    setPendingImageCount(imageCount);
    setPendingGenerationMode(generationMode);

    // 2. Mark upload as in-progress
    setUploadState({
      status: 'uploading',
      error: null,
      formData: formData, // Store for potential retry
    });

    // 3. Clear any previous job (we don't have one yet)
    setCurrentJobId(null);

    // 4. Clear pending analysis data
    setPendingAnalysis(null);

    // 5. Fire the API request
    createJobMutation.mutate(formData);
  }, [createJobMutation]);

  // Called when form is submitted - validates credits FIRST
  const handleStartAnalysis = useCallback((formData: FormData, imageCount: number, generationMode: 'marketplace' | 'advertisement') => {
    // Check if user has sufficient credits
    const requiredCredits = imageCount; // 1 credit per image

    if (availableCredits < requiredCredits) {
      // Insufficient credits - show paywall
      setPendingAnalysis({ formData, imageCount, generationMode });
      setPendingImageCount(imageCount); // Store for paywall display
      setShowPaywall(true);
      return;
    }

    // Credits are sufficient - proceed with analysis
    proceedWithAnalysis(formData, imageCount, generationMode);
  }, [availableCredits, proceedWithAnalysis]);

  // Handle paywall close - check if credits were added and resume if possible
  const handlePaywallClose = useCallback(() => {
    setShowPaywall(false);
    // Refetch credits in case user purchased and came back
    refetchCredits();
  }, [refetchCredits]);

  // Resume analysis after credits are added (user can click Start Analysis again)
  // The pending analysis is cleared when paywall closes

  // Retry upload from analyzing page
  const handleRetryUpload = useCallback(() => {
    const storedFormData = uploadState.formData;

    if (!storedFormData) {
      // No form data stored, go back to upload
      setStep('upload');
      setUploadState({ status: 'idle', error: null, formData: null });
      return;
    }

    // Reset error state and retry
    setUploadState(prev => ({
      ...prev,
      status: 'uploading',
      error: null,
    }));

    // Re-trigger the API request
    createJobMutation.mutate(storedFormData);
  }, [uploadState.formData, createJobMutation]);

  // Cancel upload and go back
  const handleCancelUpload = useCallback(() => {
    setStep('upload');
    setCurrentJobId(null);
    setUploadState({ status: 'idle', error: null, formData: null });
  }, []);

  // Legacy handler for backward compatibility (when job completes analysis inline)
  const handleJobCreated = (jobId: number, jobData: any) => {
    setCurrentJobId(jobId);
    // For marketplace mode, skip theme selection and go straight to generation
    if (jobData.generation_mode === 'marketplace') {
      setStep('generate');
    } else {
      setStep('select-theme');
    }
  };

  const handleThemeSelected = () => {
    setStep('generate');
  };

  const handleGenerationComplete = () => {
    setStep('complete');
  };

  const handleCreateNew = () => {
    setCurrentJobId(null);
    setStep('upload');
    setUploadState({ status: 'idle', error: null, formData: null });
  };

  const steps = [
    { id: 'upload', label: t('create.progress.upload'), icon: Upload },
    { id: 'analyzing', label: t('create.progress.analyzing'), icon: Brain },
    { id: 'select-theme', label: t('create.progress.theme'), icon: Palette },
    { id: 'generate', label: t('create.progress.generate'), icon: Sparkles },
    { id: 'complete', label: t('create.progress.complete'), icon: Check },
  ];

  const getStepIndex = (stepId: string) => steps.findIndex(s => s.id === stepId);
  const currentStepIndex = getStepIndex(step);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main
        className="flex-grow pt-20"
        style={{
          background: 'linear-gradient(135deg, #e0f7f7 0%, #b2ebeb 30%, #7dd6d6 60%, #2AABAB 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm mb-4"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2AABAB] text-white text-xs font-bold mr-2">AI</span>
              <span className="text-sm font-medium text-gray-700">AI-Powered Generation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              {t('create.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('create.subtitle')}
            </p>
          </div>

          {/* Progress Steps */}
          {(step !== 'upload') && (
            <div className="mb-8 sm:mb-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  {steps.map((s, index) => {
                    const Icon = s.icon;
                    const isActive = s.id === step;
                    const isComplete = index < currentStepIndex;
                    const isUpcoming = index > currentStepIndex;

                    return (
                      <div key={s.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`
                              w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300
                              ${isComplete
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                : isActive
                                  ? 'bg-[#2AABAB] text-white shadow-lg shadow-teal-500/30 ring-4 ring-teal-100'
                                  : 'bg-gray-100 text-gray-400'
                              }
                            `}
                          >
                            {isComplete ? (
                              <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                          </div>
                          <span
                            className={`
                              mt-2 text-xs sm:text-sm font-medium text-center hidden sm:block
                              ${isActive ? 'text-[#2AABAB]' : isComplete ? 'text-green-600' : 'text-gray-400'}
                            `}
                          >
                            {s.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`
                              h-1 flex-1 mx-2 rounded-full transition-all duration-300
                              ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                            `}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Workflow Steps */}
          <div className="space-y-6">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#2AABAB]/10 via-teal-50 to-teal-50 px-6 sm:px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#2AABAB] flex items-center justify-center shadow-lg shadow-teal-500/30">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {t('create.upload.title')}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {t('create.upload.description')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <UploadForm
                    onJobCreated={handleJobCreated}
                    onStartAnalysis={handleStartAnalysis}
                  />
                </div>
              </div>
            )}

            {/* Step 1.5: Analyzing */}
            {step === 'analyzing' && (
              <AnalyzingProgress
                imageCount={pendingImageCount}
                uploadStatus={uploadState.status}
                uploadError={uploadState.error}
                onRetry={handleRetryUpload}
                onCancel={handleCancelUpload}
              />
            )}

            {/* Step 2: Select Theme */}
            {step === 'select-theme' && job && job.analysis_json && (
              <ThemeSelector
                jobId={job.id}
                themes={job.analysis_json.themes || []}
                productInfo={job.analysis_json.product}
                onThemeSelected={handleThemeSelected}
              />
            )}

            {/* Step 3: Generation Progress */}
            {step === 'generate' && currentJobId && (
              <GenerationProgress
                jobId={currentJobId}
                onComplete={handleGenerationComplete}
              />
            )}

            {/* Step 4: Result Display */}
            {step === 'complete' && currentJobId && (
              <ResultDisplay
                jobId={currentJobId}
                onCreateNew={handleCreateNew}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Paywall Modal - shown when insufficient credits */}
      <PaywallModal
        open={showPaywall}
        onClose={handlePaywallClose}
        requiredCredits={pendingImageCount}
        availableCredits={availableCredits}
      />
    </div>
  );
};

export default Create;
