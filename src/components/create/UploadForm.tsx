/**
 * Upload Form Component
 * Step 1: Upload images (up to 6) and select mode/language - Premium Design
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { usePlatforms, useCreateJob } from '@/hooks/useApi';
import { getErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, ShoppingBag, Megaphone, ArrowRight, Globe, Check, Images, X, Plus } from 'lucide-react';

type UploadFormData = {
  uploaded_images: any;
  product_info_text?: string;
  generation_mode: 'marketplace' | 'advertisement';
  language: 'uz' | 'ru' | 'tr' | 'en';
  image_count: number;
};

interface ImageFile {
  file: File;
  preview: string;
}

interface UploadFormProps {
  onJobCreated: (jobId: number, job: any) => void;
  onStartAnalysis?: (formData: FormData, imageCount: number, generationMode: 'marketplace' | 'advertisement') => void;
}

const MAX_IMAGES = 6;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const UploadForm: React.FC<UploadFormProps> = ({ onJobCreated, onStartAnalysis }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadSchema = z.object({
    uploaded_images: z.any().refine((files) => files?.length > 0, t('create.upload.error_select_image')),
    product_info_text: z.string().optional(),
    generation_mode: z.enum(['marketplace', 'advertisement'], {
      required_error: 'Please select a generation mode',
    }),
    language: z.enum(['uz', 'ru', 'tr', 'en'], {
      required_error: 'Please select a language',
    }),
    image_count: z.number().min(1).max(6).default(1),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      generation_mode: 'advertisement',
      language: 'uz',
      image_count: 1,
    },
  });

  const selectedMode = watch('generation_mode');
  const selectedLanguage = watch('language');
  const selectedImageCount = watch('image_count');

  // Legacy mutation - only used if onStartAnalysis is not provided
  const createJobMutation = useCreateJob({
    onSuccess: (response) => {
      const job = response.data;
      // Legacy flow - used when onStartAnalysis is not provided
      toast({
        title: t('create.upload.toast_uploaded_title'),
        description: t('create.upload.toast_uploaded_desc'),
      });
      onJobCreated(job.id, job);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: t('create.upload.toast_error_title'),
        description: getErrorMessage(error),
      });
    },
  });

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return t('create.upload.error_file_type');
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return t('create.upload.error_file_size', { size: MAX_FILE_SIZE_MB });
    }
    return null;
  };

  const addImages = (files: File[]) => {
    const validFiles: ImageFile[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (selectedImages.length + validFiles.length >= MAX_IMAGES) {
        errors.push(t('create.upload.error_max_images', { max: MAX_IMAGES }));
        break;
      }

      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview });
    }

    if (errors.length > 0) {
      toast({
        variant: 'destructive',
        title: t('create.upload.toast_error_title'),
        description: errors.join('\n'),
      });
    }

    if (validFiles.length > 0) {
      const newImages = [...selectedImages, ...validFiles];
      setSelectedImages(newImages);
      setValue('uploaded_images', newImages.map(img => img.file));
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    // Revoke the URL to free memory
    URL.revokeObjectURL(selectedImages[index].preview);
    setSelectedImages(newImages);
    setValue('uploaded_images', newImages.length > 0 ? newImages.map(img => img.file) : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addImages(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      addImages(files);
    }
  };

  const onSubmit = (data: UploadFormData) => {
    if (selectedImages.length === 0) return;
    if (createJobMutation.isPending) return;

    const formData = new FormData();

    // Append all images with the same field name (Django will receive as list)
    selectedImages.forEach((img) => {
      formData.append('uploaded_images', img.file);
    });

    formData.append('generation_mode', data.generation_mode);
    formData.append('language', data.language);
    formData.append('image_count', String(data.image_count));
    if (data.product_info_text) {
      formData.append('product_info_text', data.product_info_text);
    }

    // NEW: If onStartAnalysis is provided, use immediate transition flow
    if (onStartAnalysis) {
      // Immediately transition to analyzing stage - parent handles the API call
      onStartAnalysis(formData, data.image_count, data.generation_mode);
    } else {
      // Legacy flow - mutation handled here
      createJobMutation.mutate(formData);
    }
  };

  const languages = [
    { code: 'uz', name: t('create.upload.language_uzbek'), flag: '\u{1F1FA}\u{1F1FF}' },
    { code: 'ru', name: t('create.upload.language_russian'), flag: '\u{1F1F7}\u{1F1FA}' },
    { code: 'tr', name: t('create.upload.language_turkish'), flag: '\u{1F1F9}\u{1F1F7}' },
    { code: 'en', name: t('create.upload.language_english'), flag: '\u{1F1EC}\u{1F1E7}' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Image Upload */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900">
          {t('create.upload.image_label')}
          <span className="text-sm text-gray-400 font-normal ml-2">
            ({selectedImages.length}/{MAX_IMAGES})
          </span>
        </Label>

        {/* Image Grid */}
        {selectedImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
            {selectedImages.map((img, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                />
                {index === 0 && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#2AABAB] text-white text-xs font-medium rounded">
                    {t('create.upload.primary_image')}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add more button */}
            {selectedImages.length < MAX_IMAGES && (
              <label
                htmlFor="add-more-images"
                className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:border-[#2AABAB] hover:bg-teal-50/30 cursor-pointer transition-all"
              >
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">{t('create.upload.add_more')}</span>
                <Input
                  id="add-more-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={createJobMutation.isPending}
                />
              </label>
            )}
          </div>
        )}

        {/* Drop zone (shown when no images or as additional area) */}
        {selectedImages.length === 0 && (
          <div
            className={`
              relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
              ${isDragging
                ? 'border-[#2AABAB] bg-teal-50'
                : 'border-gray-200 hover:border-[#2AABAB]/50 hover:bg-teal-50/30'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label htmlFor="image" className="block p-8 sm:p-12 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all
                  ${isDragging ? 'bg-[#2AABAB] scale-110' : 'bg-gradient-to-br from-teal-100 to-teal-100'}
                `}>
                  <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-white' : 'text-[#2AABAB]'}`} />
                </div>
                <div className="text-base sm:text-lg mb-2">
                  <span className="font-semibold text-[#2AABAB]">{t('create.upload.click_to_select')}</span>
                  <span className="text-gray-500"> {t('create.upload.or_drag')}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {t('create.upload.file_formats')}
                </p>
                <p className="text-sm text-[#2AABAB] font-medium">
                  {t('create.upload.multi_image_hint', { max: MAX_IMAGES })}
                </p>
              </div>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={createJobMutation.isPending}
              />
            </label>
          </div>
        )}

        {/* Multi-image info */}
        {selectedImages.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
            <Images className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              {t('create.upload.multi_image_info')}
            </p>
          </div>
        )}

        {errors.uploaded_images && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.uploaded_images.message as string}
          </p>
        )}
      </div>

      {/* Generation Mode Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-900">{t('create.upload.mode_label')}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Marketplace Option */}
          <button
            type="button"
            onClick={() => setValue('generation_mode', 'marketplace')}
            disabled={createJobMutation.isPending}
            className={`
              relative p-5 rounded-2xl text-left transition-all duration-300 group overflow-hidden
              ${selectedMode === 'marketplace'
                ? 'bg-gradient-to-br from-[#2AABAB]/10 to-teal-50 border-2 border-[#2AABAB] shadow-lg shadow-teal-500/10'
                : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-md'
              }
            `}
          >
            {selectedMode === 'marketplace' && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#2AABAB] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="space-y-3">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${selectedMode === 'marketplace' ? 'bg-[#2AABAB]' : 'bg-gray-100 group-hover:bg-teal-100'}
              `}>
                <ShoppingBag className={`w-6 h-6 ${selectedMode === 'marketplace' ? 'text-white' : 'text-gray-500 group-hover:text-[#2AABAB]'}`} />
              </div>
              <div className="font-bold text-lg text-gray-900">{t('create.upload.mode_marketplace')}</div>
              <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src="https://shvfyrybczhiwfbaxkyu.supabase.co/storage/v1/object/public/course-images/market_place_sample.jpeg"
                  alt="Marketplace sample"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t('create.upload.mode_marketplace_desc')}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Uzum', 'Wildberries', 'Trendyol'].map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>

          {/* Advertisement Option */}
          <button
            type="button"
            onClick={() => setValue('generation_mode', 'advertisement')}
            disabled={createJobMutation.isPending}
            className={`
              relative p-5 rounded-2xl text-left transition-all duration-300 group overflow-hidden
              ${selectedMode === 'advertisement'
                ? 'bg-gradient-to-br from-purple-500/10 to-purple-50 border-2 border-purple-500 shadow-lg shadow-purple-500/10'
                : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-md'
              }
            `}
          >
            {selectedMode === 'advertisement' && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="space-y-3">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${selectedMode === 'advertisement' ? 'bg-purple-500' : 'bg-gray-100 group-hover:bg-purple-100'}
              `}>
                <Megaphone className={`w-6 h-6 ${selectedMode === 'advertisement' ? 'text-white' : 'text-gray-500 group-hover:text-purple-500'}`} />
              </div>
              <div className="font-bold text-lg text-gray-900">{t('create.upload.mode_advertisement')}</div>
              <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src="https://shvfyrybczhiwfbaxkyu.supabase.co/storage/v1/object/public/course-images/ad_sample.jpeg"
                  alt="Advertisement sample"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t('create.upload.mode_advertisement_desc')}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Instagram', 'Social Media', 'Ads'].map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        </div>
        {errors.generation_mode && (
          <p className="text-sm text-red-500">{errors.generation_mode.message}</p>
        )}
      </div>

      {/* Language Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          {t('create.upload.language_label')}
        </Label>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setValue('language', lang.code as 'uz' | 'ru' | 'tr' | 'en')}
              disabled={createJobMutation.isPending}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
                ${selectedLanguage === lang.code
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
        {errors.language && (
          <p className="text-sm text-red-500">{errors.language.message}</p>
        )}
      </div>

      {/* Image Count Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Images className="w-4 h-4 text-gray-400" />
          {t('create.upload.image_count_label')}
        </Label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setValue('image_count', count)}
              disabled={createJobMutation.isPending}
              className={`
                w-12 h-12 rounded-xl font-bold text-lg transition-all
                ${selectedImageCount === count
                  ? 'bg-[#2AABAB] text-white shadow-lg shadow-teal-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-[#2AABAB]'
                }
              `}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          {t('create.upload.image_count_hint', { count: selectedImageCount })}
          <span className="text-[#2AABAB] font-medium">
            {selectedImageCount} {selectedImageCount === 1 ? t('create.upload.credit') : t('create.upload.credits')}
          </span>
        </p>
      </div>

      {/* Product Info (Optional) */}
      <div className="space-y-3">
        <Label htmlFor="product_info" className="text-base font-semibold text-gray-900">
          {t('create.upload.product_info_label')}
          <span className="text-gray-400 font-normal ml-2">{t('create.upload.product_info_optional')}</span>
        </Label>
        <Textarea
          id="product_info"
          placeholder={t('create.upload.product_info_placeholder')}
          rows={3}
          className="resize-none rounded-xl border-gray-200 focus:border-[#2AABAB] focus:ring-[#2AABAB]/20 text-base"
          {...register('product_info_text')}
          disabled={createJobMutation.isPending}
        />
        <p className="text-sm text-gray-400">
          {t('create.upload.product_info_hint')}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={createJobMutation.isPending || selectedImages.length === 0}
        className="
          w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl
          text-white font-semibold text-lg
          bg-[#2AABAB] hover:bg-[#228F8F]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300
          shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40
          group
        "
      >
        <ImageIcon className="w-5 h-5" />
        {selectedImages.length > 1
          ? t('create.upload.button_upload_multiple', { count: selectedImages.length })
          : t('create.upload.button_upload')
        }
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
};
