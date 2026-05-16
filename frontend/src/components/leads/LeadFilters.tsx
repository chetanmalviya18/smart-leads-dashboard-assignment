import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { LeadStatus, LeadSource, LeadFilters, SortOrder } from '../../types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof LeadFilters, value: string) => void;
  totalCount: number;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const LeadFiltersBar = ({
  filters,
  onSearchChange,
  onFilterChange,
  totalCount,
}: LeadFiltersBarProps) => {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="input-base pl-9"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={14} className="text-gray-400 hidden sm:block" />

        {/* Status filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="input-base !w-auto text-xs py-2"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Source filter */}
        <select
          value={filters.source || ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
          className="input-base !w-auto text-xs py-2"
        >
          <option value="">All Sources</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value as SortOrder)}
          className="input-base !w-auto text-xs py-2"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Result count */}
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {totalCount} lead{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};
