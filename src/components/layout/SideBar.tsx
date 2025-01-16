'use client'

import { cn } from '@/lib/utils'
import { LayoutGrid, FileText, Users, UserCog, Shield, Package, Wallet, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  className?: string
}

export function Sidebar({ isOpen, className }: SidebarProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false)

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
        <div className="flex flex-col items-center gap-4 p-4 border-b">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pms-logo-WKQhYflzTjlSrGI3gkWDtII5c1jzeK.png" 
            alt="PMS Logo" 
            className="h-16 w-auto"
          />
          <h2 className="text-xl font-bold text-[#2E8B57]">SLSU-JGE</h2>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              className="w-full justify-start bg-[#2E8B57] text-white hover:bg-[#1a5235] hover:text-white rounded-lg transition-colors duration-300"
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              Dashboard
            </Button>
          </Link>

          <Link href="/procurement">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            >
              <FileText className="mr-3 h-5 w-5" />
              PROCUREMENT
            </Button>
          </Link>

          <div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
              onClick={() => setIsAdminOpen(!isAdminOpen)}
            >
              <UserCog className="mr-3 h-5 w-5" />
              <span className="flex-1 text-left">ADMIN</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-300",
                isAdminOpen && "rotate-180"
              )} />
            </Button>
            {isAdminOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-9 mt-1"
              >
                <Link href="/admin/budget-officer">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
                  >
                    Budget Officer
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          <Link href="/director">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            >
              <Users className="mr-3 h-5 w-5" />
              DIRECTOR
            </Button>
          </Link>

          <Link href="/bac">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            >
              <Shield className="mr-3 h-5 w-5" />
              BAC
            </Button>
          </Link>

          <Link href="/supply">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            >
              <Package className="mr-3 h-5 w-5" />
              SUPPLY
            </Button>
          </Link>

          <Link href="/remaining-funds">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2E8B57] hover:text-white hover:bg-[#2E8B57] transition-colors duration-300"
            >
              <Wallet className="mr-3 h-5 w-5" />
              REMAINING FUNDS
            </Button>
          </Link>
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

