import { cn } from "@/lib/utils"
import { FileText, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface ProcurementSidebarProps {
  isOpen: boolean
  onClose?: () => void
  className?: string
}

export function ProcurementSidebar({ isOpen, onClose, className }: ProcurementSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30 lg:hidden"
          onClick={() => onClose && onClose()}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 w-64 border-r bg-white",
          "lg:translate-x-0 lg:transition-none",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pt-16">
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
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <Link href="/procurement/dashboard">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                  pathname === "/procurement/dashboard" ? "bg-[#2E8B57] text-white" : "text-[#2E8B57]",
                )}
              >
                <FileText className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/procurement/purchase_requests">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                  pathname === "/procurement/purchase_requests" ? "bg-[#2E8B57] text-white" : "text-[#2E8B57]",
                )}
              >
                <FileText className="mr-3 h-5 w-5" />
                Purchase Requests
              </Button>
            </Link>
            <Link href="/procurement/remaining-funds">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                  pathname === "/procurement/remaining-funds" ? "bg-[#2E8B57] text-white" : "text-[#2E8B57]",
                )}
              >
                <DollarSign className="mr-3 h-5 w-5" />
                Remaining Funds
              </Button>
            </Link>
          </nav>
        </div>
      </motion.aside>
    </>
  )
}

