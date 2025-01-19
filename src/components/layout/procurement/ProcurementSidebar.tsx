'use client'

import { cn } from '@/lib/utils'
import { LayoutGrid, FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/utils/auth'

interface ProcurementSidebarProps {
  isOpen: boolean
  className?: string
}

export function ProcurementSidebar({ isOpen, className }: ProcurementSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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
          <Link href="/procurement/dashboard">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                pathname === '/procurement/dashboard' ? "bg-[#2E8B57] text-white" : "text-[#2E8B57]"
              )}
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/procurement/purchase_requests">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                pathname === '/procurement/purchase_requests' ? "bg-[#2E8B57] text-white" : "text-[#2E8B57]"
              )}
            >
              <FileText className="mr-3 h-5 w-5" />
              Purchase Requests
            </Button>
          </Link>
        </nav>

        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}

