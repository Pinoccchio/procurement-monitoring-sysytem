'use client'

import { useState } from 'react'
import { AdminAppBar } from '@/components/layout/admin/AdminAppBar'
import { AdminSidebar } from '@/components/layout/admin/AdminSidebar'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <AdminAppBar 
        isSidebarOpen={isSidebarOpen} 
        onSidebarOpenChange={setIsSidebarOpen} 
      />
      <AdminSidebar isOpen={isSidebarOpen} />
      
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
  )
}

