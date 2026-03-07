/**
 * Generation Progress Component
 * Step 3: Shows progress while image is being generated
 */

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useJob, useGenerateImage, useMyCredits } from '@/hooks/useApi';
import { getErrorMessage } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PaywallModal } from './PaywallModal';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

// Dynamic loading messages for generation phase
const LOADING_MESSAGE_KEYS = [
  'create.generate.loading_working',
  'create.generate.loading_creating',
  'create.generate.loading_placing',
  'create.generate.loading_designing',
  'create.generate.loading_polishing',
  'create.generate.loading_crafting',
  'create.generate.loading_perfecting',
  'create.generate.loading_almost_done',
];

const MESSAGE_ROTATION_INTERVAL = 3000; // 3 seconds

interface GenerationProgressProps {
  jobId: number;
  onComplete: () => void;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  jobId,
  onComplete,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Poll job status
  const { data: job, isLoading } = useJob(jobId, true); // Enable polling

  // Rotate loading messages during generation
  useEffect(() => {
    if (job?.status !== 'generating') {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGE_KEYS.length);
    }, MESSAGE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [job?.status]);

  // Get current dynamic loading message
  const getDynamicLoadingMessage = useCallback(() => {
    const key = LOADING_MESSAGE_KEYS[loadingMessageIndex];
    return t(key);
  }, [loadingMessageIndex, t]);

  // Fetch user credits
  const { data: creditsData } = useMyCredits();
  const credits = creditsData || { credits_remaining: 0 };

  // Get required credits based on image_count
  const requiredCredits = job?.image_count || 1;

  const generateImageMutation = useGenerateImage({
    onSuccess: () => {
      toast({
        title: t('create.generate.toast_started_title'),
        description: t('create.generate.toast_started_desc'),
      });
      setHasStartedGeneration(true);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);

      // Check if it's a credit error (402 Payment Required)
      if (errorMessage.includes('кредит') || errorMessage.includes('402') || errorMessage.includes('credit')) {
        setShowPaywall(true);
      } else {
        toast({
          variant: 'destructive',
          title: t('create.generate.toast_error_title'),
          description: errorMessage,
        });
      }
    },
  });

  // Auto-start generation when theme is selected
  useEffect(() => {
    if (job?.status === 'theme_selected' && !hasStartedGeneration && !generateImageMutation.isPending) {
      // Check credits first (1 credit per image)
      if (credits.credits_remaining < requiredCredits) {
        setShowPaywall(true);
      } else {
        generateImageMutation.mutate(jobId);
      }
    }
  }, [job?.status, hasStartedGeneration, requiredCredits]);

  // Notify when complete
  useEffect(() => {
    if (job?.status === 'complete') {
      toast({
        title: t('create.generate.toast_complete_title'),
        description: t('create.generate.toast_complete_desc'),
      });
      onComplete();
    }
  }, [job?.status]);

  if (isLoading && !job) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const status = job.status;

  const getStatusMessage = (status: string) => {
    const statusMap: Record<string, string> = {
      uploaded: t('create.generate.status_uploaded'),
      analyzing: t('create.generate.status_analyzing'),
      analysis_complete: t('create.generate.status_analysis_complete'),
      analysis_failed: t('create.generate.status_analysis_failed'),
      theme_selected: t('create.generate.status_theme_selected'),
      generating: t('create.generate.status_generating'),
      complete: t('create.generate.status_complete'),
      failed: t('create.generate.status_failed'),
    };
    return statusMap[status] || t('create.generate.status_processing');
  };

  const message = getStatusMessage(status);

  // Calculate progress
  const getProgress = () => {
    switch (status) {
      case 'uploaded':
        return 10;
      case 'analyzing':
        return 30;
      case 'analysis_complete':
        return 50;
      case 'theme_selected':
        return 60;
      case 'generating':
        return 80;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  };

  const progress = getProgress();
  const isError = status === 'analysis_failed' || status === 'failed';
  const isGenerating = status === 'generating';
  const isComplete = status === 'complete';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : isError ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : (
              <Sparkles className="w-5 h-5 text-primary" />
            )}
            {message}
          </CardTitle>
          {!isError && !isComplete && (
            <CardDescription>
              {t('create.generate.please_wait')}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />

          {/* Error Display */}
          {isError && (
            <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
              <p className="text-sm text-destructive">
                {job.analysis_error || job.generation_error || t('create.generate.error_occurred')}
              </p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                {t('create.generate.button_retry')}
              </Button>
            </div>
          )}

          {/* Generation Info */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="relative">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-lg text-primary transition-opacity duration-300">
                  {getDynamicLoadingMessage()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {requiredCredits > 1
                    ? t('create.generate.generation_subtitle_multiple', { count: requiredCredits })
                    : t('create.generate.generation_subtitle')
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {t('create.generate.ai_working')}
              </div>
            </div>
          )}

          {/* Latency Info (for debugging) */}
          {job.analysis_latency_ms && (
            <div className="text-xs text-muted-foreground">
              {t('create.generate.analysis_time')}: {(job.analysis_latency_ms / 1000).toFixed(2)}s
              {job.generation_latency_ms &&
                ` | ${t('create.generate.generation_time')}: ${(job.generation_latency_ms / 1000).toFixed(2)}s`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paywall Modal */}
      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        requiredCredits={requiredCredits}
        availableCredits={credits.credits_remaining}
      />
    </>
  );
};
