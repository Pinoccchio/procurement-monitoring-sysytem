'use client'

import { useState } from 'react'
import { ProcurementAppBar } from '@/components/layout/procurement/ProcurementAppBar'
import { ProcurementSidebar } from '@/components/layout/procurement/ProcurementSidebar'
import { ProcurementProvider } from '@/contexts/procurement-context'
import { cn } from '@/lib/utils'

export default function ProcurementDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ProcurementProvider>
      <div className="min-h-screen bg-[#f8faf8]">
        <ProcurementAppBar 
          isSidebarOpen={isSidebarOpen} 
          onSidebarOpenChange={setIsSidebarOpen} 
        />
        <ProcurementSidebar isOpen={isSidebarOpen} />
        
        <main className={cn(
          "pt-16 transition-[margin] duration-300 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </ProcurementProvider>
  )
}

