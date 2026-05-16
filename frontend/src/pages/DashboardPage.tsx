import { Users, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { useLeadStats } from '../hooks/useLeads';
import { StatCard, Spinner } from '../components/ui';
import { useAuthStore } from '../store/authStore';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useLeadStats();

  const stats = data?.data;

  const cards = [
    {
      label: 'Total Leads',
      value: stats?.totalCount ?? 0,
      icon: <Users size={18} className="text-white" />,
      color: 'bg-brand-600',
    },
    {
      label: 'Qualified',
      value: stats?.byStatus?.Qualified ?? 0,
      icon: <UserCheck size={18} className="text-white" />,
      color: 'bg-green-600',
    },
    {
      label: 'Contacted',
      value: stats?.byStatus?.Contacted ?? 0,
      icon: <TrendingUp size={18} className="text-white" />,
      color: 'bg-yellow-600',
    },
    {
      label: 'Lost',
      value: stats?.byStatus?.Lost ?? 0,
      icon: <UserX size={18} className="text-white" />,
      color: 'bg-red-600',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's an overview of your lead pipeline.
        </p>
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Status breakdown */}
      {!isLoading && stats && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* By Status */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-base text-gray-900 dark:text-white mb-4">
              By Status
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => {
                const pct = stats.totalCount
                  ? Math.round((count / stats.totalCount) * 100)
                  : 0;
                const barColor: Record<string, string> = {
                  New: 'bg-blue-500',
                  Contacted: 'bg-yellow-500',
                  Qualified: 'bg-green-500',
                  Lost: 'bg-red-500',
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{status}</span>
                      <span className="font-mono text-gray-500 dark:text-gray-400">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-surface-border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor[status]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Source */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-base text-gray-900 dark:text-white mb-4">
              By Source
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.bySource).map(([source, count]) => {
                const pct = stats.totalCount
                  ? Math.round((count / stats.totalCount) * 100)
                  : 0;
                const barColor: Record<string, string> = {
                  Website: 'bg-purple-500',
                  Instagram: 'bg-pink-500',
                  Referral: 'bg-orange-500',
                };
                return (
                  <div key={source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{source}</span>
                      <span className="font-mono text-gray-500 dark:text-gray-400">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-surface-border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor[source]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
