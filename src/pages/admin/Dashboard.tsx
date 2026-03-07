import React from 'react';
import { useAdminUsers, useAdminSamples, useAdminPackages, useGenerationLogs } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Image, Package, FileText, TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: usersData, isLoading: usersLoading } = useAdminUsers('', 1, 1);
  const { data: samplesData, isLoading: samplesLoading } = useAdminSamples();
  const { data: packagesData, isLoading: packagesLoading } = useAdminPackages();
  const { data: logsData, isLoading: logsLoading } = useGenerationLogs('', undefined, 1, 10);

  // Handle different possible data structures
  const samples = Array.isArray(samplesData) ? samplesData : [];
  const packages = Array.isArray(packagesData) ? packagesData : [];

  const stats = [
    {
      name: 'Total Users',
      value: usersData?.count || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      loading: usersLoading
    },
    {
      name: 'Active Samples',
      value: samples.filter((s: any) => s.is_active).length || 0,
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      loading: samplesLoading
    },
    {
      name: 'Packages',
      value: packages.length || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      loading: packagesLoading
    },
    {
      name: 'Total Generations',
      value: logsData?.count || 0,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      loading: logsLoading
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  {stat.loading ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Generations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Generations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : logsData?.results?.length > 0 ? (
              <div className="space-y-3">
                {logsData.results.slice(0, 5).map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Job #{log.id}</p>
                      <p className="text-xs text-gray-500">
                        User: {log.user_phone || log.user}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.status === 'complete' ? 'bg-green-100 text-green-700' :
                      log.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No recent generations</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/users"
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <h3 className="font-medium text-sm">Manage Users</h3>
              <p className="text-xs text-gray-500 mt-1">View and manage user accounts</p>
            </a>
            <a
              href="/admin/samples"
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <h3 className="font-medium text-sm">Manage Samples</h3>
              <p className="text-xs text-gray-500 mt-1">Add or edit sample images</p>
            </a>
            <a
              href="/admin/packages"
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <h3 className="font-medium text-sm">Manage Packages</h3>
              <p className="text-xs text-gray-500 mt-1">Create and edit subscription packages</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
