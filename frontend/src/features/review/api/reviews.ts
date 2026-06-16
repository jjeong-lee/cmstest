import { apiFallbacks, apiGet, apiPost } from "@/lib/api-client";
import { ReviewTask } from "@/lib/types";

export async function listReviewTasks(): Promise<ReviewTask[]> {
  const response = await apiGet<{ items: ReviewTask[] }>("/reviews", apiFallbacks.reviews);
  return response.items;
}

export async function approveReview(reviewId: string, decisionNote?: string) {
  return apiPost(`/reviews/${reviewId}/approve`, { decisionNote }, { id: reviewId, status: "approved" });
}

export async function rejectReview(reviewId: string, decisionNote: string) {
  return apiPost(`/reviews/${reviewId}/reject`, { decisionNote }, { id: reviewId, status: "rejected" });
}
