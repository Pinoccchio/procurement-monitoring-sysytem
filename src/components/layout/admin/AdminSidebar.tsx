"use client"

import { cn } from "@/lib/utils"
import { LayoutGrid, Users, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function AdminSidebar({ isOpen, onClose, className }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigate = (path: string) => {
    router.push(`/admin/${path}`)
    onClose() // Close the sidebar on mobile after navigation
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white pt-16",
          "lg:translate-x-0 lg:transition-none",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center gap-6 p-6 border-b bg-gradient-to-b from-white to-[#e6f3ed]">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pms-logo-WKQhYflzTjlSrGI3gkWDtII5c1jzeK.png"
              alt="PMS Logo"
              className="h-20 w-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-[#2E8B57]">SLSU-JGE</h2>
              <p className="text-sm font-medium text-[#2E8B57]/80">Admin Management</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link href="/admin/dashboard" onClick={() => onClose()}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                  pathname === "/admin/dashboard" ? "bg-[#2E8B57] text-white" : "text-[#2E8B57]",
                )}
              >
                <LayoutGrid className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                    pathname === "/admin/administrative" || pathname === "/admin/budget"
                      ? "bg-[#2E8B57] text-white"
                      : "text-[#2E8B57]",
                  )}
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span className="flex-1 text-left">{pathname === "/admin/budget" ? "Budget" : "Administrative"}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[calc(var(--radix-dropdown-menu-trigger-width)-24px)]"
                align="start"
                sideOffset={0}
              >
                <DropdownMenuItem
                  onClick={() => handleNavigate("administrative")}
                  className="hover:bg-[#2E8B57] hover:text-white focus:bg-[#2E8B57] focus:text-white"
                >
                  Administrative
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigate("budget")}
                  className="hover:bg-[#2E8B57] hover:text-white focus:bg-[#2E8B57] focus:text-white"
                >
                  Budget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </motion.aside>
    </>
  )
}

