import React from 'react';
import { useAdminAnalytics } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users, CreditCard, Sparkles, TrendingUp, DollarSign,
  Activity, BarChart3, Globe, Layers, ShoppingBag
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formatUZS = (amount: number) => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k`;
  return amount.toLocaleString();
};

const Dashboard = () => {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Loading analytics data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const overview = data?.overview || {};
  const revenue = data?.revenue || {};
  const credits = data?.credits || {};

  const statCards = [
    {
      name: 'Total Users',
      value: overview.total_users || 0,
      sub: `+${overview.new_users_7d || 0} this week`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Total Revenue',
      value: `${formatUZS(revenue.total_uzs || 0)} UZS`,
      sub: `${formatUZS(revenue.last_7d_uzs || 0)} this week`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Generations',
      value: overview.total_generations || 0,
      sub: `${overview.generations_7d || 0} this week`,
      icon: Sparkles,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      name: 'Success Rate',
      value: `${overview.success_rate || 0}%`,
      sub: `${overview.failed_generations || 0} failed`,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Total Payments',
      value: revenue.total_payments || 0,
      sub: `${revenue.payments_30d || 0} last 30 days`,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Revenue (30d)',
      value: `${formatUZS(revenue.last_30d_uzs || 0)} UZS`,
      sub: `${revenue.payments_30d || 0} payments`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      name: 'Credits Purchased',
      value: credits.total_purchased || 0,
      sub: `${credits.total_used || 0} used`,
      icon: Layers,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      name: 'New Users (30d)',
      value: overview.new_users_30d || 0,
      sub: `+${overview.new_users_7d || 0} this week`,
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  const providerNames: Record<string, string> = {
    stripe: 'Stripe',
    click: 'CLICK',
    robokassa: 'Robokassa',
  };

  const languageNames: Record<string, string> = {
    uz: 'Uzbek',
    ru: 'Russian',
    tr: 'Turkish',
    en: 'English',
    ar: 'Arabic',
  };

  const modeNames: Record<string, string> = {
    marketplace: 'Marketplace',
    advertisement: 'Advertisement',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Reklamix AI platform overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Provider */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              Revenue by Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.revenue_by_provider || []).length > 0 ? (
              <div className="space-y-3">
                {data.revenue_by_provider.map((item: any) => (
                  <div key={item.provider} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.provider === 'stripe' ? 'bg-blue-500' :
                        item.provider === 'robokassa' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-sm font-medium">{providerNames[item.provider] || item.provider}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatUZS(parseFloat(item.total))} UZS</p>
                      <p className="text-xs text-gray-400">{item.count} payments</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No payments yet</p>
            )}
          </CardContent>
        </Card>

        {/* Generation Mode Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              Generation Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.mode_distribution || []).length > 0 ? (
              <div className="space-y-3">
                {data.mode_distribution.map((item: any) => {
                  const total = overview.total_generations || 1;
                  const pct = Math.round((item.count / total) * 100);
                  return (
                    <div key={item.generation_mode}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{modeNames[item.generation_mode] || item.generation_mode}</span>
                        <span className="text-gray-500">{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.generation_mode === 'marketplace' ? 'bg-teal-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              Languages Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.language_distribution || []).length > 0 ? (
              <div className="space-y-3">
                {data.language_distribution.map((item: any) => {
                  const total = overview.total_generations || 1;
                  const pct = Math.round((item.count / total) * 100);
                  return (
                    <div key={item.language} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{languageNames[item.language] || item.language}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">{item.count} ({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Packages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              Top Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.top_packages || []).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium text-gray-500">Package</th>
                      <th className="pb-2 font-medium text-gray-500 text-center">Credits</th>
                      <th className="pb-2 font-medium text-gray-500 text-center">Purchases</th>
                      <th className="pb-2 font-medium text-gray-500 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.top_packages.map((pkg: any, i: number) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2.5 font-medium">{pkg.package__name}</td>
                        <td className="py-2.5 text-center text-gray-500">{pkg.package__included_generations}</td>
                        <td className="py-2.5 text-center">
                          <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            {pkg.purchases}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-medium">{formatUZS(pkg.revenue)} UZS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No purchases yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.recent_payments || []).length > 0 ? (
              <div className="space-y-2">
                {data.recent_payments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{payment.user__phone_number}</p>
                      <p className="text-xs text-gray-400">
                        {payment.package__name} via {providerNames[payment.provider] || payment.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{formatUZS(payment.amount_uzs)} UZS</p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No payments yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            Top Users by Generations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(data?.top_users || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {data.top_users.map((user: any, i: number) => (
                <div key={user.user__id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.user__phone_number}</p>
                    <p className="text-xs text-gray-400">{user.generations} generations</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No data</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
