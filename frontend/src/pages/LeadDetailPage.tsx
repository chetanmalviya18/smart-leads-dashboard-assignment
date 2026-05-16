import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import { leadService } from '../services/leadService';
import { useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { useAuthStore } from '../store/authStore';
import { StatusBadge, SourceBadge, Spinner, Modal, ConfirmDialog } from '../components/ui';
import { LeadForm } from '../components/leads/LeadForm';
import { CreateLeadPayload } from '../types';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const { data, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLeadById(id!),
    enabled: !!id,
  });

  const lead = data?.data?.lead;

  const canEdit =
    user?.role === 'admin' ||
    (lead && (lead.createdBy?.id === user?.id || (lead.createdBy as { _id?: string })?._id === user?.id));

  const handleUpdate = async (formData: CreateLeadPayload) => {
    if (!id) return;
    await updateLead.mutateAsync({ id, data: formData });
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteLead.mutateAsync(id);
    navigate('/leads');
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size={36} />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Lead not found.</p>
        <button onClick={() => navigate('/leads')} className="btn-secondary">
          <ArrowLeft size={16} /> Back to Leads
        </button>
      </div>
    );
  }

  const infoRows = [
    {
      icon: <Mail size={16} />,
      label: 'Email',
      value: (
        <a
          href={`mailto:${lead.email}`}
          className="text-brand-600 dark:text-brand-400 hover:underline font-mono text-sm"
        >
          {lead.email}
        </a>
      ),
    },
    {
      icon: <Calendar size={16} />,
      label: 'Created',
      value: formatDate(lead.createdAt),
    },
    {
      icon: <Calendar size={16} />,
      label: 'Last Updated',
      value: formatDate(lead.updatedAt),
    },
    {
      icon: <User size={16} />,
      label: 'Created By',
      value: typeof lead.createdBy === 'object' ? lead.createdBy.name : lead.createdBy,
    },
  ];

  return (
    <div className="max-w-2xl animate-slide-up">
      {/* Back */}
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-5 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </button>

      {/* Card */}
      <div className="card p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
              {lead.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={lead.status} />
              <SourceBadge source={lead.source} />
            </div>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="btn-secondary !px-3"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="btn-danger !px-3"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Info rows */}
        <div className="divide-y divide-gray-100 dark:divide-surface-border">
          {infoRows.map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-3">
              <span className="text-gray-400 flex-shrink-0">{icon}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 w-28 flex-shrink-0">{label}</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {lead.notes && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={15} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-surface-hover rounded-lg p-3">
              {lead.notes}
            </p>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Lead" size="md">
        <LeadForm
          defaultValues={lead}
          onSubmit={handleUpdate}
          isLoading={updateLead.isPending}
          onCancel={() => setIsEditOpen(false)}
          submitLabel="Update Lead"
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete "${lead.name}"? This cannot be undone.`}
        isLoading={deleteLead.isPending}
      />
    </div>
  );
};
