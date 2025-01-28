export interface ContactSubmission {
    id: string
    firstName: string
    lastName: string
    email: string
    message: string
    createdAt: Date
    status: "new" | "read" | "responded"
  }
  
  