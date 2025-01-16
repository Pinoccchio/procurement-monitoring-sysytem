'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, Upload, Check, X, FileText, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PurchaseRequestItem } from "@/components/ui/purchase-request-item"
import { StatusCard } from "@/components/ui/status-card"
import { useProcurement } from '@/contexts/procurement-context'


export default function ProcurementDashboardPage() {
  const { showPurchaseRequests } = useProcurement()
  const [searchQuery, setSearchQuery] = useState('')

  //const [prNumber, setPrNumber] = useState('')
  //const [selectedFile, setSelectedFile] = useState<File | null>(null)
  //const [showPurchaseRequests, setShowPurchaseRequests] = useState(false)

  //const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //  if (event.target.files && event.target.files[0]) {
  //    setSelectedFile(event.target.files[0])
  //  }
  //}

  //const handleSubmit = (event: React.FormEvent) => {
  //  event.preventDefault()
  //  // Handle form submission
  //  console.log('Submitted:', { prNumber, selectedFile })
  //}

  //const handleApprove = (id: string) => {
  //  // Handle approve logic
  //  console.log('Approved:', id)
  //}

  //const handleDisapprove = (id: string) => {
  //  // Handle disapprove logic
  //  console.log('Disapproved:', id)
  //}

  //const toggleView = () => setShowPurchaseRequests(!showPurchaseRequests)

  const purchaseRequests = [
    { id: '1', prNumber: 'PR NO- 2025-01-0428', department: 'IT', date: '2025-03-08' },
    { id: '2', prNumber: 'PR NO- 2025-01-0432', department: 'HR', date: '2025-03-15' },
    { id: '3', prNumber: 'PR NO- 2025-01-0521', department: 'Finance', date: '2025-03-22' },
  ]

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
          {showPurchaseRequests ? "Purchase Requests" : "Procurement Dashboard"}
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

      {showPurchaseRequests ? (
        <PurchaseRequestsView />
      ) : (
        <>
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
            <h2 className="text-xl font-bold mb-4 text-[#2E8B57]">Purchase Request</h2>
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
        </>
      )}
    </motion.div>
  )
}

function PurchaseRequestsView() {
  const [prNumber, setPrNumber] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission
    console.log('Submitted:', { prNumber, selectedFile })
  }

  const handleApprove = (id: string) => {
    // Handle approve logic
    console.log('Approved:', id)
  }

  const handleDisapprove = (id: string) => {
    // Handle disapprove logic
    console.log('Disapproved:', id)
  }

  const purchaseRequests = [
    { id: '1', prNumber: 'PR NO- 2025-01-0428', department: 'IT', date: '2025-03-08' },
    { id: '2', prNumber: 'PR NO- 2025-01-0432', department: 'HR', date: '2025-03-15' },
    { id: '3', prNumber: 'PR NO- 2025-01-0521', department: 'Finance', date: '2025-03-22' },
  ]

  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>New Purchase Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pr-number">PR Number</Label>
                  <Input
                    id="pr-number"
                    value={prNumber}
                    onChange={(e) => setPrNumber(e.target.value)}
                    placeholder="Enter PR number"
                    className="border-[#2E8B57] focus:ring-[#2E8B57]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Document</Label>
                  <div className="flex gap-2">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="border-[#2E8B57] focus:ring-[#2E8B57]"
                    />
                    <Button 
                      type="submit"
                      className="bg-[#2E8B57] hover:bg-[#1a5235]"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold mb-4 text-[#2E8B57]">Purchase Requests</h2>
        {purchaseRequests.map((pr) => (
          <Card key={pr.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#2E8B57]" />
                    <h3 className="font-semibold text-lg">{pr.prNumber}</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Department: {pr.department}</p>
                    <p>Date: {pr.date}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 md:flex-none border-green-500 text-green-500 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Purchase Request</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to approve {pr.prNumber}?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button 
                          onClick={() => handleApprove(pr.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Confirm Approval
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 md:flex-none border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Disapprove
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Disapprove Purchase Request</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to disapprove {pr.prNumber}?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button 
                          onClick={() => handleDisapprove(pr.id)}
                          variant="destructive"
                        >
                          Confirm Disapproval
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="flex-1 md:flex-none">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </>
  )
}

