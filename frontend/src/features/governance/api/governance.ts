import { apiFallbacks, apiGet } from "@/lib/api-client";
import {
  ChangeRequest,
  Deliverable,
  DeploymentRelease,
  ProjectSchedule,
  RiskIssue,
  ScopeItem,
  SoftwareInventoryItem,
  StaffAssignment,
} from "@/lib/types";

export async function listSoftwareInventory(): Promise<SoftwareInventoryItem[]> {
  return apiGet("/admin/software-inventory", apiFallbacks.softwareInventory);
}

export async function listDeployments(): Promise<DeploymentRelease[]> {
  return apiGet("/admin/deployments", apiFallbacks.deployments);
}

export async function listSchedules(): Promise<ProjectSchedule[]> {
  return apiGet("/admin/project/schedules", apiFallbacks.schedules);
}

export async function listScopeItems(): Promise<ScopeItem[]> {
  return apiGet("/admin/project/scope-items", apiFallbacks.scopeItems);
}

export async function listStaffAssignments(): Promise<StaffAssignment[]> {
  return apiGet("/admin/project/staff-assignments", apiFallbacks.staffAssignments);
}

export async function listRisks(): Promise<RiskIssue[]> {
  return apiGet("/admin/project/risk-issues", apiFallbacks.risks);
}

export async function listDeliverables(): Promise<Deliverable[]> {
  return apiGet("/admin/project/deliverables", apiFallbacks.deliverables);
}

export async function listChangeRequests(): Promise<ChangeRequest[]> {
  return apiGet("/admin/project/change-requests", apiFallbacks.changeRequests);
}
