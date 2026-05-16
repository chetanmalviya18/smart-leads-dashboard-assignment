import clsx from 'clsx';
import { LeadStatus, LeadSource } from '../../types';
import { Loader2, X, AlertTriangle } from 'lucide-react';

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const classes: Record<LeadStatus, string> = {
    New: 'badge-new',
    Contacted: 'badge-contacted',
    Qualified: 'badge-qualified',
    Lost: 'badge-lost',
  };
  return <span className={classes[status]}>{status}</span>;
};

// ─── SourceBadge ─────────────────────────────────────────────────────────────
export const SourceBadge = ({ source }: { source: LeadSource }) => {
  const classes: Record<LeadSource, string> = {
    Website: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Instagram: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    Referral: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return <span className={classes[source]}>{source}</span>;
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 20, className }: { size?: number; className?: string }) => (
  <Loader2 size={size} className={clsx('animate-spin text-brand-500', className)} />
);

// ─── EmptyState ──────────────────────────────────────────────────────────────
export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-surface-hover flex items-center justify-center mb-4">
      <span className="text-3xl">📭</span>
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">{description}</p>
    )}
    {action}
  </div>
);

// ─── Modal ───────────────────────────────────────────────────────────────────
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) => {
  if (!isOpen) return null;

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative w-full card p-6 shadow-2xl animate-slide-up',
          sizeClass
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-hover transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── ConfirmDialog ───────────────────────────────────────────────────────────
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
        <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 pt-2">{description}</p>
    </div>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-secondary">Cancel</button>
      <button onClick={onConfirm} disabled={isLoading} className="btn-danger">
        {isLoading ? <Spinner size={16} /> : null}
        Delete
      </button>
    </div>
  </Modal>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="card p-5 animate-slide-up">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', color)}>
        {icon}
      </div>
    </div>
    <p className="font-display text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);
