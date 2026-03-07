import React, { useState } from 'react';
import { useAdminPackages, useCreatePackage, useUpdatePackage, useDeletePackage } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package as PackageIcon, Plus, Edit, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Package {
  id: number;
  package_type: 'one_time' | 'subscription';
  name: string;
  name_uz?: string;
  name_ru?: string;
  price_uzs: string;
  included_generations: number;
  description?: string;
  description_uz?: string;
  description_ru?: string;
  is_active: boolean;
  sort_order: number;
  total_purchases?: number;
  created_at?: string;
  updated_at?: string;
}

const Packages = () => {
  const { toast } = useToast();
  const { data: packagesData, isLoading, refetch } = useAdminPackages();
  const createPackageMutation = useCreatePackage();
  const updatePackageMutation = useUpdatePackage();
  const deletePackageMutation = useDeletePackage();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    package_type: 'one_time' as 'one_time' | 'subscription',
    name: '',
    name_uz: '',
    name_ru: '',
    price_uzs: '',
    included_generations: 0,
    description: '',
    description_uz: '',
    description_ru: '',
    is_active: true,
    sort_order: 0,
  });

  const packages = Array.isArray(packagesData?.results)
    ? packagesData.results
    : Array.isArray(packagesData)
    ? packagesData
    : [];

  const resetForm = () => {
    setFormData({
      package_type: 'one_time',
      name: '',
      name_uz: '',
      name_ru: '',
      price_uzs: '',
      included_generations: 0,
      description: '',
      description_uz: '',
      description_ru: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.price_uzs || !formData.included_generations) {
      toast({
        title: 'Validation Error',
        description: 'Name, Price, and Included Generations are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPackageMutation.mutateAsync(formData);
      toast({ title: 'Success', description: 'Package created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create package',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedPackage) return;

    try {
      await updatePackageMutation.mutateAsync({
        packageId: selectedPackage.id,
        data: formData,
      });
      toast({ title: 'Success', description: 'Package updated successfully' });
      setIsEditDialogOpen(false);
      setSelectedPackage(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update package',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;

    try {
      await deletePackageMutation.mutateAsync(selectedPackage.id);
      toast({ title: 'Success', description: 'Package deleted successfully' });
      setIsDeleteDialogOpen(false);
      setSelectedPackage(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete package',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    setFormData({
      package_type: pkg.package_type || 'one_time',
      name: pkg.name,
      name_uz: pkg.name_uz || '',
      name_ru: pkg.name_ru || '',
      price_uzs: pkg.price_uzs,
      included_generations: pkg.included_generations,
      description: pkg.description || '',
      description_uz: pkg.description_uz || '',
      description_ru: pkg.description_ru || '',
      is_active: pkg.is_active,
      sort_order: pkg.sort_order,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
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
          <h1 className="text-3xl font-bold text-gray-900">Packages Management</h1>
          <p className="text-gray-500 mt-1">Manage subscription packages</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))
        ) : packages.length > 0 ? (
          packages.map((pkg: Package) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageIcon className="w-5 h-5" />
                    {pkg.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={pkg.package_type === 'subscription' ? 'default' : 'secondary'}>
                      {pkg.package_type === 'subscription' ? 'Subscription' : 'One-Time'}
                    </Badge>
                    <span className={`text-xs px-2 py-1 rounded ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Credits</p>
                    <p className="text-2xl font-bold">{pkg.included_generations}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold">{parseFloat(pkg.price_uzs).toLocaleString()} UZS</p>
                  </div>
                  {pkg.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                  )}
                  {pkg.total_purchases !== undefined && (
                    <div className="text-sm text-gray-500">
                      Purchases: {pkg.total_purchases}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(pkg)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(pkg)}
                      disabled={deletePackageMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="py-12">
              <p className="text-center text-gray-500">No packages found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Package</DialogTitle>
            <DialogDescription>Add a new subscription package</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create_package_type">Package Type *</Label>
              <Select
                value={formData.package_type}
                onValueChange={(value: 'one_time' | 'subscription') =>
                  setFormData({ ...formData, package_type: value })
                }
              >
                <SelectTrigger id="create_package_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-Time Purchase (Credit Pack)</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="create_name">Name (EN) *</Label>
                <Input
                  id="create_name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Premium"
                />
              </div>
              <div>
                <Label htmlFor="create_name_uz">Name (UZ)</Label>
                <Input
                  id="create_name_uz"
                  value={formData.name_uz}
                  onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                  placeholder="Premium"
                />
              </div>
              <div>
                <Label htmlFor="create_name_ru">Name (RU)</Label>
                <Input
                  id="create_name_ru"
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                  placeholder="Премиум"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="create_price">Price (UZS) *</Label>
                <Input
                  id="create_price"
                  type="number"
                  value={formData.price_uzs}
                  onChange={(e) => setFormData({ ...formData, price_uzs: e.target.value })}
                  placeholder="500000"
                />
              </div>
              <div>
                <Label htmlFor="create_credits">Credits *</Label>
                <Input
                  id="create_credits"
                  type="number"
                  value={formData.included_generations}
                  onChange={(e) => setFormData({ ...formData, included_generations: parseInt(e.target.value) || 0 })}
                  placeholder="100"
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
            </div>
            <div>
              <Label htmlFor="create_description">Description (EN)</Label>
              <Textarea
                id="create_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Premium package with 100 credits"
              />
            </div>
            <div>
              <Label htmlFor="create_description_uz">Description (UZ)</Label>
              <Textarea
                id="create_description_uz"
                value={formData.description_uz}
                onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="create_description_ru">Description (RU)</Label>
              <Textarea
                id="create_description_ru"
                value={formData.description_ru}
                onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
              />
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
            <Button onClick={handleCreate} disabled={createPackageMutation.isPending}>
              {createPackageMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update package details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_package_type">Package Type *</Label>
              <Select
                value={formData.package_type}
                onValueChange={(value: 'one_time' | 'subscription') =>
                  setFormData({ ...formData, package_type: value })
                }
              >
                <SelectTrigger id="edit_package_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-Time Purchase (Credit Pack)</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit_name">Name (EN) *</Label>
                <Input
                  id="edit_name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_name_uz">Name (UZ)</Label>
                <Input
                  id="edit_name_uz"
                  value={formData.name_uz}
                  onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_name_ru">Name (RU)</Label>
                <Input
                  id="edit_name_ru"
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit_price">Price (UZS) *</Label>
                <Input
                  id="edit_price"
                  type="number"
                  value={formData.price_uzs}
                  onChange={(e) => setFormData({ ...formData, price_uzs: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_credits">Credits *</Label>
                <Input
                  id="edit_credits"
                  type="number"
                  value={formData.included_generations}
                  onChange={(e) => setFormData({ ...formData, included_generations: parseInt(e.target.value) || 0 })}
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
            </div>
            <div>
              <Label htmlFor="edit_description">Description (EN)</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_description_uz">Description (UZ)</Label>
              <Textarea
                id="edit_description_uz"
                value={formData.description_uz}
                onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_description_ru">Description (RU)</Label>
              <Textarea
                id="edit_description_ru"
                value={formData.description_ru}
                onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
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
            <Button onClick={handleEdit} disabled={updatePackageMutation.isPending}>
              {updatePackageMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedPackage?.name}</strong>?
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
              disabled={deletePackageMutation.isPending}
            >
              {deletePackageMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Packages;
