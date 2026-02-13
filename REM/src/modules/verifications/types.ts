export type VerificationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'requires_information';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Verification {
  id: string; // UUID
  full_name: string;
  email: string;
  phone: string;
  country: string;
  document_type: string;
  document_number: string;
  document_url: string;
  status: VerificationStatus;
  created_at: string;
  risk_score: number;
  risk_level: RiskLevel;
}

export interface VerificationCreateRequest {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  document_type: string;
  document_number: string;
  document_url: string;
}

export interface VerificationStatusUpdateRequest {
  status: VerificationStatus;
}

export interface VerificationListResponse {
  items: Verification[];
  limit: number;
  offset: number;
  total: number | null;
}
