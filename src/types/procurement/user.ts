import type { PRDesignation } from "./purchase-request"

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  account_type: PRDesignation
}

