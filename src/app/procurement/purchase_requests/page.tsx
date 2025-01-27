"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Check, X, FileText, AlertCircle, ArrowLeft, CornerDownRight, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { TrackingDialog } from "@/components/layout/procurement/TrackingDialog"
import {
  createPurchaseRequest,
  getPurchaseRequests,
  updatePurchaseRequestStatus,
} from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest, PRDesignation } from "@/types/procurement/purchase-request"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const getStatusColor = (status: string) => {
  switch (status) {
    case "assessed":
      return "border-l-4 border-l-green-500"
    case "discrepancy":
      return "border-l-4 border-l-red-500"
    case "received":
      return "border-l-4 border-l-violet-500"
    case "pending":
      return "border-l-4 border-l-blue-300"
    case "approved":
      return "border-l-4 border-l-green-500"
    case "disapproved":
      return "border-l-4 border-l-red-500"
    case "returned":
      return "border-l-4 border-l-yellow-500"
    case "forwarded":
      return "border-l-4 border-l-blue-500"
    case "delivered":
      return "border-l-4 border-l-violet-500"
    default:
      return "border-l-4 border-l-gray-500"
  }
}

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
  const [returnDestination, setReturnDestination] = useState<PRDesignation | null>(null)
  const [forwardDestination, setForwardDestination] = useState<PRDesignation | null>(null)

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

  const handleReceive = async (pr: PurchaseRequest) => {
    try {
      setError(null)
      await updatePurchaseRequestStatus(pr.id, "received", "procurement", "Purchase request received by Procurement")
      await loadPurchaseRequests()
      setSuccessMessage("Purchase request received successfully!")
    } catch (error) {
      console.error("Error receiving purchase request:", error)
      setError("Failed to receive purchase request. Please try again.")
    }
  }

  const handleApprove = async (pr: PurchaseRequest) => {
    try {
      setError(null)
      await updatePurchaseRequestStatus(pr.id, "approved", "procurement", "Purchase request approved by Procurement")
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
      await updatePurchaseRequestStatus(
        pr.id,
        "disapproved",
        "procurement",
        "Purchase request disapproved by Procurement",
      )
      await loadPurchaseRequests()
      setSuccessMessage("Purchase request disapproved successfully!")
    } catch (error) {
      console.error("Error disapproving purchase request:", error)
      setError("Failed to disapprove purchase request. Please try again.")
    }
  }

  const handleReturn = async (pr: PurchaseRequest, destination: PRDesignation) => {
    try {
      setError(null)
      await updatePurchaseRequestStatus(
        pr.id,
        "returned",
        destination,
        `Purchase request returned to ${destination} by Procurement`,
      )
      await loadPurchaseRequests()
      setSuccessMessage("Purchase request returned successfully!")
    } catch (error) {
      console.error("Error returning purchase request:", error)
      setError("Failed to return purchase request. Please try again.")
    }
  }

  const handleForward = async (pr: PurchaseRequest, destination: PRDesignation) => {
    try {
      setError(null)
      await updatePurchaseRequestStatus(
        pr.id,
        "forwarded",
        destination,
        `Purchase request forwarded to ${destination} by Procurement`,
      )
      await loadPurchaseRequests()
      setSuccessMessage("Purchase request forwarded successfully!")
    } catch (error) {
      console.error("Error forwarding purchase request:", error)
      setError("Failed to forward purchase request. Please try again.")
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
          <ScrollArea className="h-[calc(100vh-300px)] sm:h-auto">
            <div className="space-y-4">
              {filteredRequests.map((pr) => (
                <Card key={pr.id} className={cn("hover:shadow-md transition-shadow", getStatusColor(pr.status))}>
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
                                pr.status === "received" && "text-violet-500",
                                pr.status === "pending" && "text-blue-300",
                                pr.status === "assessed" && "text-green-500",
                                pr.status === "discrepancy" && "text-red-500",
                                pr.status === "delivered" && "text-violet-500",
                              )}
                            >
                              {pr.status}
                            </span>
                          </p>
                          <p>Current Designation: {pr.current_designation}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {pr.current_designation === "procurement" && (
                          <>
                            {(pr.status === "forwarded" || pr.status === "returned") && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none border-blue-500 text-blue-500 hover:bg-blue-50"
                                  >
                                    <CornerDownRight className="h-4 w-4 mr-2" />
                                    Receive
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Receive Purchase Request</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to receive {pr.pr_number}?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-end gap-2 mt-4">
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={() => handleReceive(pr)} className="bg-blue-500 hover:bg-blue-600">
                                      Confirm Receipt
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}

                            {(pr.status === "pending" || pr.status === "received" || pr.status === "disapproved") && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none border-green-500 text-green-500 hover:bg-green-50"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Approve Purchase Request</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to approve {pr.pr_number}?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-end gap-2 mt-4">
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                      onClick={() => handleApprove(pr)}
                                      className="bg-green-500 hover:bg-green-600"
                                    >
                                      Confirm Approval
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}

                            {(pr.status === "pending" || pr.status === "received" || pr.status === "approved") && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Disapprove
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Disapprove Purchase Request</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to disapprove {pr.pr_number}?
                                    </DialogDescription>
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
                            )}

                            {pr.status === "approved" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none border-blue-500 text-blue-500 hover:bg-blue-50"
                                  >
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Forward
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Forward Purchase Request</DialogTitle>
                                    <DialogDescription>
                                      Choose where to forward {pr.pr_number} and confirm the action.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="forward-destination">Forward Destination</Label>
                                      <Select onValueChange={(value: PRDesignation) => setForwardDestination(value)}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select destination" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="admin">Admin</SelectItem>
                                          <SelectItem value="budget">Budget</SelectItem>
                                          <SelectItem value="director">Director</SelectItem>
                                          <SelectItem value="bac">BAC</SelectItem>
                                          <SelectItem value="supply">Supply</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                      onClick={() => {
                                        if (forwardDestination) {
                                          handleForward(pr, forwardDestination)
                                        }
                                      }}
                                      disabled={!forwardDestination}
                                      className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      Confirm Forward
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}

                            {pr.status === "disapproved" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                                  >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Return
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Return Purchase Request</DialogTitle>
                                    <DialogDescription>
                                      Choose where to return {pr.pr_number} and confirm the action.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="return-destination">Return Destination</Label>
                                      <Select onValueChange={(value: PRDesignation) => setReturnDestination(value)}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select destination" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="admin">Admin</SelectItem>
                                          <SelectItem value="budget">Budget</SelectItem>
                                          <SelectItem value="director">Director</SelectItem>
                                          <SelectItem value="bac">BAC</SelectItem>
                                          <SelectItem value="supply">Supply</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                      onClick={() => {
                                        if (returnDestination) {
                                          handleReturn(pr, returnDestination)
                                        }
                                      }}
                                      disabled={!returnDestination}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                    >
                                      Confirm Return
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        )}

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
          onUpdate={loadPurchaseRequests}
        />
      )}
    </motion.div>
  )
}

