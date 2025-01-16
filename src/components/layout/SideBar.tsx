'use client'

import { cn } from '@/lib/utils'
import { LayoutGrid, FileText, Users, UserCog, Shield, Package, Wallet, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  className?: string
}

export function Sidebar({ isOpen, className }: SidebarProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-white pt-16 transition-transform",
      isOpen && "translate-x-0",
      className
    )}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center gap-4 p-4 border-b">
          <img 
            src="/pms-logo.png"
            alt="PMS Logo" 
            className="h-16 w-auto"
          />
          <h2 className="text-xl font-bold text-gray-900">SLSU-JGE</h2>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              className="w-full justify-start bg-[#4ADE80] text-white hover:bg-[#22c55e] hover:text-white rounded-lg"
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              Dashboard
            </Button>
          </Link>

          <Link href="/procurement">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <FileText className="mr-3 h-5 w-5" />
              PROCUREMENT
            </Button>
          </Link>

          <div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsAdminOpen(!isAdminOpen)}
            >
              <UserCog className="mr-3 h-5 w-5" />
              <span className="flex-1 text-left">ADMIN</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isAdminOpen && "rotate-180"
              )} />
            </Button>
            {isAdminOpen && (
              <div className="ml-9 mt-1">
                <Link href="/admin/budget-officer">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Budget Officer
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Link href="/director">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <Users className="mr-3 h-5 w-5" />
              DIRECTOR
            </Button>
          </Link>

          <Link href="/bac">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <Shield className="mr-3 h-5 w-5" />
              BAC
            </Button>
          </Link>

          <Link href="/supply">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <Package className="mr-3 h-5 w-5" />
              SUPPLY
            </Button>
          </Link>

          <Link href="/remaining-funds">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <Wallet className="mr-3 h-5 w-5" />
              REMAINING FUNDS
            </Button>
          </Link>
        </nav>

        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  )
}

