'use client'

import { useState } from 'react'
import { AppBar } from '@/components/layout/AppBar'
import { Sidebar } from '@/components/layout/SideBar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar 
        isSidebarOpen={isSidebarOpen} 
        onSidebarOpenChange={setIsSidebarOpen} 
      />
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Main content */}
      <main className={cn(
        "pt-16 transition-[margin]",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

