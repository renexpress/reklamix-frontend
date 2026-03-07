/**
 * Analyzing Progress Component
 * Shows the analyzing stage when user submits the upload form
 * Handles three states: uploading, success (analyzing), error
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Sparkles, Upload, Brain, Zap, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// Uploading stage messages (API request in flight)
const UPLOADING_MESSAGE_KEYS = [
  'create.analyzing.uploading_message_1',
  'create.analyzing.uploading_message_2',
  'create.analyzing.uploading_message_3',
];

// Analyzing stage messages (job created, waiting for analysis)
const ANALYZING_MESSAGE_KEYS = [
  'create.analyzing.message_uploading',
  'create.analyzing.message_processing',
  'create.analyzing.message_understanding',
  'create.analyzing.message_identifying',
  'create.analyzing.message_preparing',
];

const MESSAGE_ROTATION_INTERVAL = 2500; // 2.5 seconds

interface AnalyzingProgressProps {
  imageCount?: number;
  uploadStatus?: UploadStatus;
  uploadError?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const AnalyzingProgress: React.FC<AnalyzingProgressProps> = ({
  imageCount = 1,
  uploadStatus = 'success', // Default to success for backwards compatibility
  uploadError = null,
  onRetry,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);
  const [uploadingMessageIndex, setUploadingMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  // Rotate analyzing messages
  useEffect(() => {
    if (uploadStatus !== 'success') return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ANALYZING_MESSAGE_KEYS.length);
    }, MESSAGE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [uploadStatus]);

  // Rotate uploading messages
  useEffect(() => {
    if (uploadStatus !== 'uploading') return;

    const interval = setInterval(() => {
      setUploadingMessageIndex((prev) => (prev + 1) % UPLOADING_MESSAGE_KEYS.length);
    }, MESSAGE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [uploadStatus]);

  // Animate dots
  useEffect(() => {
    if (uploadStatus === 'error') return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [uploadStatus]);

  const currentMessage = uploadStatus === 'uploading'
    ? t(UPLOADING_MESSAGE_KEYS[uploadingMessageIndex])
    : t(ANALYZING_MESSAGE_KEYS[messageIndex]);

  // Error state UI
  if (uploadStatus === 'error') {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500/10 via-red-50 to-orange-50 px-6 sm:px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t('create.analyzing.error_title')}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {t('create.analyzing.error_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            {/* Error Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-3 max-w-md mb-8">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {t('create.analyzing.upload_failed')}
              </p>
              <p className="text-gray-500">
                {uploadError || t('create.analyzing.upload_failed_description')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="bg-[#FE5C02] hover:bg-[#e55502] text-white px-6"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('common.retry')}
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FE5C02]/10 via-orange-50 to-amber-50 px-6 sm:px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FE5C02] flex items-center justify-center shadow-lg shadow-orange-500/30 relative">
            <Brain className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('create.analyzing.title')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {t('create.analyzing.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          {/* Animated Icon */}
          <div className="relative mb-8">
            {/* Outer pulse ring */}
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-[#FE5C02]/10 animate-ping" style={{ animationDuration: '2s' }} />

            {/* Middle ring */}
            <div className="absolute inset-2 w-28 h-28 rounded-full bg-[#FE5C02]/20 animate-pulse" />

            {/* Inner circle with icon */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#FE5C02] to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/40">
              <Loader2 className="w-14 h-14 text-white animate-spin" />
              <Sparkles className="w-6 h-6 text-yellow-200 absolute top-4 right-4 animate-pulse" />
            </div>
          </div>

          {/* Dynamic Message */}
          <div className="text-center space-y-3 max-w-md">
            <p className="text-xl sm:text-2xl font-bold text-gray-900 transition-all duration-300">
              {currentMessage}{dots}
            </p>
            <p className="text-gray-500">
              {imageCount > 1
                ? t('create.analyzing.hint_multiple', { count: imageCount })
                : t('create.analyzing.hint')
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-sm">
            <ProgressStep
              icon={Upload}
              label={t('create.analyzing.step_upload')}
              isActive={uploadStatus === 'uploading'}
              isComplete={uploadStatus === 'success'}
            />
            <ProgressStep
              icon={Brain}
              label={t('create.analyzing.step_analyze')}
              isActive={uploadStatus === 'success' && messageIndex < 4}
              isComplete={uploadStatus === 'success' && messageIndex >= 4}
            />
            <ProgressStep
              icon={Sparkles}
              label={t('create.analyzing.step_prepare')}
              isActive={uploadStatus === 'success' && messageIndex >= 4}
              isComplete={false}
            />
          </div>

          {/* Info Banner */}
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {t('create.analyzing.ai_working')}
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Step Mini Component
interface ProgressStepProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  icon: Icon,
  label,
  isActive,
  isComplete,
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
          ${isComplete
            ? 'bg-green-500 text-white'
            : isActive
              ? 'bg-[#FE5C02] text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-100'
              : 'bg-gray-100 text-gray-400'
          }
        `}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span
        className={`
          text-xs font-medium text-center
          ${isActive ? 'text-[#FE5C02]' : isComplete ? 'text-green-600' : 'text-gray-400'}
        `}
      >
        {label}
      </span>
    </div>
  );
};
