"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { TrackingEntry } from "@/types/procurement/purchase-request"
import { cn } from "@/lib/utils"

interface PurchaseRequestItemProps {
  prNumber: string
  status: string
  currentDesignation: string
  trackingHistory: TrackingEntry[]
}

export function PurchaseRequestItem({
  prNumber,
  status,
  currentDesignation,
  trackingHistory,
}: PurchaseRequestItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "assessed":
        return "bg-green-100 text-green-800"
      case "discrepancy":
        return "bg-red-100 text-red-800"
      case "received":
        return "bg-violet-100 text-violet-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "disapproved":
        return "bg-red-100 text-red-800"
      case "returned":
        return "bg-yellow-100 text-yellow-800"
      case "forwarded":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-violet-100 text-violet-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden border", getStatusColor(status))}>
      <div className="flex items-center justify-between p-4">
        <div className="font-bold text-lg">{prNumber}</div>
        <div className="flex items-center gap-4">
          <span className={cn("px-4 py-2 rounded-full text-sm font-medium", getStatusColor(status))}>
            {status.toUpperCase()}
          </span>
          <Button variant="ghost" size="icon" onClick={toggleDropdown} className="text-gray-600 hover:text-gray-800">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-2 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Tracking History</h3>
              {trackingHistory.length === 0 ? (
                <p className="text-gray-500">No tracking history available.</p>
              ) : (
                trackingHistory.map((entry) => (
                  <div key={entry.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                    <p className={cn("font-medium", getStatusColor(entry.status))}>{entry.status.toUpperCase()}</p>
                    <p className="text-sm text-gray-600">{entry.notes}</p>
                    <p className="text-xs text-gray-400">{formatDate(entry.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

