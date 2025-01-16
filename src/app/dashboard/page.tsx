import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusCard } from "@/components/ui/status-card"
import { PurchaseRequestItem } from "@/components/ui/purchase-request-item"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          WELCOME TO PROCUREMENT MONITORING SYSTEM
        </h1>
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            className="pl-10" 
            placeholder="Search" 
            type="search"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard title="APPROVED" count={2} type="approved" />
        <StatusCard title="DISAPPROVED" count={1} type="disapproved" />
        <StatusCard title="PENDING" count={3} type="pending" />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Purchase Request</h2>
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
      </div>
    </div>
  )
}

