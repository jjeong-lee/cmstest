import {
  mockBackups,
  mockChangeRequests,
  mockDashboardSummary,
  mockDeployments,
  mockDocument,
  mockFolderContents,
  mockHealth,
  mockRootFolders,
  mockSchedules,
  mockScopeItems,
  mockSearchResults,
  mockSoftwareInventory,
  mockStaffAssignments,
  mockDeliverables,
  mockRisks,
} from "./mock-data";
import { ApiEnvelope } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
const DEMO_USER = process.env.NEXT_PUBLIC_DEMO_USER ?? "admin@example.com";

function withDefaultHeaders(init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-demo-user": DEMO_USER,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }
  const body = (await response.json()) as T | ApiEnvelope<T>;
  if (typeof body === "object" && body !== null && "success" in body && "data" in body) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, withDefaultHeaders());
    return await parseResponse<T>(response);
  } catch {
    return fallback;
  }
}

export async function apiPost<T>(path: string, body: unknown, fallback: T): Promise<T> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      withDefaultHeaders({
        method: "POST",
        body: JSON.stringify(body),
      }),
    );
    return await parseResponse<T>(response);
  } catch {
    return fallback;
  }
}

export async function apiPatch<T>(path: string, body: unknown, fallback: T): Promise<T> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      withDefaultHeaders({
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    );
    return await parseResponse<T>(response);
  } catch {
    return fallback;
  }
}

export async function apiDelete<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      withDefaultHeaders({
        method: "DELETE",
      }),
    );
    return await parseResponse<T>(response);
  } catch {
    return fallback;
  }
}

export const apiFallbacks = {
  dashboard: mockDashboardSummary,
  rootFolders: mockRootFolders,
  folderContents: mockFolderContents,
  document: mockDocument,
  search: { total: mockSearchResults.length, items: mockSearchResults },
  health: mockHealth,
  backups: mockBackups,
  softwareInventory: mockSoftwareInventory,
  deployments: mockDeployments,
  schedules: mockSchedules,
  scopeItems: mockScopeItems,
  staffAssignments: mockStaffAssignments,
  risks: mockRisks,
  deliverables: mockDeliverables,
  changeRequests: mockChangeRequests,
};
