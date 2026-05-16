import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Lead, PaginationMeta } from "../../types";
import {
  StatusBadge,
  SourceBadge,
  Spinner,
  EmptyState,
  ConfirmDialog,
} from "../ui";
import { Modal } from "../ui";
import { LeadForm } from "./LeadForm";
import { useUpdateLead, useDeleteLead } from "../../hooks/useLeads";
import { useAuthStore } from "../../store/authStore";
import { CreateLeadPayload } from "../../types";

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const LeadTable = ({
  leads,
  isLoading,
  meta,
  onPageChange,
}: LeadTableProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canEdit = (lead: Lead) =>
    user?.role === "admin" ||
    lead.createdBy?.id === user?.id ||
    lead.createdBy?._id === user?.id;

  const handleUpdate = async (data: CreateLeadPayload) => {
    if (!editLead) return;
    await updateLead.mutateAsync({ id: editLead._id, data });
    setEditLead(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteLead.mutateAsync(deletingId);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  if (!leads.length) {
    return (
      <EmptyState
        title="No leads found"
        description="Try adjusting your filters or create a new lead to get started."
      />
    );
  }

  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-surface-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-surface-hover border-b border-gray-200 dark:border-surface-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Source
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Created
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-surface-border">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="bg-white dark:bg-surface-card hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors duration-100"
              >
                <td className="px-4 py-3.5">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {lead.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                      {lead.email}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                    {lead.email}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <SourceBadge source={lead.source} />
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(lead.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-border text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      title="View details"
                    >
                      <Eye size={15} />
                    </button>
                    {canEdit(lead) && (
                      <>
                        <button
                          onClick={() => setEditLead(lead)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit lead"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingId(lead._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete lead"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {meta.currentPage} of {meta.totalPages} &nbsp;·&nbsp;{" "}
            {meta.totalCount} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(meta.currentPage - 1)}
              disabled={!meta.hasPrevPage}
              className="btn-secondary !px-3 !py-2"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange(meta.currentPage + 1)}
              disabled={!meta.hasNextPage}
              className="btn-secondary !px-3 !py-2"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
        size="md"
      >
        {editLead && (
          <LeadForm
            defaultValues={editLead}
            onSubmit={handleUpdate}
            isLoading={updateLead.isPending}
            onCancel={() => setEditLead(null)}
            submitLabel="Update Lead"
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        isLoading={deleteLead.isPending}
      />
    </>
  );
};
