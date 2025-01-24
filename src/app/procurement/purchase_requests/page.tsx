"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Check, X, FileText, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { TrackingDialog } from "@/components/layout/procurement/TrackingDialog"
import {
  createPurchaseRequest,
  getPurchaseRequests,
  updatePurchaseRequestStatus,
} from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest } from "@/types/procurement/purchase-request"
import { cn } from "@/lib/utils"

export default function ProcurementPurchaseRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [prNumber, setPrNumber] = useState("")
  const [description, setDescription] = useState("")
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

  const validatePRNumber = (prNumber: string): boolean => {
    const regex = /^PR-\d{4}-\d{2}-\d{4}$/
    return regex.test(prNumber)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!prNumber || !description) return

    if (!validatePRNumber(prNumber)) {
      setError("Invalid PR number format. Please use PR-YYYY-MM-XXXX")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccessMessage(null)

      await createPurchaseRequest({
        pr_number: prNumber,
        description: description,
        current_designation: "procurement",
      })

      setPrNumber("")
      setDescription("")

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
    if (pr.current_designation !== "procurement") {
      setError("Cannot modify this purchase request as it's not currently assigned to procurement.")
      return
    }
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
    if (pr.current_designation !== "procurement") {
      setError("Cannot modify this purchase request as it's not currently assigned to procurement.")
      return
    }
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
      pr.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            className="text-xl sm:text-2xl font-bold text-[#2E8B57]"
          >
            Purchase Requests
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
                  <Label htmlFor="description" className="text-sm sm:text-base">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter purchase request description"
                    className="border-[#2E8B57] focus:ring-[#2E8B57]"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2E8B57] hover:bg-[#1a5235] w-full sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
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
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#2E8B57]">Purchase Requests List</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="flex justify-center py-8 text-gray-500">No purchase requests found.</CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRequests.map((pr) => (
                <Card
                  key={pr.id}
                  className={cn(
                    "hover:shadow-md transition-shadow",
                    pr.status === "returned" && "border-l-4 border-l-yellow-500",
                    pr.status === "disapproved" && "border-l-4 border-l-red-500",
                    pr.status === "approved" && "border-l-4 border-l-green-500",
                    pr.status === "forwarded" && "border-l-4 border-l-blue-500",
                    pr.status === "received" && "border-l-4 border-l-purple-500",
                    pr.status === "pending" && "border-l-4 border-l-blue-300",
                  )}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-[#2E8B57]" />
                          <h3 className="font-semibold text-base sm:text-lg">{pr.pr_number}</h3>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          <p>Description: {pr.description}</p>
                          <p>Date: {new Date(pr.created_at).toLocaleDateString()}</p>
                          <p>
                            Status:{" "}
                            <span
                              className={cn(
                                "font-semibold",
                                pr.status === "returned" && "text-yellow-500",
                                pr.status === "disapproved" && "text-red-500",
                                pr.status === "approved" && "text-green-500",
                                pr.status === "forwarded" && "text-blue-500",
                                pr.status === "received" && "text-purple-500",
                                pr.status === "pending" && "text-blue-300",
                              )}
                            >
                              {pr.status}
                            </span>
                          </p>
                          <p>Current Designation: {pr.current_designation}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 sm:flex-none",
                                pr.current_designation === "procurement" && pr.status !== "approved"
                                  ? "border-green-500 text-green-500 hover:bg-green-50"
                                  : "border-gray-300 text-gray-400 hover:bg-gray-50 opacity-50 cursor-not-allowed",
                              )}
                              disabled={pr.current_designation !== "procurement" || pr.status === "approved"}
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
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
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
                              className={cn(
                                "flex-1 sm:flex-none",
                                pr.current_designation === "procurement" && pr.status !== "disapproved"
                                  ? "border-red-500 text-red-500 hover:bg-red-50"
                                  : "border-gray-300 text-gray-400 hover:bg-gray-50 opacity-50 cursor-not-allowed",
                              )}
                              disabled={pr.current_designation !== "procurement" || pr.status === "disapproved"}
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
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
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
              ))}
            </div>
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
      </div>
    </motion.div>
  )
}

