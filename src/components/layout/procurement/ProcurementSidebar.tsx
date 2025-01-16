'use client'

import { cn } from '@/lib/utils'
import { LayoutGrid, FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useProcurement } from '@/contexts/procurement-context'

interface ProcurementSidebarProps {
  isOpen: boolean
  className?: string
}

export function ProcurementSidebar({ isOpen, className }: ProcurementSidebarProps) {
  const { toggleView } = useProcurement()

  return (
    <motion.aside 
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white pt-16",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center gap-6 p-6 border-b bg-gradient-to-b from-white to-[#f0f7f0]">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pms-logo-WKQhYflzTjlSrGI3gkWDtII5c1jzeK.png" 
            alt="PMS Logo" 
            className="h-20 w-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[#2E8B57]">SLSU-JGE</h2>
            <p className="text-sm font-medium text-[#2E8B57]/80">Procurement Management</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            onClick={toggleView}
          >
            <LayoutGrid className="mr-3 h-5 w-5" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            onClick={toggleView}
          >
            <FileText className="mr-3 h-5 w-5" />
            Purchase Requests
          </Button>
        </nav>

        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}

