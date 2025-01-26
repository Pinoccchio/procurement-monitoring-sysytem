"use client"

import { useState } from "react"
import { BudgetAppBar } from "@/components/layout/budget/BudgetAppBar"
import { BudgetSidebar } from "@/components/layout/budget/BudgetSidebar"

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <BudgetAppBar
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        className="fixed top-0 left-0 right-0 z-50"
      />
      <BudgetSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 lg:pl-64">{children}</main>
    </div>
  )
}

