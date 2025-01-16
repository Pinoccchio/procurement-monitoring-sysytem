'use client'

import { Bell, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface AppBarProps {
  isSidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
  className?: string
}

export function AppBar({ isSidebarOpen, onSidebarOpenChange, className }: AppBarProps) {
  return (
    <header className={cn("bg-white border-b sticky top-0 z-50", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onSidebarOpenChange(!isSidebarOpen)}
              className="hover:bg-gray-100"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <div className={cn(
                  "h-0.5 bg-gray-600 transition-all",
                  isSidebarOpen ? "w-6 -rotate-45 translate-y-2" : "w-6"
                )} />
                <div className={cn(
                  "h-0.5 bg-gray-600 transition-all",
                  isSidebarOpen ? "opacity-0" : "w-4"
                )} />
                <div className={cn(
                  "h-0.5 bg-gray-600 transition-all",
                  isSidebarOpen ? "w-6 rotate-45 -translate-y-2" : "w-6"
                )} />
              </div>
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              PROCRUMENT MONITORING SYSTEM
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#4ADE80] hover:bg-[#22c55e] text-white">
                  ACCOUNT
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>End User Account</DropdownMenuItem>
                <DropdownMenuItem>Procurement Account</DropdownMenuItem>
                <DropdownMenuItem>Admin Account</DropdownMenuItem>
                <DropdownMenuItem>Director Account</DropdownMenuItem>
                <DropdownMenuItem>BAC Account</DropdownMenuItem>
                <DropdownMenuItem>Supply Account</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

