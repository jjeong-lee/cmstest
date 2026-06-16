export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: {
    code: string;
    type: "VALIDATION" | "AUTHORIZATION" | "NOT_FOUND" | "CONFLICT" | "SYSTEM";
    details?: Array<{ field?: string; reason: string }>;
  };
}

export function ok<T>(message: string, data: T): ApiEnvelope<T> {
  return {
    success: true,
    message,
    data,
  };
}
