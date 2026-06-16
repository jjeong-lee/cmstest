import { mockAssets, mockContentTypes, mockDashboardSummary, mockEntries, mockReviewTasks } from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
const DEMO_USER = process.env.NEXT_PUBLIC_DEMO_USER ?? "editor@example.com";

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

async function safeJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, withDefaultHeaders());
    return await safeJson<T>(response);
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
    return await safeJson<T>(response);
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
    return await safeJson<T>(response);
  } catch {
    return fallback;
  }
}

export const apiFallbacks = {
  contentTypes: { items: mockContentTypes },
  entries: { items: mockEntries },
  dashboard: mockDashboardSummary,
  reviews: { items: mockReviewTasks },
  media: { items: mockAssets },
};
