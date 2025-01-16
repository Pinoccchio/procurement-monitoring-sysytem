export type UserRole = 'end-user' | 'procurement' | 'budget' | 'director' | 'bac' | 'supply'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  account_type: UserRole
  created_at: string
  updated_at: string
}

