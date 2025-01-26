"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, AlertCircle } from "lucide-react"
import { TrackingDialog } from "@/components/layout/end-user/TrackingDialog"
import { getPurchaseRequests } from "@/utils/end-user/purchase-requests"
import type { PurchaseRequest } from "@/types/procurement/purchase-request"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function EndUserPurchaseRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([])
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadPurchaseRequests()
  }, [])

  async function loadPurchaseRequests() {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getPurchaseRequests()
      setPurchaseRequests(data)
    } catch (error) {
      console.error("Error loading purchase requests:", error)
      setError("Failed to load purchase requests. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRequests = purchaseRequests.filter(
    (pr) =>
      pr.pr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 sm:p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xl sm:text-2xl font-bold text-[#2E8B57]"
        >
          Purchase Requests
        </motion.h1>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full sm:w-[300px]"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2E8B57]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#2E8B57] focus:ring-[#2E8B57]"
            placeholder="Search PR number or description"
            type="search"
          />
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-sm sm:text-base"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#2E8B57]">All Purchase Requests</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E8B57]"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500">No purchase requests found.</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)] sm:h-auto">
            <div className="space-y-4">
              {filteredRequests.map((pr) => (
                <Card
                  key={pr.id}
                  className={cn("hover:shadow-md transition-shadow", `border-l-4 border-l-${pr.status}-500`)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-base sm:text-lg">{pr.pr_number}</h3>
                        <p className="text-sm text-gray-500">{pr.description}</p>
                        <p className="text-xs text-gray-400">
                          Status: <span className={`font-semibold text-${pr.status}-500`}>{pr.status}</span>
                        </p>
                        <p className="text-xs text-gray-400">Current Designation: {pr.current_designation}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => {
                          setSelectedPR(pr)
                          setIsTrackingOpen(true)
                        }}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </motion.div>

      {selectedPR && (
        <TrackingDialog
          isOpen={isTrackingOpen}
          onClose={() => {
            setIsTrackingOpen(false)
            setSelectedPR(null)
          }}
          purchaseRequest={selectedPR}
        />
      )}
    </motion.div>
  )
}

