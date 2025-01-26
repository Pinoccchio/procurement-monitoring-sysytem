export type PRStatus = "pending" | "approved" | "disapproved" | "returned" | "forwarded" | "received"
export type PRDesignation = "procurement" | "admin" | "budget" | "director" | "bac" | "supply"

export interface PurchaseRequest {
  id: string
  pr_number: string
  description: string
  status: PRStatus
  current_designation: PRDesignation
  created_at: string
  updated_at: string
}

export type TrackingEntry = {
  id: string
  pr_id: string
  pr_number: string
  status: PRStatus
  designation: PRDesignation
  notes: string
  created_at: string
  notification_type: string
}

export interface AdminUser {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

