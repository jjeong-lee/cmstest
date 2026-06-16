import { apiFallbacks, apiGet } from "@/lib/api-client";
import { DashboardSummary } from "@/lib/types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiGet("/admin/dashboard", apiFallbacks.dashboard);
}
