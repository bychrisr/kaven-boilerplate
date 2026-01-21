import { api } from '@/lib/api';
import { CreateGrantRequestInput, ReviewGrantRequestInput } from '@kaven/shared'; 

export interface GrantRequest {
  id: string;
  requesterId: string;
  spaceId?: string;
  capabilityId?: string;
  accessLevel: 'READ_ONLY' | 'READ_WRITE';
  scope: 'GLOBAL' | 'TENANT' | 'SPACE' | 'SELF' | 'ASSIGNED';
  justification: string;
  requestedDuration: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  
  capability?: {
    id: string;
    code: string;
    description?: string;
  };
  space?: {
    id: string;
    name: string;
  };
  requester?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  approver?: {
    name: string;
  };
  rejector?: {
    name: string;
  };
}

export const grantRequestService = {
  async create(data: CreateGrantRequestInput): Promise<GrantRequest> {
    const response = await api.post('/api/requests', data);
    return response.data;
  },

  async listMyRequests(): Promise<GrantRequest[]> {
    const response = await api.get('/api/requests/my');
    return response.data;
  },

  async listPending(spaceId?: string): Promise<GrantRequest[]> {
    const params = spaceId ? { spaceId } : {};
    const response = await api.get('/api/requests/pending', { params });
    return response.data;
  },

  async review(requestId: string, data: ReviewGrantRequestInput): Promise<GrantRequest> {
    const response = await api.put(`/api/requests/${requestId}/review`, data);
    return response.data;
  }
};
