export type ErrorCode =
  | 'AUTHENTICATION_REQUIRED' | 'ACCOUNT_SUSPENDED' | 'ID_APPROVAL_REQUIRED'
  | 'AUTHORIZATION_DENIED' | 'VALIDATION_FAILED' | 'CONFLICT'
  | 'INVALID_TRANSITION' | 'WORKER_INELIGIBLE' | 'ROUTE_UNAVAILABLE'
  | 'PROVIDER_QUOTA_EXCEEDED' | 'FEATURE_LOCKED' | 'CONFIGURATION_ERROR' | 'UNKNOWN_ERROR';

export interface ServiceError { code: ErrorCode; message: string }
export interface ServiceResult<T> { data: T | null; error: ServiceError | null }
export type AccountStatus = 'active' | 'suspended' | 'deactivated';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'resubmission_required';
export type BookingStatus = 'scheduled' | 'accepted' | 'en_route' | 'arrived' | 'in_progress' | 'pending_confirmation' | 'completed' | 'cancelled';

const knownCodes = new Set<ErrorCode>([
  'AUTHENTICATION_REQUIRED','ACCOUNT_SUSPENDED','ID_APPROVAL_REQUIRED','AUTHORIZATION_DENIED','VALIDATION_FAILED',
  'CONFLICT','INVALID_TRANSITION','WORKER_INELIGIBLE','ROUTE_UNAVAILABLE','PROVIDER_QUOTA_EXCEEDED','FEATURE_LOCKED','CONFIGURATION_ERROR',
]);

export function toServiceError(error: unknown): ServiceError {
  const value = error as { message?: string; code?: string } | null;
  const raw = value?.message || value?.code || 'UNKNOWN_ERROR';
  const code = knownCodes.has(raw as ErrorCode) ? raw as ErrorCode : 'UNKNOWN_ERROR';
  const friendly: Record<ErrorCode, string> = {
    AUTHENTICATION_REQUIRED: 'Please sign in to continue.', ACCOUNT_SUSPENDED: 'This account is suspended.',
    ID_APPROVAL_REQUIRED: 'Your ID must be approved before you can continue.', AUTHORIZATION_DENIED: 'You are not allowed to perform this action.',
    VALIDATION_FAILED: 'Please check the information and try again.', CONFLICT: 'This action conflicts with a recent update.',
    INVALID_TRANSITION: 'That status change is not allowed.', WORKER_INELIGIBLE: 'This worker is not currently eligible.',
    ROUTE_UNAVAILABLE: 'A road route is temporarily unavailable.', PROVIDER_QUOTA_EXCEEDED: 'The route provider limit has been reached.',
    FEATURE_LOCKED: 'This feature is not available in the MVP.', CONFIGURATION_ERROR: 'Supabase environment variables are missing.',
    UNKNOWN_ERROR: value?.message || 'Something went wrong.',
  };
  return { code, message: friendly[code] };
}

