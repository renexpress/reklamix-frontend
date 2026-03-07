import React, { useState } from 'react';
import { useAdminSamples, useCreateSample, useUpdateSample, useDeleteSample } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Image as ImageIcon, Trash2, Edit, Plus, Upload } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

interface Sample {
  id: number;
  title: string;
  image: string;
  sort_order: number;
  is_active: boolean;
  created_by?: number;
  created_by_phone?: string;
  created_at?: string;
  updated_at?: string;
}

const Samples = () => {
  const { toast } = useToast();
  const { data: samplesData, isLoading, refetch } = useAdminSamples();
  const createSampleMutation = useCreateSample();
  const updateSampleMutation = useUpdateSample();
  const deleteSampleMutation = useDeleteSample();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    sort_order: 0,
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const samples = Array.isArray(samplesData?.results)
    ? samplesData.results
    : Array.isArray(samplesData)
    ? samplesData
    : [];

  const resetForm = () => {
    setFormData({
      title: '',
      sort_order: 0,
      is_active: true,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !selectedFile) {
      toast({
        title: 'Validation Error',
        description: 'Title and Image are required',
        variant: 'destructive',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('sort_order', formData.sort_order.toString());
    formDataToSend.append('is_active', formData.is_active.toString());
    formDataToSend.append('image', selectedFile);

    try {
      await createSampleMutation.mutateAsync(formDataToSend);
      toast({ title: 'Success', description: 'Sample created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create sample',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedSample) return;

    try {
      await updateSampleMutation.mutateAsync({
        sampleId: selectedSample.id,
        data: {
          title: formData.title,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        },
      });
      toast({ title: 'Success', description: 'Sample updated successfully' });
      setIsEditDialogOpen(false);
      setSelectedSample(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update sample',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedSample) return;

    try {
      await deleteSampleMutation.mutateAsync(selectedSample.id);
      toast({ title: 'Success', description: 'Sample deleted successfully' });
      setIsDeleteDialogOpen(false);
      setSelectedSample(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete sample',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (sample: Sample) => {
    setSelectedSample(sample);
    setFormData({
      title: sample.title,
      sort_order: sample.sort_order,
      is_active: sample.is_active,
    });
    setPreviewUrl(sample.image);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (sample: Sample) => {
    setSelectedSample(sample);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Samples Management</h1>
          <p className="text-gray-500 mt-1">Manage sample images for the main page</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Sample
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Samples ({samples.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : samples.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {samples.map((sample: Sample) => (
                <Card key={sample.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                      <img
                        src={sample.image}
                        alt={sample.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium mb-2">{sample.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Order: {sample.sort_order}</span>
                      <span className={sample.is_active ? 'text-green-600' : 'text-red-600'}>
                        {sample.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(sample)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(sample)}
                        disabled={deleteSampleMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No samples found</p>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Sample</DialogTitle>
            <DialogDescription>Add a new sample image to the main page</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create_title">Title *</Label>
              <Input
                id="create_title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Sample Product"
              />
            </div>
            <div>
              <Label htmlFor="create_sort_order">Sort Order</Label>
              <Input
                id="create_sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="create_image">Image *</Label>
              <div className="mt-2">
                <label htmlFor="create_image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                  )}
                  <input
                    id="create_image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="create_is_active">Active</Label>
              <Switch
                id="create_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createSampleMutation.isPending}>
              {createSampleMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Sample</DialogTitle>
            <DialogDescription>Update sample details (image cannot be changed)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewUrl && (
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Current" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <Label htmlFor="edit_title">Title *</Label>
              <Input
                id="edit_title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_sort_order">Sort Order</Label>
              <Input
                id="edit_sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit_is_active">Active</Label>
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updateSampleMutation.isPending}>
              {updateSampleMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sample</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedSample?.title}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteSampleMutation.isPending}
            >
              {deleteSampleMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Samples;
