import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUserResults } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Images,
  Video,
  Sparkles,
  Download,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Play,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface ResultImage {
  url: string;
  variant_index: number;
  prompt_used?: string;
  latency_ms?: number;
}

interface GenerationPack {
  id: number;
  status: string;
  generation_mode: string;
  language: string;
  result_image_url: string;
  result_images: ResultImage[] | null;
  created_at: string;
  updated_at: string;
}

interface VideoResult {
  id: number;
  video_url: string;
  thumbnail_url: string;
  status: string;
  duration_seconds: number;
  created_at: string;
}

interface UserResults {
  images: GenerationPack[];
  videos: VideoResult[];
}

// Helper to get images from a pack
const getPackImages = (pack: GenerationPack): ResultImage[] => {
  if (pack.result_images && Array.isArray(pack.result_images) && pack.result_images.length > 0) {
    return pack.result_images;
  }
  if (pack.result_image_url) {
    return [{ url: pack.result_image_url, variant_index: 0 }];
  }
  return [];
};

// Generation Pack Card Component
const GenerationPackCard: React.FC<{
  pack: GenerationPack;
  onClick: () => void;
}> = ({ pack, onClick }) => {
  const { t } = useTranslation();
  const images = getPackImages(pack);
  const imageCount = images.length;
  const isMultiImage = imageCount > 1;
  const previewUrl = images[0]?.url;

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      {/* Image Preview */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Generated result"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Images className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Multi-image indicator (stacked cards effect) */}
        {isMultiImage && (
          <>
            {/* Stacked card layers behind */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1 right-1 w-[calc(100%-8px)] h-[calc(100%-8px)] bg-white/60 rounded-lg transform translate-x-1 -translate-y-1 -z-10" />
              <div className="absolute top-2 right-2 w-[calc(100%-16px)] h-[calc(100%-16px)] bg-white/40 rounded-lg transform translate-x-2 -translate-y-2 -z-20" />
            </div>

            {/* Image count badge */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {imageCount}
            </div>
          </>
        )}

        {/* AI Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI
        </div>

        {/* Mode Badge */}
        <div className={cn(
          "absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium text-white",
          pack.generation_mode === 'marketplace' ? 'bg-blue-500' : 'bg-emerald-500'
        )}>
          {pack.generation_mode === 'marketplace'
            ? t('myResults.modeMarketplace')
            : t('myResults.modeAdvertisement')}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
            <Images className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-3">
        <p className="text-xs text-gray-500">
          {new Date(pack.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

// Video Card Component
const VideoCard: React.FC<{
  video: VideoResult;
  onClick: () => void;
}> = ({ video, onClick }) => {
  const { t } = useTranslation();
  const isComplete = video.status === 'complete';
  const isProcessing = video.status === 'processing';

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      {/* Video Preview */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {isComplete && video.thumbnail_url ? (
          <>
            <img
              src={video.thumbnail_url}
              alt="Video thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </>
        ) : isProcessing ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent mb-2" />
            <span className="text-sm text-orange-600 font-medium">
              {t('myResults.processing')}
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <Video className="w-12 h-12 text-red-300" />
          </div>
        )}

        {/* Video Badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Video className="w-3 h-3" />
          VIDEO
        </div>

        {/* Duration Badge */}
        {isComplete && video.duration_seconds > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            {video.duration_seconds}s
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-3">
        <p className="text-xs text-gray-500">
          {new Date(video.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

// Image Pack Gallery Modal
const ImagePackGalleryModal: React.FC<{
  pack: GenerationPack | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ pack, isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!pack) return null;

  const images = getPackImages(pack);
  const selectedImage = images[selectedIndex];

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `reklamix_result_${pack.id}_${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i].url, i);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const handleShare = async () => {
    if (selectedImage && navigator.share) {
      try {
        await navigator.share({
          title: t('myResults.shareTitle'),
          text: t('myResults.shareText'),
          url: selectedImage.url,
        });
      } catch (error) {
        // User cancelled or share failed
        navigator.clipboard.writeText(selectedImage.url);
      }
    } else if (selectedImage) {
      navigator.clipboard.writeText(selectedImage.url);
    }
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {t('myResults.generationPack')}
              <span className="text-sm font-normal text-gray-500">
                ({images.length} {images.length === 1 ? t('myResults.image') : t('myResults.images')})
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row">
          {/* Main Image Display */}
          <div className="flex-1 relative bg-gray-50 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
            {selectedImage && (
              <img
                src={selectedImage.url}
                alt={`Generated image ${selectedIndex + 1}`}
                className="max-w-full max-h-[500px] object-contain"
              />
            )}

            {/* Navigation arrows (only for multi-image packs) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Sidebar with thumbnails and actions */}
          <div className="lg:w-64 border-t lg:border-t-0 lg:border-l bg-white">
            {/* Thumbnail Grid (only for multi-image packs) */}
            {images.length > 1 && (
              <div className="p-4 border-b">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {t('myResults.allImages')}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={cn(
                        "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                        selectedIndex === index
                          ? "border-purple-500 ring-2 ring-purple-200"
                          : "border-transparent hover:border-gray-300"
                      )}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 space-y-3">
              <Button
                onClick={() => handleDownload(selectedImage.url, selectedIndex)}
                className="w-full"
                variant="default"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('myResults.download')}
              </Button>

              {images.length > 1 && (
                <Button
                  onClick={handleDownloadAll}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('myResults.downloadAll')} ({images.length})
                </Button>
              )}

              <Button
                onClick={handleShare}
                className="w-full"
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('myResults.share')}
              </Button>
            </div>

            {/* Pack Info */}
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('myResults.mode')}:</span>
                  <span className={cn(
                    "font-medium",
                    pack.generation_mode === 'marketplace' ? 'text-blue-600' : 'text-emerald-600'
                  )}>
                    {pack.generation_mode === 'marketplace'
                      ? t('myResults.modeMarketplace')
                      : t('myResults.modeAdvertisement')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('myResults.created')}:</span>
                  <span className="font-medium">
                    {new Date(pack.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Single Image Viewer Modal (for single-image packs)
const SingleImageViewerModal: React.FC<{
  pack: GenerationPack | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ pack, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!pack) return null;

  const images = getPackImages(pack);
  const image = images[0];

  const handleDownload = async () => {
    if (!image) return;
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `reklamix_result_${pack.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (image && navigator.share) {
      try {
        await navigator.share({
          title: t('myResults.shareTitle'),
          text: t('myResults.shareText'),
          url: image.url,
        });
      } catch (error) {
        navigator.clipboard.writeText(image.url);
      }
    } else if (image) {
      navigator.clipboard.writeText(image.url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            {t('myResults.generatedImage')}
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-gray-50 flex items-center justify-center min-h-[400px]">
          {image && (
            <img
              src={image.url}
              alt="Generated result"
              className="max-w-full max-h-[60vh] object-contain"
            />
          )}
        </div>

        <div className="p-4 border-t flex items-center justify-between bg-white">
          <div className="text-sm text-gray-500">
            <span className={cn(
              "font-medium",
              pack.generation_mode === 'marketplace' ? 'text-blue-600' : 'text-emerald-600'
            )}>
              {pack.generation_mode === 'marketplace'
                ? t('myResults.modeMarketplace')
                : t('myResults.modeAdvertisement')}
            </span>
            <span className="mx-2">•</span>
            {new Date(pack.created_at).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {t('myResults.share')}
            </Button>
            <Button onClick={handleDownload} size="sm">
              <Download className="w-4 h-4 mr-2" />
              {t('myResults.download')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Video Player Modal
const VideoPlayerModal: React.FC<{
  video: VideoResult | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ video, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!video || video.status !== 'complete') return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-orange-500" />
            {t('myResults.generatedVideo')}
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-black flex items-center justify-center">
          <video
            src={video.video_url}
            controls
            autoPlay
            className="max-w-full max-h-[60vh]"
          />
        </div>

        <div className="p-4 border-t flex items-center justify-between bg-white">
          <div className="text-sm text-gray-500">
            {video.duration_seconds > 0 && (
              <span>{video.duration_seconds}s • </span>
            )}
            {new Date(video.created_at).toLocaleDateString()}
          </div>
          <Button asChild size="sm">
            <a href={video.video_url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              {t('myResults.download')}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Page Component
const MyResults: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useUserResults({ enabled: isAuthenticated });

  const [selectedPack, setSelectedPack] = useState<GenerationPack | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSingleViewerOpen, setIsSingleViewerOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  const results: UserResults = data || { images: [], videos: [] };
  const hasNoContent = results.images.length === 0 && results.videos.length === 0;

  const handlePackClick = (pack: GenerationPack) => {
    const images = getPackImages(pack);
    setSelectedPack(pack);

    if (images.length > 1) {
      // Multi-image pack: open gallery
      setIsGalleryOpen(true);
    } else {
      // Single image: open simple viewer
      setIsSingleViewerOpen(true);
    }
  };

  const handleVideoClick = (video: VideoResult) => {
    if (video.status === 'complete') {
      setSelectedVideo(video);
      setIsVideoPlayerOpen(true);
    }
  };

  const closeModals = () => {
    setIsGalleryOpen(false);
    setIsSingleViewerOpen(false);
    setIsVideoPlayerOpen(false);
    setSelectedPack(null);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t('myResults.title')}
            </h1>
            <p className="text-purple-100 text-lg">
              {t('myResults.subtitle')}
            </p>

            {!hasNoContent && (
              <div className="flex gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <Images className="w-5 h-5" />
                  <span className="font-semibold">{results.images.length}</span>
                  <span className="text-sm text-purple-100">
                    {t('myResults.imagePacks')}
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  <span className="font-semibold">{results.videos.length}</span>
                  <span className="text-sm text-purple-100">
                    {t('myResults.videosLabel')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container px-4 py-8">
          {isLoading ? (
            // Loading State
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="text-center py-16">
              <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('myResults.errorTitle')}
              </h3>
              <p className="text-gray-500 mb-6">
                {t('myResults.errorDescription')}
              </p>
              <Button onClick={() => window.location.reload()}>
                {t('myResults.retry')}
              </Button>
            </div>
          ) : hasNoContent ? (
            // Empty State
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Images className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {t('myResults.emptyTitle')}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {t('myResults.emptyDescription')}
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('myResults.createFirst')}
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Images Section */}
              {results.images.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <Images className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {t('myResults.generatedImages')}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {results.images.length} {t('myResults.packs')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.images.map((pack) => (
                      <GenerationPackCard
                        key={pack.id}
                        pack={pack}
                        onClick={() => handlePackClick(pack)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Videos Section */}
              {results.videos.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-100 rounded-lg p-2">
                      <Video className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {t('myResults.generatedVideos')}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {results.videos.length} {t('myResults.videosLabel')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.videos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onClick={() => handleVideoClick(video)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <ImagePackGalleryModal
        pack={selectedPack}
        isOpen={isGalleryOpen}
        onClose={closeModals}
      />

      <SingleImageViewerModal
        pack={selectedPack}
        isOpen={isSingleViewerOpen}
        onClose={closeModals}
      />

      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isVideoPlayerOpen}
        onClose={closeModals}
      />
    </div>
  );
};

export default MyResults;
