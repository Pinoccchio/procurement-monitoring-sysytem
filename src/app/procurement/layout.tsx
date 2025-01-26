"use client"

import { useState } from "react"
import { ProcurementAppBar } from "@/components/layout/procurement/ProcurementAppBar"
import { ProcurementSidebar } from "@/components/layout/procurement/ProcurementSidebar"

export default function ProcurementLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcurementAppBar
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        className="fixed top-0 left-0 right-0 z-50"
      />
      <ProcurementSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 lg:pl-64">{children}</main>
    </div>
  )
}


