import React, { useState } from 'react';
import {
  useAdminMarketplaceCategories,
  useCreateMarketplaceCategory,
  useUpdateMarketplaceCategory,
  useDeleteMarketplaceCategory,
  useAdminMarketplaceSubcategories,
  useCreateMarketplaceSubcategory,
  useUpdateMarketplaceSubcategory,
  useDeleteMarketplaceSubcategory,
} from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Layers, Plus, Edit, Trash2, ChevronRight, FolderTree } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface MarketplaceCategory {
  id: number;
  key: string;
  name: string;
  description?: string;
  system_prompt?: string;
  is_active: boolean;
  sort_order: number;
  subcategory_count?: number;
  template_count?: number;
  created_at?: string;
}

interface MarketplaceSubcategory {
  id: number;
  category: number;
  category_name?: string;
  key: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  template_count?: number;
  has_template_pack?: boolean;
}

const MarketplaceCategories = () => {
  const { toast } = useToast();
  const { data: categoriesData, isLoading, refetch } = useAdminMarketplaceCategories();
  const createCategoryMutation = useCreateMarketplaceCategory();
  const updateCategoryMutation = useUpdateMarketplaceCategory();
  const deleteCategoryMutation = useDeleteMarketplaceCategory();

  const createSubcategoryMutation = useCreateMarketplaceSubcategory();
  const updateSubcategoryMutation = useUpdateMarketplaceSubcategory();
  const deleteSubcategoryMutation = useDeleteMarketplaceSubcategory();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { data: subcategoriesData, refetch: refetchSubcategories } = useAdminMarketplaceSubcategories(
    selectedCategoryId || undefined,
    { enabled: !!selectedCategoryId }
  );

  // Category dialogs
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | null>(null);

  // Subcategory dialogs
  const [isSubcategoryCreateOpen, setIsSubcategoryCreateOpen] = useState(false);
  const [isSubcategoryEditOpen, setIsSubcategoryEditOpen] = useState(false);
  const [isSubcategoryDeleteOpen, setIsSubcategoryDeleteOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<MarketplaceSubcategory | null>(null);

  // Category form
  const [categoryForm, setCategoryForm] = useState({
    key: '',
    name: '',
    description: '',
    system_prompt: '',
    is_active: true,
    sort_order: 0,
  });

  // Subcategory form
  const [subcategoryForm, setSubcategoryForm] = useState({
    category: 0,
    key: '',
    name: '',
    is_default: false,
    is_active: true,
    sort_order: 0,
  });

  const categories = Array.isArray(categoriesData?.results)
    ? categoriesData.results
    : Array.isArray(categoriesData)
    ? categoriesData
    : [];

  const subcategories = Array.isArray(subcategoriesData?.results)
    ? subcategoriesData.results
    : Array.isArray(subcategoriesData)
    ? subcategoriesData
    : [];

  // Category handlers
  const resetCategoryForm = () => {
    setCategoryForm({
      key: '',
      name: '',
      description: '',
      system_prompt: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.key || !categoryForm.name) {
      toast({ title: 'Validation Error', description: 'Key and Name are required', variant: 'destructive' });
      return;
    }

    try {
      await createCategoryMutation.mutateAsync(categoryForm);
      toast({ title: 'Success', description: 'Category created successfully' });
      setIsCategoryCreateOpen(false);
      resetCategoryForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({ id: selectedCategory.id, data: categoryForm });
      toast({ title: 'Success', description: 'Category updated successfully' });
      setIsCategoryEditOpen(false);
      setSelectedCategory(null);
      resetCategoryForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategoryMutation.mutateAsync(selectedCategory.id);
      toast({ title: 'Success', description: 'Category deleted successfully' });
      setIsCategoryDeleteOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const openCategoryEdit = (category: MarketplaceCategory) => {
    setSelectedCategory(category);
    setCategoryForm({
      key: category.key,
      name: category.name,
      description: category.description || '',
      system_prompt: category.system_prompt || '',
      is_active: category.is_active,
      sort_order: category.sort_order,
    });
    setIsCategoryEditOpen(true);
  };

  // Subcategory handlers
  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      category: selectedCategoryId || 0,
      key: '',
      name: '',
      is_default: false,
      is_active: true,
      sort_order: 0,
    });
  };

  const handleCreateSubcategory = async () => {
    if (!subcategoryForm.key || !subcategoryForm.name || !subcategoryForm.category) {
      toast({ title: 'Validation Error', description: 'Category, Key and Name are required', variant: 'destructive' });
      return;
    }

    try {
      await createSubcategoryMutation.mutateAsync(subcategoryForm);
      toast({ title: 'Success', description: 'Subcategory created successfully' });
      setIsSubcategoryCreateOpen(false);
      resetSubcategoryForm();
      refetchSubcategories();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create subcategory',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!selectedSubcategory) return;

    try {
      await updateSubcategoryMutation.mutateAsync({ id: selectedSubcategory.id, data: subcategoryForm });
      toast({ title: 'Success', description: 'Subcategory updated successfully' });
      setIsSubcategoryEditOpen(false);
      setSelectedSubcategory(null);
      resetSubcategoryForm();
      refetchSubcategories();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update subcategory',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSubcategory = async () => {
    if (!selectedSubcategory) return;

    try {
      await deleteSubcategoryMutation.mutateAsync(selectedSubcategory.id);
      toast({ title: 'Success', description: 'Subcategory deleted successfully' });
      setIsSubcategoryDeleteOpen(false);
      setSelectedSubcategory(null);
      refetchSubcategories();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete subcategory',
        variant: 'destructive',
      });
    }
  };

  const openSubcategoryCreate = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSubcategoryForm({
      category: categoryId,
      key: '',
      name: '',
      is_default: false,
      is_active: true,
      sort_order: 0,
    });
    setIsSubcategoryCreateOpen(true);
  };

  const openSubcategoryEdit = (subcategory: MarketplaceSubcategory) => {
    setSelectedSubcategory(subcategory);
    setSubcategoryForm({
      category: subcategory.category,
      key: subcategory.key,
      name: subcategory.name,
      is_default: subcategory.is_default,
      is_active: subcategory.is_active,
      sort_order: subcategory.sort_order,
    });
    setIsSubcategoryEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Categories</h1>
          <p className="text-gray-500 mt-1">Manage product categories and subcategories</p>
        </div>
        <Button onClick={() => { resetCategoryForm(); setIsCategoryCreateOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-4">
          {categories.map((category: MarketplaceCategory) => (
            <AccordionItem key={category.id} value={`category-${category.id}`} className="border rounded-lg">
              <AccordionTrigger
                className="px-6 py-4 hover:no-underline"
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="text-sm text-gray-500">
                      {category.subcategory_count || 0} subcategories
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => openCategoryEdit(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedCategory(category); setIsCategoryDeleteOpen(true); }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <FolderTree className="w-4 h-4" />
                      Subcategories
                    </h4>
                    <Button size="sm" variant="outline" onClick={() => openSubcategoryCreate(category.id)}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Subcategory
                    </Button>
                  </div>

                  {selectedCategoryId === category.id && subcategories.length > 0 ? (
                    <div className="grid gap-2">
                      {subcategories.map((sub: MarketplaceSubcategory) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{sub.name}</p>
                              <p className="text-xs text-gray-500">{sub.key}</p>
                            </div>
                            {sub.is_default && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {sub.template_count || 0} templates
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${sub.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {sub.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => openSubcategoryEdit(sub)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setSelectedSubcategory(sub); setIsSubcategoryDeleteOpen(true); }}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedCategoryId === category.id ? (
                    <p className="text-sm text-gray-500 text-center py-4">No subcategories yet</p>
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">No categories found</p>
          </CardContent>
        </Card>
      )}

      {/* Create Category Dialog */}
      <Dialog open={isCategoryCreateOpen} onOpenChange={setIsCategoryCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>Add a new marketplace product category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cat_key">Key *</Label>
                <Input
                  id="cat_key"
                  value={categoryForm.key}
                  onChange={(e) => setCategoryForm({ ...categoryForm, key: e.target.value })}
                  placeholder="beauty_cosmetics"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier (snake_case)</p>
              </div>
              <div>
                <Label htmlFor="cat_name">Name *</Label>
                <Input
                  id="cat_name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Beauty & Cosmetics"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cat_description">Description</Label>
              <Textarea
                id="cat_description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Category description..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="cat_system_prompt">System Prompt (for AI)</Label>
              <Textarea
                id="cat_system_prompt"
                value={categoryForm.system_prompt}
                onChange={(e) => setCategoryForm({ ...categoryForm, system_prompt: e.target.value })}
                placeholder="AI system prompt for template customization..."
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cat_sort_order">Sort Order</Label>
                <Input
                  id="cat_sort_order"
                  type="number"
                  value={categoryForm.sort_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label htmlFor="cat_is_active">Active</Label>
                <Switch
                  id="cat_is_active"
                  checked={categoryForm.is_active}
                  onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, is_active: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={createCategoryMutation.isPending}>
              {createCategoryMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isCategoryEditOpen} onOpenChange={setIsCategoryEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_cat_key">Key *</Label>
                <Input
                  id="edit_cat_key"
                  value={categoryForm.key}
                  onChange={(e) => setCategoryForm({ ...categoryForm, key: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_cat_name">Name *</Label>
                <Input
                  id="edit_cat_name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit_cat_description">Description</Label>
              <Textarea
                id="edit_cat_description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="edit_cat_system_prompt">System Prompt (for AI)</Label>
              <Textarea
                id="edit_cat_system_prompt"
                value={categoryForm.system_prompt}
                onChange={(e) => setCategoryForm({ ...categoryForm, system_prompt: e.target.value })}
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_cat_sort_order">Sort Order</Label>
                <Input
                  id="edit_cat_sort_order"
                  type="number"
                  value={categoryForm.sort_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label htmlFor="edit_cat_is_active">Active</Label>
                <Switch
                  id="edit_cat_is_active"
                  checked={categoryForm.is_active}
                  onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, is_active: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCategory} disabled={updateCategoryMutation.isPending}>
              {updateCategoryMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isCategoryDeleteOpen} onOpenChange={setIsCategoryDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedCategory?.name}</strong>?
              This will also delete all subcategories and templates. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={deleteCategoryMutation.isPending}>
              {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Subcategory Dialog */}
      <Dialog open={isSubcategoryCreateOpen} onOpenChange={setIsSubcategoryCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subcategory</DialogTitle>
            <DialogDescription>Add a new subcategory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sub_category">Category</Label>
              <Select
                value={subcategoryForm.category.toString()}
                onValueChange={(value) => setSubcategoryForm({ ...subcategoryForm, category: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: MarketplaceCategory) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sub_key">Key *</Label>
                <Input
                  id="sub_key"
                  value={subcategoryForm.key}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, key: e.target.value })}
                  placeholder="creams"
                />
              </div>
              <div>
                <Label htmlFor="sub_name">Name *</Label>
                <Input
                  id="sub_name"
                  value={subcategoryForm.name}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                  placeholder="Creams & Lotions"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sub_sort_order">Sort Order</Label>
                <Input
                  id="sub_sort_order"
                  type="number"
                  value={subcategoryForm.sort_order}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sub_is_default">Default</Label>
                  <Switch
                    id="sub_is_default"
                    checked={subcategoryForm.is_default}
                    onCheckedChange={(checked) => setSubcategoryForm({ ...subcategoryForm, is_default: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sub_is_active">Active</Label>
                  <Switch
                    id="sub_is_active"
                    checked={subcategoryForm.is_active}
                    onCheckedChange={(checked) => setSubcategoryForm({ ...subcategoryForm, is_active: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubcategoryCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSubcategory} disabled={createSubcategoryMutation.isPending}>
              {createSubcategoryMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isSubcategoryEditOpen} onOpenChange={setIsSubcategoryEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>Update subcategory details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_sub_key">Key *</Label>
                <Input
                  id="edit_sub_key"
                  value={subcategoryForm.key}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, key: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_sub_name">Name *</Label>
                <Input
                  id="edit_sub_name"
                  value={subcategoryForm.name}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_sub_sort_order">Sort Order</Label>
                <Input
                  id="edit_sub_sort_order"
                  type="number"
                  value={subcategoryForm.sort_order}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit_sub_is_default">Default</Label>
                  <Switch
                    id="edit_sub_is_default"
                    checked={subcategoryForm.is_default}
                    onCheckedChange={(checked) => setSubcategoryForm({ ...subcategoryForm, is_default: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit_sub_is_active">Active</Label>
                  <Switch
                    id="edit_sub_is_active"
                    checked={subcategoryForm.is_active}
                    onCheckedChange={(checked) => setSubcategoryForm({ ...subcategoryForm, is_active: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubcategoryEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSubcategory} disabled={updateSubcategoryMutation.isPending}>
              {updateSubcategoryMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subcategory Dialog */}
      <Dialog open={isSubcategoryDeleteOpen} onOpenChange={setIsSubcategoryDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subcategory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedSubcategory?.name}</strong>?
              This will also delete the template pack and all templates. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubcategoryDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSubcategory} disabled={deleteSubcategoryMutation.isPending}>
              {deleteSubcategoryMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplaceCategories;
