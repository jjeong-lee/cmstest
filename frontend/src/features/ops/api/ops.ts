import { apiFallbacks, apiGet, apiPost } from "@/lib/api-client";
import { BackupRun, HealthStatus } from "@/lib/types";

export async function getHealthStatus(): Promise<HealthStatus> {
  return apiGet("/ops/health", apiFallbacks.health);
}

export async function listBackups(): Promise<BackupRun[]> {
  return apiGet("/admin/backups", apiFallbacks.backups);
}

export async function startBackup(): Promise<BackupRun> {
  return apiPost("/admin/backups", {}, apiFallbacks.backups[0]);
}
