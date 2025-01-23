"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, Upload, Check, X, FileText, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrackingDialog } from "@/components/layout/procurement/TrackingDialog"
import {
  createPurchaseRequest,
  getPurchaseRequests,
  updatePurchaseRequestStatus,
  uploadDocument,
} from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest } from "@/types/procurement/purchase-request"

export default function ProcurementPurchaseRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [prNumber, setPrNumber] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([])
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const validatePRNumber = (prNumber: string): boolean => {
    const regex = /^PR-\d{4}-\d{2}-\d{4}$/
    return regex.test(prNumber)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedFile || !prNumber) return

    if (!validatePRNumber(prNumber)) {
      setError("Invalid PR number format. Please use PR-YYYY-MM-XXXX")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccessMessage(null)

      const documentUrl = await uploadDocument(selectedFile)

      await createPurchaseRequest({
        pr_number: prNumber,
        department: "IT", // This should come from the user's department
        document_url: documentUrl,
        current_designation: "procurement",
      })

      setPrNumber("")
      setSelectedFile(null)

      await loadPurchaseRequests()

      setSuccessMessage("Purchase request submitted successfully!")
    } catch (error) {
      console.error("Error submitting purchase request:", error)
      if (error instanceof Error) {
        setError(`Failed to submit purchase request: ${error.message}`)
      } else {
        setError("Failed to submit purchase request. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async (pr: PurchaseRequest) => {
    try {
      setError(null)
      await updatePurchaseRequestStatus(pr.id, "approved", pr.current_designation, "Purchase request approved")
      await loadPurchaseRequests()
      setSuccessMessage("Purchase request approved successfully!")
    } catch (error) {
      console.error("Error approving purchase request:", error)
      setError("Failed to approve purchase request. Please try again.")
    }
  }

  const handleDisapprove = async (pr: PurchaseRequest) => {
    try {
      setError(null)
      await updatePurchaseRequestStatus(pr.id, "disapproved", pr.current_designation, "Purchase request disapproved")
      await loadPurchaseRequests()
      setSuccessMessage("Purchase request disapproved successfully!")
    } catch (error) {
      console.error("Error disapproving purchase request:", error)
      setError("Failed to disapprove purchase request. Please try again.")
    }
  }

  const filteredRequests = purchaseRequests.filter(
    (pr) =>
      pr.pr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase()),
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
            placeholder="Search PR number or department"
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

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 text-sm sm:text-base"
          role="alert"
        >
          <p className="font-bold">Success</p>
          <p>{successMessage}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">New Purchase Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pr-number" className="text-sm sm:text-base">
                    PR Number
                  </Label>
                  <Input
                    id="pr-number"
                    value={prNumber}
                    onChange={(e) => setPrNumber(e.target.value)}
                    placeholder="Enter PR number (e.g., PR-2023-06-0001)"
                    className="border-[#2E8B57] focus:ring-[#2E8B57]"
                    required
                  />
                  <p className="text-xs sm:text-sm text-gray-500">Format: PR-YYYY-MM-XXXX</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-sm sm:text-base">
                    Upload Document
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="border-[#2E8B57] focus:ring-[#2E8B57]"
                      required
                      accept=".pdf"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#2E8B57] hover:bg-[#1a5235] w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Submitting..." : "Submit"}
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
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#2E8B57]">Purchase Requests</h2>
        {isLoading ? (
          <p className="text-sm sm:text-base">Loading purchase requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-sm sm:text-base">No purchase requests found.</p>
        ) : (
          filteredRequests.map((pr) => (
            <Card key={pr.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#2E8B57]" />
                      <h3 className="font-semibold text-base sm:text-lg">{pr.pr_number}</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      <p>Department: {pr.department}</p>
                      <p>Date: {new Date(pr.created_at).toLocaleDateString()}</p>
                      <p>Status: {pr.status}</p>
                      <p>Current Designation: {pr.current_designation}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-none border-green-500 text-green-500 hover:bg-green-50"
                          disabled={pr.status !== "pending"}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Approve Purchase Request</DialogTitle>
                          <DialogDescription>Are you sure you want to approve {pr.pr_number}?</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={() => handleApprove(pr)} className="bg-green-500 hover:bg-green-600">
                            Confirm Approval
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-50"
                          disabled={pr.status !== "pending"}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Disapprove
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Disapprove Purchase Request</DialogTitle>
                          <DialogDescription>Are you sure you want to disapprove {pr.pr_number}?</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={() => handleDisapprove(pr)} variant="destructive">
                            Confirm Disapproval
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

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
                </div>
              </CardContent>
            </Card>
          ))
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
          onUpdate={loadPurchaseRequests}
        />
      )}
    </motion.div>
  )
}

