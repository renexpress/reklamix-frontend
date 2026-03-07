import React, { useState } from 'react';
import {
  useAdminMarketplaceCategories,
  useAdminMarketplaceSubcategories,
  useAdminTemplatePacks,
  useCreateTemplatePack,
  useUpdateTemplatePack,
  useDeleteTemplatePack,
  useAdminMarketplaceTemplates,
  useCreateMarketplaceTemplate,
  useUpdateMarketplaceTemplate,
  useDeleteMarketplaceTemplate,
  useUploadImage,
} from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileImage, Plus, Edit, Trash2, Upload, Eye, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface MarketplaceCategory {
  id: number;
  key: string;
  name: string;
}

interface MarketplaceSubcategory {
  id: number;
  category: number;
  category_name?: string;
  key: string;
  name: string;
  has_template_pack?: boolean;
  template_pack_id?: number;
}

interface TemplatePack {
  id: number;
  subcategory: number;
  subcategory_name?: string;
  category_name?: string;
  name?: string;
  is_active: boolean;
  template_count?: number;
}

interface MarketplaceTemplate {
  id: number;
  template_pack: number;
  sort_order: number;
  description: string;
  has_text: boolean;
  text_description?: string;
  preview_image?: string;
  is_active: boolean;
}

const MarketplaceTemplates = () => {
  const { toast } = useToast();

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | undefined>();
  const [selectedTemplatePackId, setSelectedTemplatePackId] = useState<number | undefined>();
  const [templatesPage, setTemplatesPage] = useState(1);
  const templatesLimit = 10;

  // Queries
  const { data: categoriesData } = useAdminMarketplaceCategories();
  const { data: subcategoriesData, refetch: refetchSubcategories } = useAdminMarketplaceSubcategories(selectedCategoryId);
  const { data: templatePacksData, isLoading: isLoadingPacks, refetch: refetchPacks } = useAdminTemplatePacks(selectedSubcategoryId);
  const { data: templatesData, isLoading: isLoadingTemplates, refetch: refetchTemplates } = useAdminMarketplaceTemplates(selectedTemplatePackId, templatesPage, templatesLimit);

  // Mutations
  const createPackMutation = useCreateTemplatePack();
  const updatePackMutation = useUpdateTemplatePack();
  const deletePackMutation = useDeleteTemplatePack();
  const createTemplateMutation = useCreateMarketplaceTemplate();
  const updateTemplateMutation = useUpdateMarketplaceTemplate();
  const deleteTemplateMutation = useDeleteMarketplaceTemplate();
  const uploadImageMutation = useUploadImage();

  // Dialog states
  const [isPackCreateOpen, setIsPackCreateOpen] = useState(false);
  const [isPackEditOpen, setIsPackEditOpen] = useState(false);
  const [isPackDeleteOpen, setIsPackDeleteOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<TemplatePack | null>(null);

  const [isTemplateCreateOpen, setIsTemplateCreateOpen] = useState(false);
  const [isTemplateEditOpen, setIsTemplateEditOpen] = useState(false);
  const [isTemplateDeleteOpen, setIsTemplateDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null);

  // Form states
  const [packForm, setPackForm] = useState({
    subcategory: 0,
    name: '',
    is_active: true,
  });

  const [templateForm, setTemplateForm] = useState({
    template_pack: 0,
    sort_order: 0,
    description: '',
    has_text: false,
    text_description: '',
    preview_image: '',
    is_active: true,
  });

  const [previewFile, setPreviewFile] = useState<File | null>(null);

  // Data arrays
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

  const templatePacks = Array.isArray(templatePacksData?.results)
    ? templatePacksData.results
    : Array.isArray(templatePacksData)
    ? templatePacksData
    : [];

  const templates = Array.isArray(templatesData?.results)
    ? templatesData.results
    : Array.isArray(templatesData)
    ? templatesData
    : [];

  // Template Pack handlers
  const resetPackForm = () => {
    setPackForm({
      subcategory: selectedSubcategoryId || 0,
      name: '',
      is_active: true,
    });
  };

  const handleCreatePack = async () => {
    if (!packForm.subcategory) {
      toast({ title: 'Validation Error', description: 'Subcategory is required', variant: 'destructive' });
      return;
    }

    try {
      await createPackMutation.mutateAsync(packForm);
      toast({ title: 'Success', description: 'Template pack created successfully' });
      setIsPackCreateOpen(false);
      resetPackForm();
      refetchPacks();
      refetchSubcategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create template pack',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePack = async () => {
    if (!selectedPack) return;

    try {
      await updatePackMutation.mutateAsync({ id: selectedPack.id, data: packForm });
      toast({ title: 'Success', description: 'Template pack updated successfully' });
      setIsPackEditOpen(false);
      setSelectedPack(null);
      resetPackForm();
      refetchPacks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update template pack',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePack = async () => {
    if (!selectedPack) return;

    try {
      await deletePackMutation.mutateAsync(selectedPack.id);
      toast({ title: 'Success', description: 'Template pack deleted successfully' });
      setIsPackDeleteOpen(false);
      setSelectedPack(null);
      setSelectedTemplatePackId(undefined);
      refetchPacks();
      refetchSubcategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete template pack',
        variant: 'destructive',
      });
    }
  };

  const openPackEdit = (pack: TemplatePack) => {
    setSelectedPack(pack);
    setPackForm({
      subcategory: pack.subcategory,
      name: pack.name || '',
      is_active: pack.is_active,
    });
    setIsPackEditOpen(true);
  };

  // Template handlers
  const resetTemplateForm = () => {
    setTemplateForm({
      template_pack: selectedTemplatePackId || 0,
      sort_order: templates.length,
      description: '',
      has_text: false,
      text_description: '',
      preview_image: '',
      is_active: true,
    });
    setPreviewFile(null);
  };

  const handleUploadPreview = async (): Promise<string | null> => {
    if (!previewFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', previewFile);
      formData.append('folder', 'template_previews');

      const response = await uploadImageMutation.mutateAsync(formData);
      return response.data.url;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to upload preview image',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateForm.template_pack || !templateForm.description) {
      toast({ title: 'Validation Error', description: 'Template pack and description are required', variant: 'destructive' });
      return;
    }

    if (templateForm.has_text && !templateForm.text_description) {
      toast({ title: 'Validation Error', description: 'Text description is required when has_text is enabled', variant: 'destructive' });
      return;
    }

    try {
      let previewUrl = templateForm.preview_image;
      if (previewFile) {
        const uploadedUrl = await handleUploadPreview();
        if (uploadedUrl) previewUrl = uploadedUrl;
      }

      await createTemplateMutation.mutateAsync({
        ...templateForm,
        preview_image: previewUrl || undefined,
      });
      toast({ title: 'Success', description: 'Template created successfully' });
      setIsTemplateCreateOpen(false);
      resetTemplateForm();
      refetchTemplates();
      refetchPacks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create template',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;

    if (templateForm.has_text && !templateForm.text_description) {
      toast({ title: 'Validation Error', description: 'Text description is required when has_text is enabled', variant: 'destructive' });
      return;
    }

    try {
      let previewUrl = templateForm.preview_image;
      if (previewFile) {
        const uploadedUrl = await handleUploadPreview();
        if (uploadedUrl) previewUrl = uploadedUrl;
      }

      await updateTemplateMutation.mutateAsync({
        id: selectedTemplate.id,
        data: {
          ...templateForm,
          preview_image: previewUrl || undefined,
        },
      });
      toast({ title: 'Success', description: 'Template updated successfully' });
      setIsTemplateEditOpen(false);
      setSelectedTemplate(null);
      resetTemplateForm();
      refetchTemplates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update template',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      await deleteTemplateMutation.mutateAsync(selectedTemplate.id);
      toast({ title: 'Success', description: 'Template deleted successfully' });
      setIsTemplateDeleteOpen(false);
      setSelectedTemplate(null);
      refetchTemplates();
      refetchPacks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  const openTemplateCreate = () => {
    resetTemplateForm();
    setIsTemplateCreateOpen(true);
  };

  const openTemplateEdit = (template: MarketplaceTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm({
      template_pack: template.template_pack,
      sort_order: template.sort_order,
      description: template.description,
      has_text: template.has_text,
      text_description: template.text_description || '',
      preview_image: template.preview_image || '',
      is_active: template.is_active,
    });
    setPreviewFile(null);
    setIsTemplateEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Templates</h1>
          <p className="text-gray-500 mt-1">Manage template packs and individual templates</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={selectedCategoryId?.toString() || 'all'}
                onValueChange={(value) => {
                  setSelectedCategoryId(value === 'all' ? undefined : parseInt(value));
                  setSelectedSubcategoryId(undefined);
                  setSelectedTemplatePackId(undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat: MarketplaceCategory) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select
                value={selectedSubcategoryId?.toString() || 'all'}
                onValueChange={(value) => {
                  setSelectedSubcategoryId(value === 'all' ? undefined : parseInt(value));
                  setSelectedTemplatePackId(undefined);
                }}
                disabled={!selectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subcategories</SelectItem>
                  {subcategories.map((sub: MarketplaceSubcategory) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Template Pack</Label>
              <Select
                value={selectedTemplatePackId?.toString() || 'all'}
                onValueChange={(value) => {
                  setSelectedTemplatePackId(value === 'all' ? undefined : parseInt(value));
                  setTemplatesPage(1);
                }}
                disabled={!selectedSubcategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All packs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All packs</SelectItem>
                  {templatePacks.map((pack: TemplatePack) => (
                    <SelectItem key={pack.id} value={pack.id.toString()}>
                      {pack.name || `Pack #${pack.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Packs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Template Packs
          </h2>
          <Button
            onClick={() => {
              resetPackForm();
              setIsPackCreateOpen(true);
            }}
            disabled={!selectedSubcategoryId}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pack
          </Button>
        </div>

        {isLoadingPacks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : templatePacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templatePacks.map((pack: TemplatePack) => (
              <Card
                key={pack.id}
                className={`cursor-pointer transition-all ${selectedTemplatePackId === pack.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  setSelectedTemplatePackId(pack.id);
                  setTemplatesPage(1);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pack.name || `Pack #${pack.id}`}</p>
                      <p className="text-sm text-gray-500">
                        {pack.category_name} / {pack.subcategory_name}
                      </p>
                      <p className="text-sm text-gray-500">{pack.template_count || 0} templates</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={pack.is_active ? 'default' : 'secondary'}>
                        {pack.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => openPackEdit(pack)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedPack(pack); setIsPackDeleteOpen(true); }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              {selectedSubcategoryId
                ? 'No template packs found. Create one to get started.'
                : 'Select a subcategory to view template packs.'}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Templates
          </h2>
          <Button
            onClick={openTemplateCreate}
            disabled={!selectedTemplatePackId}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>

        {isLoadingTemplates ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : templates.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template: MarketplaceTemplate) => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {template.preview_image ? (
                        <div
                          className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                          onClick={() => { setSelectedTemplate(template); setIsPreviewOpen(true); }}
                        >
                          <img
                            src={template.preview_image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <FileImage className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Template #{template.sort_order + 1}</p>
                            <div className="flex gap-2 mt-1">
                              {template.has_text && (
                                <Badge variant="outline" className="text-xs">Has Text</Badge>
                              )}
                              <Badge variant={template.is_active ? 'default' : 'secondary'} className="text-xs">
                                {template.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {template.preview_image && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setSelectedTemplate(template); setIsPreviewOpen(true); }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => openTemplateEdit(template)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setSelectedTemplate(template); setIsTemplateDeleteOpen(true); }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{template.description}</p>
                        {template.has_text && template.text_description && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            Text: {template.text_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {templatesData?.total > templatesLimit && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Page {templatesData.page} of {templatesData.total_pages} ({templatesData.total} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTemplatesPage(p => Math.max(1, p - 1))}
                    disabled={templatesData.page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTemplatesPage(p => p + 1)}
                    disabled={templatesData.page >= templatesData.total_pages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              {selectedTemplatePackId
                ? 'No templates found. Add one to get started.'
                : 'Select a template pack to view templates.'}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Pack Dialog */}
      <Dialog open={isPackCreateOpen} onOpenChange={setIsPackCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template Pack</DialogTitle>
            <DialogDescription>Add a new template pack for a subcategory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subcategory *</Label>
              <Select
                value={packForm.subcategory.toString()}
                onValueChange={(value) => setPackForm({ ...packForm, subcategory: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories
                    .filter((sub: MarketplaceSubcategory) => !sub.has_template_pack)
                    .map((sub: MarketplaceSubcategory) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Name (optional)</Label>
              <Input
                value={packForm.name}
                onChange={(e) => setPackForm({ ...packForm, name: e.target.value })}
                placeholder="Pack name"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={packForm.is_active}
                onCheckedChange={(checked) => setPackForm({ ...packForm, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePack} disabled={createPackMutation.isPending}>
              {createPackMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Pack Dialog */}
      <Dialog open={isPackEditOpen} onOpenChange={setIsPackEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template Pack</DialogTitle>
            <DialogDescription>Update template pack details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name (optional)</Label>
              <Input
                value={packForm.name}
                onChange={(e) => setPackForm({ ...packForm, name: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={packForm.is_active}
                onCheckedChange={(checked) => setPackForm({ ...packForm, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePack} disabled={updatePackMutation.isPending}>
              {updatePackMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Pack Dialog */}
      <Dialog open={isPackDeleteOpen} onOpenChange={setIsPackDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template Pack</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template pack?
              This will also delete all templates in this pack. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePack} disabled={deletePackMutation.isPending}>
              {deletePackMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={isTemplateCreateOpen} onOpenChange={setIsTemplateCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
            <DialogDescription>Add a new template to the pack</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={templateForm.sort_order}
                  onChange={(e) => setTemplateForm({ ...templateForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label>Active</Label>
                <Switch
                  checked={templateForm.is_active}
                  onCheckedChange={(checked) => setTemplateForm({ ...templateForm, is_active: checked })}
                />
              </div>
            </div>
            <div>
              <Label>Scene Description *</Label>
              <Textarea
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                placeholder="Describe the scene composition for AI image generation (80-150 words)..."
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                {templateForm.description.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label>Has Text Overlay</Label>
              <Switch
                checked={templateForm.has_text}
                onCheckedChange={(checked) => setTemplateForm({ ...templateForm, has_text: checked })}
              />
            </div>
            {templateForm.has_text && (
              <div>
                <Label>Text Description *</Label>
                <Textarea
                  value={templateForm.text_description}
                  onChange={(e) => setTemplateForm({ ...templateForm, text_description: e.target.value })}
                  placeholder="Describe what text should appear on this template..."
                  rows={2}
                />
              </div>
            )}
            <div>
              <Label>Preview Image</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={templateForm.preview_image}
                  onChange={(e) => setTemplateForm({ ...templateForm, preview_image: e.target.value })}
                  placeholder="Image URL or upload below"
                />
              </div>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                />
                {previewFile && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {previewFile.name}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={createTemplateMutation.isPending || uploadImageMutation.isPending}
            >
              {createTemplateMutation.isPending || uploadImageMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isTemplateEditOpen} onOpenChange={setIsTemplateEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update template details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={templateForm.sort_order}
                  onChange={(e) => setTemplateForm({ ...templateForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label>Active</Label>
                <Switch
                  checked={templateForm.is_active}
                  onCheckedChange={(checked) => setTemplateForm({ ...templateForm, is_active: checked })}
                />
              </div>
            </div>
            <div>
              <Label>Scene Description *</Label>
              <Textarea
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                {templateForm.description.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label>Has Text Overlay</Label>
              <Switch
                checked={templateForm.has_text}
                onCheckedChange={(checked) => setTemplateForm({ ...templateForm, has_text: checked })}
              />
            </div>
            {templateForm.has_text && (
              <div>
                <Label>Text Description *</Label>
                <Textarea
                  value={templateForm.text_description}
                  onChange={(e) => setTemplateForm({ ...templateForm, text_description: e.target.value })}
                  rows={2}
                />
              </div>
            )}
            <div>
              <Label>Preview Image</Label>
              {templateForm.preview_image && (
                <div className="mt-2 mb-2">
                  <img
                    src={templateForm.preview_image}
                    alt="Current preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <Input
                value={templateForm.preview_image}
                onChange={(e) => setTemplateForm({ ...templateForm, preview_image: e.target.value })}
                placeholder="Image URL"
              />
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                />
                {previewFile && (
                  <p className="text-xs text-gray-500 mt-1">New file: {previewFile.name}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateEditOpen(false)}>Cancel</Button>
            <Button
              onClick={handleUpdateTemplate}
              disabled={updateTemplateMutation.isPending || uploadImageMutation.isPending}
            >
              {updateTemplateMutation.isPending || uploadImageMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={isTemplateDeleteOpen} onOpenChange={setIsTemplateDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate} disabled={deleteTemplateMutation.isPending}>
              {deleteTemplateMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Image Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          {selectedTemplate?.preview_image && (
            <div className="flex justify-center">
              <img
                src={selectedTemplate.preview_image}
                alt="Template preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplaceTemplates;
