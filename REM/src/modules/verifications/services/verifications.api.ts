import type {
  Verification,
  VerificationCreateRequest,
  VerificationListResponse,
  VerificationStatus,
  VerificationStatusUpdateRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function ensureBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not defined. Set it in .env and restart the dev server.');
  }
  return API_BASE_URL;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = ensureBaseUrl();

  const res = await fetch(`${base}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });


  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) message = String(data.detail);
    } catch {
      
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export const verificationsApi = {
  list(params?: {
    search?: string;
    status?: VerificationStatus;
    limit?: number;
    offset?: number;
  }) {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    if (params?.limit !== undefined) qs.set('limit', String(params.limit));
    if (params?.offset !== undefined) qs.set('offset', String(params.offset));

    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return request<VerificationListResponse>(`/verifications${suffix}`);
  },

  create(body: VerificationCreateRequest) {
    return request<Verification>(`/verifications`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getById(id: string) {
    return request<Verification>(`/verifications/${id}`);
  },

  updateStatus(id: string, body: VerificationStatusUpdateRequest) {
    return request<Verification>(`/verifications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};
