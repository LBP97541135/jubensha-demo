/**
 * Unified API client.
 */

import { isMockShowcaseMode, mockApiRequest } from "../mockShowcase/mockApi";

const API_BASE = "/api";

type QueryValue = string | number | boolean | null | undefined;

function buildQueryString(query?: Record<string, QueryValue>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  }
  return params.toString() ? `?${params.toString()}` : "";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (isMockShowcaseMode()) {
    return mockApiRequest<T>((options?.method || "GET") as "GET" | "POST" | "PATCH" | "DELETE", path, options?.body ? JSON.parse(String(options.body)) : undefined);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? (data as any).error?.message
        : `HTTP ${res.status}`;
    throw new ApiError(message || `HTTP ${res.status}`, res.status, (data as any)?.error?.code);
  }

  if (data && typeof data === "object" && "success" in data) {
    if (!(data as any).success) {
      throw new ApiError((data as any).error?.message || "请求失败", res.status, (data as any).error?.code);
    }
    return (data as any).data as T;
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, query?: Record<string, QueryValue>) =>
    request<T>(path + buildQueryString(query)),
  post: <T>(path: string, body?: unknown, query?: Record<string, QueryValue>) =>
    request<T>(path + buildQueryString(query), {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown, query?: Record<string, QueryValue>) =>
    request<T>(path + buildQueryString(query), {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string, body?: unknown, query?: Record<string, QueryValue>) =>
    request<T>(path + buildQueryString(query), {
      method: "DELETE",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
};
