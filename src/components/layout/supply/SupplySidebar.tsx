import { cn } from "@/lib/utils"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SupplySidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function SupplySidebar({ isOpen, onClose, className }: SupplySidebarProps) {
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
              <p className="text-sm font-medium text-[#2E8B57]/80">Supply Management</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link href="/supply/supply" onClick={onClose}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:text-white hover:bg-[#2E8B57] transition-colors duration-300",
                  pathname === "/supply/supply" ? "bg-[#2E8B57] text-white" : "text-[#2E8B57]",
                )}
              >
                <Package className="mr-3 h-5 w-5" />
                Supply
              </Button>
            </Link>
          </nav>
        </div>
      </motion.aside>
    </>
  )
}