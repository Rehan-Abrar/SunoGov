export interface ClassifyRequest {
  text: string;
  image_base64?: string | null;
  city_hint?: string | null;
}

export interface ClassifyResponse {
  issue_id: string;
  issue_display: string;
  city: string;
  language: string;
  confidence: number;
  department: DepartmentData;
  requirements: string[];
  priority: string;
  tracking: boolean;
  escalation: string | null;
  complaint: {
    urdu: string;
    english: string;
  };
}

export interface DepartmentData {
  name: string;
  reason: string;
  portal: string | null;
  helpline: string | null;
  emergency_helpline: string | null;
  app: string | null;
  email: string | null;
  office: string | null;
  hours: string | null;
  whatsapp: string | null;
  maps_link: string | null;
  official_website: string | null;
  verification_status: string | null;
}

export interface ApplicationRequest {
  issue_id: string;
  city: string;
  user_name: string;
  user_address: string;
  user_phone: string;
  user_description: string;
  language: "english" | "urdu";
  cnic?: string | null;
  landmark?: string | null;
  previous_complaint_id?: string | null;
  supporting_info?: string | null;
}

export interface ApplicationResponse {
  letter: string;
  metadata: Record<string, unknown>;
}
