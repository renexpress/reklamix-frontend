/**
 * Result Display Component
 * Step 4: Display generated image(s) with download option
 * Supports both single image and multiple images grid view
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJob } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Share2, CheckCircle2, Sparkles, Check, DownloadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResultImage {
  url: string;
  variant_index: number;
  prompt_used?: string;
  latency_ms?: number;
}

interface ResultDisplayProps {
  jobId: number;
  onCreateNew: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ jobId, onCreateNew }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: job } = useJob(jobId, false); // No polling needed

  // Get all images - supports both old single image format and new multi-image format
  const getImages = (): ResultImage[] => {
    if (!job) return [];

    // New format: result_images array
    if (job.result_images && Array.isArray(job.result_images) && job.result_images.length > 0) {
      return job.result_images;
    }

    // Legacy format: single result_image_url
    if (job.result_image_url) {
      return [{ url: job.result_image_url, variant_index: 0 }];
    }

    return [];
  };

  const images = getImages();
  const hasMultipleImages = images.length > 1;

  if (!job || images.length === 0) {
    return null;
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      setDownloadingIndex(index);

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${job.id}-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: t('create.result.download_complete'),
        description: t('create.result.download_saved'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('create.result.download_error'),
        description: t('create.result.download_failed'),
      });
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);

    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i].url, i);
      // Small delay between downloads
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsDownloading(false);
  };

  const handleShare = async () => {
    const currentImage = images[selectedIndex];
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('create.result.share_title'),
          text: t('create.result.share_text'),
          url: currentImage.url,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(currentImage.url);
      toast({
        title: t('create.result.link_copied'),
        description: t('create.result.url_copied'),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-500/50 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            {hasMultipleImages
              ? t('create.result.success_title_multiple', { count: images.length })
              : t('create.result.success_title')
            }
          </CardTitle>
          <CardDescription>
            {t('create.result.success_description')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Image Display */}
      <Card>
        <CardHeader>
          <CardTitle>{t('create.result.result_title')}</CardTitle>
          {job.generation_mode && (
            <CardDescription>
              {job.generation_mode === 'marketplace'
                ? t('create.result.mode_marketplace')
                : t('create.result.mode_advertisement')
              }
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {/* Main Image Display */}
          <div className="relative rounded-xl overflow-hidden bg-muted">
            <img
              src={images[selectedIndex].url}
              alt={`Generated result ${selectedIndex + 1}`}
              className="w-full h-auto"
            />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('create.result.ai_generated')}
              </Badge>
            </div>
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {selectedIndex + 1} / {images.length}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail Grid for Multiple Images */}
          {hasMultipleImages && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">{t('create.result.select_image')}</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`
                      relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${selectedIndex === index
                        ? 'border-[#FE5C02] ring-2 ring-[#FE5C02]/30'
                        : 'border-transparent hover:border-gray-300'
                      }
                    `}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedIndex === index && (
                      <div className="absolute inset-0 bg-[#FE5C02]/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#FE5C02] flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{index + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={() => handleDownload(images[selectedIndex].url, selectedIndex)}
                disabled={downloadingIndex !== null}
                className="bg-[#FE5C02] hover:bg-[#e55502]"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloadingIndex === selectedIndex
                  ? t('create.result.button_downloading')
                  : t('create.result.button_download')
                }
              </Button>

              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="w-5 h-5 mr-2" />
                {t('create.result.button_share')}
              </Button>
            </div>

            {/* Download All Button for Multiple Images */}
            {hasMultipleImages && (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleDownloadAll}
                disabled={isDownloading}
              >
                <DownloadCloud className="w-5 h-5 mr-2" />
                {isDownloading
                  ? t('create.result.button_downloading_all')
                  : t('create.result.button_download_all', { count: images.length })
                }
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create New Button */}
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={onCreateNew}
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        {t('create.result.button_create_new')}
      </Button>
    </div>
  );
};
