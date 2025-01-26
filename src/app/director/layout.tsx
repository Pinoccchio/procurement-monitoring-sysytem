"use client"

import { useState } from "react"
import { DirectorAppBar } from "@/components/layout/director/DirectorAppBar"
import { DirectorSidebar } from "@/components/layout/director/DirectorSidebar"

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <DirectorAppBar
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        className="fixed top-0 left-0 right-0 z-50"
      />
      <DirectorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 lg:pl-64">{children}</main>
    </div>
  )
}

