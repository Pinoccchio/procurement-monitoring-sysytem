"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { StatusCard } from "@/components/ui/status-card"
import { PurchaseRequestItem } from "@/components/ui/purchase-request-item"
import { getPurchaseRequests, getTrackingHistory } from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest, TrackingEntry } from "@/types/procurement/purchase-request"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const assessedCount = filteredRequests.filter((pr) => pr.status === "assessed").length
  const discrepancyCount = filteredRequests.filter((pr) => pr.status === "discrepancy").length
  const receivedCount = filteredRequests.filter((pr) => pr.status === "received").length
  const deliveredCount = filteredRequests.filter((pr) => pr.status === "delivered").length

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
            className="text-2xl font-bold text-[#2E8B57]"
          >
            Procurement Dashboard
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full md:w-[300px]"
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

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <StatusCard title="APPROVED" count={approvedCount} type="approved" />
          <StatusCard title="DISAPPROVED" count={disapprovedCount} type="disapproved" />
          <StatusCard title="PENDING" count={pendingCount} type="pending" />
          <StatusCard title="FORWARDED" count={forwardedCount} type="forwarded" />
          <StatusCard title="RETURNED" count={returnedCount} type="returned" />
          <StatusCard title="ASSESSED" count={assessedCount} type="assessed" />
          <StatusCard title="DISCREPANCY" count={discrepancyCount} type="discrepancy" />
          <StatusCard title="RECEIVED" count={receivedCount} type="received" />
          <StatusCard title="DELIVERED" count={deliveredCount} type="delivered" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#2E8B57]">Recent Purchase Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentRequests.map((pr) => (
                    <PurchaseRequestItem
                      key={pr.id}
                      prNumber={pr.pr_number}
                      status={pr.status}
                      trackingHistory={trackingHistories[pr.id] || []}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

