'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatusCard } from "@/components/ui/status-card"
import { PurchaseRequestItem } from "@/components/ui/purchase-request-item"

export default function ProcurementDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
            placeholder="Search" 
            type="search"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatusCard title="APPROVED" count={2} type="approved" />
        <StatusCard title="DISAPPROVED" count={1} type="disapproved" />
        <StatusCard title="PENDING" count={3} type="pending" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 text-[#2E8B57]">Recent Purchase Requests</h2>
        <div className="space-y-4">
          <PurchaseRequestItem 
            prNumber="PR NO- 2025-01-0428" 
            status="PR Forwarded to Procurement's Office" 
          />
          <PurchaseRequestItem 
            prNumber="PR NO- 2025-01-0432" 
            status="PR Forwarded to Director's Office" 
          />
          <PurchaseRequestItem 
            prNumber="PR NO- 2025-01-0521" 
            status="PR Approved for funds availability" 
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

