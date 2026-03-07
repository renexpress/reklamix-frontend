import React, { useState } from 'react';
import { useAdminVideos, useCreateVideo, useUpdateVideo, useDeleteVideo } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Video as VideoIcon, Trash2, Edit, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const Videos = () => {
  const { toast } = useToast();
  const { data: videosData, isLoading, refetch } = useAdminVideos();
  const createVideoMutation = useCreateVideo();
  const updateVideoMutation = useUpdateVideo();
  const deleteVideoMutation = useDeleteVideo();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  const videos = Array.isArray(videosData) ? videosData : [];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      sort_order: 0,
      is_active: true,
    });
    setSelectedVideoFile(null);
    setSelectedThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !selectedVideoFile) {
      toast({
        title: 'Validation Error',
        description: 'Title and Video file are required',
        variant: 'destructive',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('sort_order', formData.sort_order.toString());
    formDataToSend.append('is_active', formData.is_active.toString());
    formDataToSend.append('video_file', selectedVideoFile);
    if (selectedThumbnailFile) {
      formDataToSend.append('thumbnail_file', selectedThumbnailFile);
    }

    try {
      await createVideoMutation.mutateAsync(formDataToSend);
      toast({ title: 'Success', description: 'Video created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create video',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedVideo || !formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('sort_order', formData.sort_order.toString());
    formDataToSend.append('is_active', formData.is_active.toString());

    if (selectedVideoFile) {
      formDataToSend.append('video_file', selectedVideoFile);
    }
    if (selectedThumbnailFile) {
      formDataToSend.append('thumbnail_file', selectedThumbnailFile);
    }

    try {
      await updateVideoMutation.mutateAsync({ id: selectedVideo.id, formData: formDataToSend });
      toast({ title: 'Success', description: 'Video updated successfully' });
      setIsEditDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update video',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedVideo) return;

    try {
      await deleteVideoMutation.mutateAsync(selectedVideo.id);
      toast({ title: 'Success', description: 'Video deleted successfully' });
      setIsDeleteDialogOpen(false);
      setSelectedVideo(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete video',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      sort_order: video.sort_order,
      is_active: video.is_active,
    });
    setVideoPreviewUrl(video.video_url);
    setThumbnailPreviewUrl(video.thumbnail_url || null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (video: Video) => {
    setSelectedVideo(video);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Videos</h1>
        <Button onClick={() => {
          resetForm();
          setIsCreateDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <VideoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No videos yet</p>
            <Button onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Video
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-4">
                <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
                  <video
                    src={video.video_url}
                    className="w-full h-48 object-cover"
                    poster={video.thumbnail_url || undefined}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${video.is_active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {video.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  Order: {video.sort_order}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(video)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(video)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
            <DialogDescription>
              Upload a video to showcase on the main page
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Video title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="video-file">Video File *</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleVideoFileChange}
              />
              {videoPreviewUrl && (
                <video src={videoPreviewUrl} controls className="mt-2 w-full rounded-lg max-h-64" />
              )}
            </div>

            <div>
              <Label htmlFor="thumbnail-file">Thumbnail (Optional)</Label>
              <Input
                id="thumbnail-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbnailFileChange}
              />
              {thumbnailPreviewUrl && (
                <img src={thumbnailPreviewUrl} alt="Thumbnail preview" className="mt-2 w-full rounded-lg max-h-32 object-cover" />
              )}
            </div>

            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createVideoMutation.isPending}>
              {createVideoMutation.isPending ? 'Creating...' : 'Create Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update video information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Video title"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-video-file">Replace Video (Optional)</Label>
              <Input
                id="edit-video-file"
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleVideoFileChange}
              />
              {videoPreviewUrl && (
                <video src={videoPreviewUrl} controls className="mt-2 w-full rounded-lg max-h-64" />
              )}
            </div>

            <div>
              <Label htmlFor="edit-thumbnail-file">Replace Thumbnail (Optional)</Label>
              <Input
                id="edit-thumbnail-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbnailFileChange}
              />
              {thumbnailPreviewUrl && (
                <img src={thumbnailPreviewUrl} alt="Thumbnail preview" className="mt-2 w-full rounded-lg max-h-32 object-cover" />
              )}
            </div>

            <div>
              <Label htmlFor="edit-sort_order">Sort Order</Label>
              <Input
                id="edit-sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateVideoMutation.isPending}>
              {updateVideoMutation.isPending ? 'Updating...' : 'Update Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedVideo?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteVideoMutation.isPending}>
              {deleteVideoMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Videos;
