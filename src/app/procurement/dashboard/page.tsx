"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { StatusCard } from "@/components/ui/status-card"
import { PurchaseRequestItem } from "@/components/ui/purchase-request-item"
import { getPurchaseRequests, getTrackingHistory } from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest, TrackingEntry } from "@/types/procurement/purchase-request"

export default function ProcurementDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([])
  const [trackingHistories, setTrackingHistories] = useState<{ [key: string]: TrackingEntry[] }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const data = await getPurchaseRequests()
        setPurchaseRequests(data)

        const histories: { [key: string]: TrackingEntry[] } = {}
        for (const pr of data) {
          const history = await getTrackingHistory(pr.id)
          histories[pr.id] = history
        }
        setTrackingHistories(histories)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredRequests = purchaseRequests.filter(
    (pr) =>
      pr.pr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const approvedCount = filteredRequests.filter((pr) => pr.status === "approved").length
  const disapprovedCount = filteredRequests.filter((pr) => pr.status === "disapproved").length
  const pendingCount = filteredRequests.filter((pr) => pr.status === "pending").length
  const forwardedCount = filteredRequests.filter((pr) => pr.status === "forwarded").length
  const returnedCount = filteredRequests.filter((pr) => pr.status === "returned").length

  const recentRequests = filteredRequests
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-8 h-8 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 lg:p-6"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800"
          >
            Procurement Dashboard
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full md:w-[300px]"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search PR number or description"
              type="search"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <StatusCard title="APPROVED" count={approvedCount} type="approved" />
          <StatusCard title="DISAPPROVED" count={disapprovedCount} type="disapproved" />
          <StatusCard title="PENDING" count={pendingCount} type="pending" />
          <StatusCard title="FORWARDED" count={forwardedCount} type="forwarded" />
          <StatusCard title="RETURNED" count={returnedCount} type="returned" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Purchase Requests</h2>
          <div className="space-y-4">
            {recentRequests.map((pr) => (
              <PurchaseRequestItem
                key={pr.id}
                prNumber={pr.pr_number}
                status={`PR ${pr.status.charAt(0).toUpperCase() + pr.status.slice(1)} to ${pr.current_designation}'s Office`}
                trackingHistory={trackingHistories[pr.id] || []}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

