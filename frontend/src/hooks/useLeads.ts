import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { leadService } from '../services/leadService';
import { LeadFilters, CreateLeadPayload, UpdateLeadPayload } from '../types';
import { getErrorMessage } from '../services/api';

export const useLeads = (filters: Partial<LeadFilters>) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadService.getLeads(filters),
    staleTime: 30_000,
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn: leadService.getStats,
    staleTime: 60_000,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadPayload) => leadService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead created successfully!');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadPayload }) =>
      leadService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead updated successfully!');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead deleted successfully!');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useExportLeads = () => {
  return useMutation({
    mutationFn: (filters: Partial<LeadFilters>) => leadService.exportCSV(filters),
    onSuccess: () => toast.success('CSV exported successfully!'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
