export type PRStatus = 'pending' | 'approved' | 'disapproved' | 'forwarded' | 'returned'
export type PRDesignation = 'procurement' | 'administrative' | 'budget' | 'director' | 'bac' | 'supply' | 'admin'

export interface PurchaseRequest {
  id: string
  pr_number: string
  department: string
  status: PRStatus
  current_designation: PRDesignation
  created_at: string
  updated_at: string
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

