export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: User | null;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search: string;
  sort: SortOrder;
}

export interface LeadStats {
  totalCount: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {}
