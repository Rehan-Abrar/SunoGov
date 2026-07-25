export interface ClassificationResult {
  issue_id: string;
  city: string;
  language: "en" | "ur";
  confidence: number;
  department: DepartmentInfo;
  complaint_ur: string;
  complaint_en: string;
}

export interface DepartmentInfo {
  name: string;
  reason: string;
  channels: Channel[];
}

export interface Channel {
  type: "portal" | "app" | "helpline" | "email" | "office";
  value: string;
  label?: string;
}
