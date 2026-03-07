import React, { useState } from 'react';
import { useAdminPlatforms, useCreatePlatform, useUpdatePlatform, useDeletePlatform } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Globe } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Platform {
  slug: string;
  display_name: string;
  is_active: boolean;
  total_jobs?: number;
}

// Predefined platform choices (must match backend)
const PLATFORM_CHOICES = [
  { value: 'wildberries', label: 'Wildberries' },
  { value: 'ozon', label: 'Ozon' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
];

const Platforms = () => {
  const { toast } = useToast();
  const { data: platformsData, isLoading, refetch } = useAdminPlatforms();
  const createPlatformMutation = useCreatePlatform();
  const updatePlatformMutation = useUpdatePlatform();
  const deletePlatformMutation = useDeletePlatform();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    slug: '',
    display_name: '',
    is_active: true,
  });

  const platforms = Array.isArray(platformsData?.results) ? platformsData.results : [];

  const resetForm = () => {
    setFormData({
      slug: '',
      display_name: '',
      is_active: true,
    });
  };

  const handleCreate = async () => {
    if (!formData.slug || !formData.display_name) {
      toast({
        title: 'Validation Error',
        description: 'Slug and Display Name are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPlatformMutation.mutateAsync(formData);
      toast({ title: 'Success', description: 'Platform created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create platform',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedPlatform) return;

    try {
      await updatePlatformMutation.mutateAsync({
        slug: selectedPlatform.slug,
        data: {
          display_name: formData.display_name,
          is_active: formData.is_active,
        },
      });
      toast({ title: 'Success', description: 'Platform updated successfully' });
      setIsEditDialogOpen(false);
      setSelectedPlatform(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update platform',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPlatform) return;

    try {
      await deletePlatformMutation.mutateAsync(selectedPlatform.slug);
      toast({ title: 'Success', description: 'Platform deleted successfully' });
      setIsDeleteDialogOpen(false);
      setSelectedPlatform(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete platform',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (platform: Platform) => {
    setSelectedPlatform(platform);
    setFormData({
      slug: platform.slug,
      display_name: platform.display_name,
      is_active: platform.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (platform: Platform) => {
    setSelectedPlatform(platform);
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
          <h1 className="text-3xl font-bold text-gray-900">Platforms Management</h1>
          <p className="text-gray-500 mt-1">Manage target platforms for image generation</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Platform
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platforms ({platforms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : platforms.length > 0 ? (
            <div className="space-y-4">
              {platforms.map((platform: Platform) => (
                <Card key={platform.slug}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{platform.display_name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Slug: {platform.slug}</span>
                            <span className={platform.is_active ? 'text-green-600' : 'text-red-600'}>
                              {platform.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {platform.total_jobs !== undefined && (
                              <span>Jobs: {platform.total_jobs}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(platform)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(platform)}
                          disabled={deletePlatformMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No platforms found</p>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Platform</DialogTitle>
            <DialogDescription>Add a new platform to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="slug">Platform *</Label>
              <Select
                value={formData.slug}
                onValueChange={(value) => {
                  const selected = PLATFORM_CHOICES.find(p => p.value === value);
                  setFormData({
                    ...formData,
                    slug: value,
                    display_name: selected?.label || value
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_CHOICES.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">Only predefined platforms can be created</p>
            </div>
            <div>
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Auto-filled from platform selection"
              />
              <p className="text-xs text-gray-500 mt-1">You can customize the display name</p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createPlatformMutation.isPending}>
              {createPlatformMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Platform</DialogTitle>
            <DialogDescription>Update platform details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Slug</Label>
              <Input value={formData.slug} disabled />
              <p className="text-xs text-gray-500 mt-1">Slug cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="edit_display_name">Display Name *</Label>
              <Input
                id="edit_display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
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
            <Button onClick={handleEdit} disabled={updatePlatformMutation.isPending}>
              {updatePlatformMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Platform</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedPlatform?.display_name}</strong>?
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
              disabled={deletePlatformMutation.isPending}
            >
              {deletePlatformMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Platforms;
