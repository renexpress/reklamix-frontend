import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useAdminUserProfile,
  useAdminUserJobs,
  useAdminUserTransactions,
  useAdjustCredits,
  useUpdateUser
} from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  User,
  CreditCard,
  Image,
  Clock,
  Coins,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userIdNum = parseInt(userId || '0');

  // State for pagination and filters
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsStatus, setJobsStatus] = useState<string>('');
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsType, setTransactionsType] = useState<string>('');

  // Dialogs
  const [isAdjustCreditsOpen, setIsAdjustCreditsOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditNotes, setCreditNotes] = useState('');
  const [editFormData, setEditFormData] = useState({
    is_staff: false,
    is_active: true,
  });

  // Image preview dialog
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Queries
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useAdminUserProfile(userIdNum);
  const { data: jobsData, isLoading: jobsLoading } = useAdminUserJobs(userIdNum, jobsPage, 10, jobsStatus || undefined);
  const { data: transactionsData, isLoading: transactionsLoading } = useAdminUserTransactions(userIdNum, transactionsPage, 10, transactionsType || undefined);

  // Mutations
  const adjustCreditsMutation = useAdjustCredits();
  const updateUserMutation = useUpdateUser();

  const handleAdjustCredits = async () => {
    if (!creditAmount) return;

    try {
      await adjustCreditsMutation.mutateAsync({
        userId: userIdNum,
        amount: parseInt(creditAmount),
        notes: creditNotes
      });

      toast({
        title: 'Success',
        description: 'Credits adjusted successfully',
      });

      setIsAdjustCreditsOpen(false);
      setCreditAmount('');
      setCreditNotes('');
      refetchProfile();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to adjust credits',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUserMutation.mutateAsync({
        userId: userIdNum,
        data: editFormData,
      });

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      setIsEditUserOpen(false);
      refetchProfile();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = () => {
    if (profile) {
      setEditFormData({
        is_staff: profile.is_staff,
        is_active: profile.is_active,
      });
      setIsEditUserOpen(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      complete: { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      failed: { variant: 'destructive', icon: <XCircle className="w-3 h-3" /> },
      generating: { variant: 'secondary', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
      analyzing: { variant: 'secondary', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
      uploaded: { variant: 'outline', icon: <Clock className="w-3 h-3" /> },
      analysis_complete: { variant: 'outline', icon: <CheckCircle className="w-3 h-3" /> },
      theme_selected: { variant: 'outline', icon: <CheckCircle className="w-3 h-3" /> },
    };
    const config = statusConfig[status] || { variant: 'outline' as const, icon: <AlertCircle className="w-3 h-3" /> };
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const getTransactionBadge = (type: string) => {
    const typeConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      purchase: { variant: 'default', label: 'Purchase' },
      usage: { variant: 'secondary', label: 'Usage' },
      refund: { variant: 'outline', label: 'Refund' },
      admin_adjustment: { variant: 'destructive', label: 'Admin Adjustment' },
    };
    const config = typeConfig[type] || { variant: 'outline' as const, label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.phone_number}</h1>
            <p className="text-gray-500">User ID: {profile.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEditDialog}>
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </Button>
          <Button onClick={() => setIsAdjustCreditsOpen(true)}>
            <Coins className="w-4 h-4 mr-2" />
            Adjust Credits
          </Button>
        </div>
      </div>

      {/* Profile Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium">{profile.phone_number}</span>
            </div>
            {profile.email && (
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{profile.email}</span>
              </div>
            )}
            {profile.full_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="font-medium">{profile.full_name}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <Badge variant={profile.is_active ? 'default' : 'destructive'}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Role</span>
              <Badge variant={profile.is_staff ? 'secondary' : 'outline'}>
                {profile.is_superuser ? 'Superuser' : profile.is_staff ? 'Admin' : 'User'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined</span>
              <span className="text-sm">{formatDate(profile.date_joined)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Login</span>
              <span className="text-sm">{formatDate(profile.last_login)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Credits Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-primary">{profile.credits_remaining}</p>
              <p className="text-gray-500">Available Credits</p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Purchased</span>
              <span className="font-medium">{profile.credits_total_purchased}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Used</span>
              <span className="font-medium">{profile.credits_used}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transactions</span>
              <span className="font-medium">{profile.total_transactions}</span>
            </div>
            {profile.current_subscription_tier && (
              <div className="flex justify-between">
                <span className="text-gray-500">Subscription</span>
                <Badge variant="outline">{profile.current_subscription_tier}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Generation Jobs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center py-4">
              <p className="text-4xl font-bold">{profile.total_jobs}</p>
              <p className="text-gray-500">Total Jobs</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Completed</span>
              <Badge variant="default" className="bg-green-600">{profile.completed_jobs}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Failed</span>
              <Badge variant="destructive">{profile.failed_jobs}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">In Progress</span>
              <Badge variant="secondary">{profile.total_jobs - profile.completed_jobs - profile.failed_jobs}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Jobs and Transactions */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList>
          <TabsTrigger value="jobs">Generation Jobs</TabsTrigger>
          <TabsTrigger value="transactions">Credit Transactions</TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generation Jobs</CardTitle>
                <Select value={jobsStatus || 'all'} onValueChange={(value) => { setJobsStatus(value === 'all' ? '' : value); setJobsPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="uploaded">Uploaded</SelectItem>
                    <SelectItem value="analyzing">Analyzing</SelectItem>
                    <SelectItem value="analysis_complete">Analysis Complete</SelectItem>
                    <SelectItem value="theme_selected">Theme Selected</SelectItem>
                    <SelectItem value="generating">Generating</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : jobsData?.results?.length > 0 ? (
                <div className="space-y-4">
                  {jobsData.results.map((job: any) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Job #{job.id}</span>
                            {getStatusBadge(job.status)}
                            {job.generation_mode && (
                              <Badge variant="outline">{job.generation_mode}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Created: {formatDate(job.created_at)}
                            {job.completed_at && ` | Completed: ${formatDate(job.completed_at)}`}
                          </p>
                        </div>
                        {job.credits_charged > 0 && (
                          <Badge variant="secondary">{job.credits_charged} credit{job.credits_charged > 1 ? 's' : ''}</Badge>
                        )}
                      </div>

                      {/* Uploaded Images */}
                      {job.uploaded_images?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500 mb-2">Uploaded Images:</p>
                          <div className="flex gap-2 flex-wrap">
                            {job.uploaded_images.map((url: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-16 h-16 border rounded overflow-hidden cursor-pointer hover:opacity-80"
                                onClick={() => setPreviewImage(url)}
                              >
                                <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Result Images */}
                      {job.result_images_list?.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Generated Results:</p>
                          <div className="flex gap-2 flex-wrap">
                            {job.result_images_list.map((url: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-16 h-16 border rounded overflow-hidden cursor-pointer hover:opacity-80"
                                onClick={() => setPreviewImage(url)}
                              >
                                <img src={url} alt={`Result ${idx + 1}`} className="w-full h-full object-cover" />
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-bl"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Error message if failed */}
                      {job.status === 'failed' && (job.analysis_error || job.generation_error) && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          {job.analysis_error || job.generation_error}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination */}
                  {jobsData.total > 10 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        Page {jobsData.page} of {jobsData.total_pages} ({jobsData.total} total)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setJobsPage(p => Math.max(1, p - 1))}
                          disabled={jobsData.page <= 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setJobsPage(p => p + 1)}
                          disabled={jobsData.page >= jobsData.total_pages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No generation jobs found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Credit Transactions</CardTitle>
                <Select value={transactionsType || 'all'} onValueChange={(value) => { setTransactionsType(value === 'all' ? '' : value); setTransactionsPage(1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="admin_adjustment">Admin Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : transactionsData?.results?.length > 0 ? (
                <div className="space-y-3">
                  {transactionsData.results.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {getTransactionBadge(transaction.transaction_type)}
                            {transaction.package_name && (
                              <span className="text-sm text-gray-500">({transaction.package_name})</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                            {transaction.created_by_phone && ` by ${transaction.created_by_phone}`}
                          </p>
                          {transaction.notes && (
                            <p className="text-sm text-gray-600 mt-1">{transaction.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {transaction.generation_job_id && (
                          <p className="text-sm text-gray-500">Job #{transaction.generation_job_id}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {transactionsData.total > 10 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        Page {transactionsData.page} of {transactionsData.total_pages} ({transactionsData.total} total)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTransactionsPage(p => Math.max(1, p - 1))}
                          disabled={transactionsData.page <= 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTransactionsPage(p => p + 1)}
                          disabled={transactionsData.page >= transactionsData.total_pages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No credit transactions found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adjust Credits Dialog */}
      <Dialog open={isAdjustCreditsOpen} onOpenChange={setIsAdjustCreditsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Credits</DialogTitle>
            <DialogDescription>
              Adjust credits for {profile.phone_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Credits</Label>
              <p className="text-2xl font-bold">{profile.credits_remaining}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Add/Subtract</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (positive or negative)"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Use positive numbers to add, negative to subtract
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Required)</Label>
              <Textarea
                id="notes"
                placeholder="Reason for adjustment..."
                value={creditNotes}
                onChange={(e) => setCreditNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustCreditsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdjustCredits}
              disabled={!creditAmount || !creditNotes || adjustCreditsMutation.isPending}
            >
              {adjustCreditsMutation.isPending ? 'Adjusting...' : 'Adjust Credits'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user status and permissions for {profile.phone_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_staff">Admin Status</Label>
                <p className="text-xs text-gray-500 mt-1">Grant admin panel access</p>
              </div>
              <Switch
                id="is_staff"
                checked={editFormData.is_staff}
                onCheckedChange={(checked) => setEditFormData({ ...editFormData, is_staff: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Account Active</Label>
                <p className="text-xs text-gray-500 mt-1">Enable or disable user account</p>
              </div>
              <Switch
                id="is_active"
                checked={editFormData.is_active}
                onCheckedChange={(checked) => setEditFormData({ ...editFormData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
          <DialogFooter>
            <a
              href={previewImage || ''}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </a>
            <Button onClick={() => setPreviewImage(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetail;
