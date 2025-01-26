"use client"

import { useState } from "react"
import { EndUserAppBar } from "@/components/layout/end-user/EndUserAppBar"
import { EndUserSidebar } from "@/components/layout/end-user/EndUserSidebar"

export default function EndUserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <EndUserAppBar
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        className="fixed top-0 left-0 right-0 z-50"
      />
      <EndUserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 lg:pl-64">{children}</main>
    </div>
  )
}

