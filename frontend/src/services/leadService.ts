import { apiClient } from './api';
import {
  ApiResponse,
  Lead,
  LeadFilters,
  LeadStats,
  CreateLeadPayload,
  UpdateLeadPayload,
} from '../types';

export const leadService = {
  getLeads: async (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const res = await apiClient.get<ApiResponse<{ leads: Lead[] }>>(`/leads?${params.toString()}`);
    return res.data;
  },

  getLeadById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: CreateLeadPayload) => {
    const res = await apiClient.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: UpdateLeadPayload) => {
    const res = await apiClient.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/leads/${id}`);
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data;
  },

  exportCSV: async (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const res = await apiClient.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
