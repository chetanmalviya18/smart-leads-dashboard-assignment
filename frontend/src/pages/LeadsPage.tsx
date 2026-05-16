import { useState, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import { useLeads, useCreateLead, useExportLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal, Spinner } from '../components/ui';
import { LeadFilters, CreateLeadPayload } from '../types';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: 'latest',
};

export const LeadsPage = () => {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [rawSearch, setRawSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Debounce search input by 400ms
  const debouncedSearch = useDebounce(rawSearch, 400);
  const activeFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading } = useLeads(activeFilters);
  const createLead = useCreateLead();
  const exportLeads = useExportLeads();

  const leads = data?.data?.leads ?? [];
  const meta = data?.meta;

  const handleSearchChange = useCallback((value: string) => {
    setRawSearch(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCreate = async (data: CreateLeadPayload) => {
    await createLead.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleExport = () => {
    exportLeads.mutate(activeFilters);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and track your sales leads.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleExport}
            disabled={exportLeads.isPending || !leads.length}
            className="btn-secondary"
          >
            {exportLeads.isPending ? (
              <Spinner size={15} />
            ) : (
              <Download size={15} />
            )}
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <LeadFiltersBar
          filters={{ ...filters, search: rawSearch }}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          totalCount={meta?.totalCount ?? 0}
        />
      </div>

      {/* Table */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        meta={meta}
        onPageChange={handlePageChange}
      />

      {/* Create modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Lead"
        size="md"
      >
        <LeadForm
          onSubmit={handleCreate}
          isLoading={createLead.isPending}
          onCancel={() => setIsCreateOpen(false)}
          submitLabel="Create Lead"
        />
      </Modal>
    </div>
  );
};
