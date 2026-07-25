import type { ClassifyRequest, ClassifyResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function classifyIssue(req: ClassifyRequest): Promise<ClassifyResponse> {
  const response = await fetch(`${API_URL}/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.detail || `Request failed (${response.status})`;
    throw new Error(detail);
  }

  return response.json();
}
