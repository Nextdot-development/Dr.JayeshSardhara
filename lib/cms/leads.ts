
export const LEAD_STATUSES = ["new", "contacted", "follow_up", "converted", "closed"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow-up",
  converted: "Converted",
  closed: "Closed",
};

export type LeadRow = {
  id: string;
  submission_id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  preferred_date: string | null;
  message: string | null;
  source: string;
  source_path: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}
