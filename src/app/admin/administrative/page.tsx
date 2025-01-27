"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { TrackingDialog } from "@/components/layout/admin/TrackingDialog"
import { getPurchaseRequests, updatePurchaseRequestStatus } from "@/utils/admin/purchase-requests"
import type { PurchaseRequest, PRDesignation } from "@/types/procurement/purchase-request"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdministrativePage() {
  const [searchQuery, setSearchQuery] = useState("")
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
      setPurchaseRequests(
        data.filter(
          (pr) =>
            ["forwarded", "approved", "received", "disapproved", "returned"].includes(pr.status) &&
            pr.current_designation === "admin",
        ),
      )
    } catch (error) {
      console.error("Error loading purchase requests:", error)
      setError("Failed to load purchase requests. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReceive = async (pr: PurchaseRequest) => {
    try {
      setError(null)
      await updatePurchaseRequestStatus(pr.id, "received", "admin", "Purchase request received by Administrative")
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
      await updatePurchaseRequestStatus(pr.id, "approved", "admin", "Purchase request approved by Administrative")
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
        "admin", // Keep the current designation as admin
        "Purchase request disapproved by Administrative",
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
        `Purchase request returned to ${destination} by Administrative`,
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
        `Purchase request forwarded to ${destination} by Admin`,
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
          Administrative Management
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
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#2E8B57]">Purchase Requests</h2>
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
                  className={cn(
                    "hover:shadow-md transition-shadow",
                    pr.status === "returned" && "border-l-4 border-l-yellow-500",
                    pr.status === "disapproved" && "border-l-4 border-l-red-500",
                    pr.status === "approved" && "border-l-4 border-l-green-500",
                    pr.status === "forwarded" && "border-l-4 border-l-blue-500",
                    pr.status === "received" && "border-l-4 border-l-purple-500",
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
                        {pr.current_designation === "admin" && (
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
                                          <SelectItem value="procurement">Procurement</SelectItem>
                                          <SelectItem value="budget">Budget</SelectItem>
                                          <SelectItem value="director">Director</SelectItem>
                                          <SelectItem value="bac">BAC</SelectItem>
                                          <SelectItem value="supply">Supply</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>
                                      Cancel
                                    </Button>
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
                                          <SelectItem value="procurement">Procurement</SelectItem>
                                          <SelectItem value="budget">Budget</SelectItem>
                                          <SelectItem value="director">Director</SelectItem>
                                          <SelectItem value="bac">BAC</SelectItem>
                                          <SelectItem value="supply">Supply</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>
                                      Cancel
                                    </Button>
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
                          disabled={pr.status === "forwarded"}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          {pr.status === "forwarded" ? "Receive First" : "View Details"}
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

