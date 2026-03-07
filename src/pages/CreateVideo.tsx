/**
 * Create Video Page
 * Premium video generation workflow
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Video, Loader2, CheckCircle, AlertCircle, ArrowRight, Check, Play, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

type VideoStatus = "idle" | "uploading" | "processing" | "complete" | "error";

const CreateVideo = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [status, setStatus] = useState<VideoStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t('create_video.toast_error_title'),
        description: "Only PNG, JPG, WEBP files are allowed",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t('create_video.toast_error_title'),
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      toast({
        title: t('create_video.toast_error_title'),
        description: t('create_video.error_select_image'),
        variant: "destructive",
      });
      return;
    }

    try {
      setStatus("uploading");
      setErrorMessage("");

      toast({
        title: t('create_video.toast_started_title'),
        description: t('create_video.toast_started_desc'),
      });

      // Create FormData
      const formData = new FormData();
      formData.append('product_image', selectedImage);

      // Call backend API
      setStatus("processing");
      const response = await apiClient.post('/video/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 600000, // 10 minutes timeout for video generation
      });

      if (response.data.status === 'success') {
        setVideoUrl(response.data.video_url);
        setStatus("complete");

        toast({
          title: t('create_video.toast_complete_title'),
          description: t('create_video.toast_complete_desc'),
        });
      } else {
        throw new Error(response.data.error || 'Video generation failed');
      }
    } catch (error: any) {
      console.error('Video generation error:', error);
      setStatus("error");
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error occurred';
      setErrorMessage(errorMsg);

      toast({
        title: t('create_video.toast_error_title'),
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview("");
    setVideoUrl("");
    setStatus("idle");
    setErrorMessage("");
  };

  const isGenerating = status === "uploading" || status === "processing";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main
        className="flex-grow pt-20"
        style={{
          background: 'linear-gradient(135deg, #e0f7f7 0%, #b2ebeb 30%, #7dd6d6 60%, #2AABAB 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm mb-4">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold mr-2">AI</span>
              <span className="text-sm font-medium text-gray-700">AI Video Generation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              {t('create_video.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('create_video.subtitle')}
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Upload State */}
            {(status === "idle" || status === "uploading") && (
              <>
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-500/10 via-purple-50 to-violet-50 px-6 sm:px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {t('create_video.upload_image')}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {t('create_video.file_formats')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Image Upload Area */}
                  <div
                    className={`
                      relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
                      ${isDragging
                        ? 'border-purple-500 bg-purple-50'
                        : imagePreview
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-gray-200 hover:border-purple-400/50 hover:bg-purple-50/30'
                      }
                    `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {imagePreview ? (
                      <div className="p-4 sm:p-6">
                        <div className="relative max-w-md mx-auto">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto max-h-72 object-contain rounded-xl shadow-lg"
                          />
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <button
                          onClick={handleReset}
                          className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                        >
                          <Upload className="w-4 h-4" />
                          {t('create_video.change_image')}
                        </button>
                      </div>
                    ) : (
                      <label className="block p-8 sm:p-12 cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center text-center">
                          <div className={`
                            w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all
                            ${isDragging ? 'bg-purple-600 scale-110' : 'bg-gradient-to-br from-purple-100 to-violet-100'}
                          `}>
                            <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-white' : 'text-purple-600'}`} />
                          </div>
                          <div className="text-base sm:text-lg mb-2">
                            <span className="font-semibold text-purple-600">{t('create_video.click_to_select')}</span>
                            <span className="text-gray-500"> {t('create_video.or_drag')}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {t('create_video.file_formats')}
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Generate Button */}
                  {imagePreview && (
                    <button
                      onClick={handleGenerateVideo}
                      disabled={isGenerating}
                      className="
                        w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                        text-white font-semibold text-lg
                        bg-purple-600 hover:bg-purple-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
                        shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                        group
                      "
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t('create_video.button_generating')}
                        </>
                      ) : (
                        <>
                          <Video className="w-5 h-5" />
                          {t('create_video.button_generate')}
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Processing State */}
            {status === "processing" && (
              <div className="p-8 sm:p-12">
                <div className="text-center max-w-md mx-auto">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 animate-spin" style={{ animationDuration: '3s' }}>
                      <div className="absolute inset-1 rounded-full bg-white"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {t('create_video.generating_title')}
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">
                    {t('create_video.generating_description')}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    {t('create_video.please_wait')}
                  </div>
                </div>
              </div>
            )}

            {/* Complete State */}
            {status === "complete" && (
              <div className="p-6 sm:p-8 space-y-6">
                {/* Success Header */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {t('create_video.success_title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('create_video.success_description')}
                  </p>
                </div>

                {/* Video Player */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full aspect-video"
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={videoUrl}
                    download
                    className="
                      flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl
                      text-white font-semibold text-lg
                      bg-purple-600 hover:bg-purple-700
                      transition-all duration-300
                      shadow-lg shadow-purple-500/30 hover:shadow-xl
                    "
                  >
                    <Download className="w-5 h-5" />
                    {t('create_video.button_download')}
                  </a>
                  <button
                    onClick={handleReset}
                    className="
                      flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl
                      text-gray-700 font-semibold text-lg
                      bg-gray-100 hover:bg-gray-200
                      transition-all duration-300
                    "
                  >
                    <RefreshCw className="w-5 h-5" />
                    {t('create_video.button_create_new')}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {status === "error" && (
              <div className="p-8 sm:p-12">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {t('create_video.error_occurred')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {errorMessage}
                  </p>
                  <button
                    onClick={handleReset}
                    className="
                      inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl
                      text-white font-semibold
                      bg-purple-600 hover:bg-purple-700
                      transition-all duration-300
                      shadow-lg shadow-purple-500/30
                    "
                  >
                    <RefreshCw className="w-5 h-5" />
                    {t('create_video.button_create_new')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateVideo;
