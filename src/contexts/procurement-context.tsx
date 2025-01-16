'use client'

import { createContext, useContext, useState } from 'react'

interface ProcurementContextType {
  showPurchaseRequests: boolean
  toggleView: () => void
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined)

export function ProcurementProvider({ children }: { children: React.ReactNode }) {
  const [showPurchaseRequests, setShowPurchaseRequests] = useState(false)

  const toggleView = () => setShowPurchaseRequests(prev => !prev)

  return (
    <ProcurementContext.Provider value={{ showPurchaseRequests, toggleView }}>
      {children}
    </ProcurementContext.Provider>
  )
}

export function useProcurement() {
  const context = useContext(ProcurementContext)
  if (context === undefined) {
    throw new Error('useProcurement must be used within a ProcurementProvider')
  }
  return context
}

