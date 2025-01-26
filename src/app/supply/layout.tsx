"use client"

import { useState } from "react"
import { SupplyAppBar } from "@/components/layout/supply/SupplyAppBar"
import { SupplySidebar } from "@/components/layout/supply/SupplySidebar"

export default function SupplyLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplyAppBar
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        className="fixed top-0 left-0 right-0 z-50"
      />
      <SupplySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 lg:pl-64">{children}</main>
    </div>
  )
}

