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

interface ProcurementAppBarProps {
  isSidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
  className?: string
}

export function ProcurementAppBar({ isSidebarOpen, onSidebarOpenChange, className }: ProcurementAppBarProps) {
  return (
    <header className={cn("bg-white border-b sticky top-0 z-50 shadow-sm", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onSidebarOpenChange(!isSidebarOpen)}
              className="hover:bg-[#f0f7f0]"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <div className={cn(
                  "h-0.5 bg-[#2E8B57] transition-all duration-300",
                  isSidebarOpen ? "w-6 -rotate-45 translate-y-2" : "w-6"
                )} />
                <div className={cn(
                  "h-0.5 bg-[#2E8B57] transition-all duration-300",
                  isSidebarOpen ? "opacity-0" : "w-4"
                )} />
                <div className={cn(
                  "h-0.5 bg-[#2E8B57] transition-all duration-300",
                  isSidebarOpen ? "w-6 rotate-45 -translate-y-2" : "w-6"
                )} />
              </div>
            </Button>
            <h1 className="text-xl font-bold text-[#2E8B57]">
              Procurement Management
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-[#f0f7f0]">
              <Bell className="h-5 w-5 text-[#2E8B57]" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-[#FFD700] rounded-full" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#2E8B57] hover:bg-[#1a5235] text-white transition-colors duration-300">
                  PROCUREMENT
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

