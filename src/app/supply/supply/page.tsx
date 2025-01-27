"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Check, X, FileText, AlertCircle, ArrowRight, ArrowLeft, CornerDownRight } from "lucide-react"
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
import { TrackingDialog } from "@/components/layout/supply/TrackingDialog"
import { getPurchaseRequests, updatePurchaseRequestStatus } from "@/utils/supply/purchase-requests"
import type { PurchaseRequest, PRStatus, PRDesignation } from "@/types/procurement/purchase-request"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function SupplyPage() {
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
      setPurchaseRequests(data.filter((pr) => pr.current_designation === "supply"))
    } catch (error) {
      console.error("Error loading purchase requests:", error)
      setError("Failed to load purchase requests. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (pr: PurchaseRequest, newStatus: PRStatus, destination?: PRDesignation) => {
    try {
      setError(null)
      let message = `Purchase request ${newStatus} by Supply`
      if (newStatus === "assessed") {
        message = "Delivery inspected and matches the order"
      } else if (newStatus === "discrepancy") {
        message = "Delivery does not match the order"
      }
      await updatePurchaseRequestStatus(pr.id, newStatus, destination || "supply", message)
      await loadPurchaseRequests()
      setSuccessMessage(`Purchase request ${newStatus} successfully!`)
    } catch (error) {
      console.error(`Error updating purchase request status to ${newStatus}:`, error)
      setError(`Failed to update purchase request status to ${newStatus}. Please try again.`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "border-l-4 border-l-violet-500"
      case "assessed":
        return "border-l-4 border-l-green-500"
      case "discrepancy":
        return "border-l-4 border-l-red-500"
      case "returned":
        return "border-l-4 border-l-yellow-500"
      case "forwarded":
        return "border-l-4 border-l-blue-500"
      case "pending":
        return "border-l-4 border-l-blue-300"
      case "approved":
        return "border-l-4 border-l-green-500"
      case "disapproved":
        return "border-l-4 border-l-red-500"
      case "received":
        return "border-l-4 border-l-violet-500"
      default:
        return "border-l-4 border-l-gray-500"
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
          Supply Management
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
                                pr.status === "discrepancy" && "text-red-500",
                                pr.status === "assessed" && "text-green-500",
                                pr.status === "forwarded" && "text-blue-500",
                                pr.status === "delivered" && "text-violet-500",
                                pr.status === "pending" && "text-blue-300",
                                pr.status === "approved" && "text-green-500",
                                pr.status === "disapproved" && "text-red-500",
                                pr.status === "received" && "text-violet-500",
                              )}
                            >
                              {pr.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {pr.current_designation === "supply" && (
                          <>
                            {pr.status === "forwarded" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none border-purple-500 text-purple-500 hover:bg-purple-50"
                                  >
                                    <CornerDownRight className="h-4 w-4 mr-2" />
                                    Delivered
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Mark Purchase Request as Delivered</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to mark {pr.pr_number} as delivered?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-end gap-2 mt-4">
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                      onClick={() => handleStatusUpdate(pr, "delivered")}
                                      className="bg-purple-500 hover:bg-purple-600"
                                    >
                                      Confirm Delivery
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}

                            {pr.status === "delivered" && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="flex-1 sm:flex-none border-green-500 text-green-500 hover:bg-green-50"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Assess Delivery
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Assess Delivery</DialogTitle>
                                      <DialogDescription>
                                        Confirm that the delivery for {pr.pr_number} matches the order and has been
                                        inspected.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex justify-end gap-2 mt-4">
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <Button
                                        onClick={() => handleStatusUpdate(pr, "assessed")}
                                        className="bg-green-500 hover:bg-green-600"
                                      >
                                        Confirm Assessment
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Report Discrepancy
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Report Discrepancy</DialogTitle>
                                      <DialogDescription>
                                        Report that the delivery for {pr.pr_number} does not match the order.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex justify-end gap-2 mt-4">
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <Button
                                        onClick={() => handleStatusUpdate(pr, "discrepancy")}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Confirm Discrepancy
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}

                            {pr.status === "assessed" && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Report Discrepancy
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Report Discrepancy</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to report a discrepancy for {pr.pr_number}?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex justify-end gap-2 mt-4">
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <Button
                                        onClick={() => handleStatusUpdate(pr, "discrepancy")}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Confirm Discrepancy
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
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
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="budget">Budget</SelectItem>
                                            <SelectItem value="director">Director</SelectItem>
                                            <SelectItem value="bac">BAC</SelectItem>
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
                                            handleStatusUpdate(pr, "forwarded", forwardDestination)
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
                              </>
                            )}

                            {pr.status === "discrepancy" && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="flex-1 sm:flex-none border-green-500 text-green-500 hover:bg-green-50"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Assess
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Assess Purchase Request</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to assess {pr.pr_number} as correct?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex justify-end gap-2 mt-4">
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <Button
                                        onClick={() => handleStatusUpdate(pr, "assessed")}
                                        className="bg-green-500 hover:bg-green-600"
                                      >
                                        Confirm Assessment
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
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
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="budget">Budget</SelectItem>
                                            <SelectItem value="director">Director</SelectItem>
                                            <SelectItem value="bac">BAC</SelectItem>
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
                                            handleStatusUpdate(pr, "returned", returnDestination)
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
                              </>
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

