export type PRStatus = "pending" | "approved" | "disapproved" | "forwarded" | "returned" | "received"
export type PRDesignation = "procurement" | "admin" | "budget" | "director" | "bac" | "supply"

export interface PurchaseRequest {
  id: string
  pr_number: string
  department: string
  created_at: string
  updated_at: string
  status: PRStatus
  current_designation: PRDesignation
  document_url: string
}

export interface CreatePurchaseRequest {
  pr_number: string
  department: string
  document_url: string
  current_designation: PRDesignation
}

export interface TrackingEntry {
  id: string
  pr_id: string
  status: PRStatus
  designation: PRDesignation
  notes: string
  created_at: string
}

