import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { updatePurchaseRequestStatus, getTrackingHistory } from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest, PRStatus, PRDesignation, TrackingEntry } from "@/types/procurement/purchase-request"
import { cn } from "@/lib/utils"

interface TrackingDialogProps {
  isOpen: boolean
  onClose: () => void
  purchaseRequest: PurchaseRequest
  onUpdate: () => void
}

export function TrackingDialog({ isOpen, onClose, purchaseRequest, onUpdate }: TrackingDialogProps) {
  const [status, setStatus] = useState<PRStatus>(purchaseRequest.status)
  const [nextDesignation, setNextDesignation] = useState<PRDesignation>(purchaseRequest.current_designation)
  const [remarks, setRemarks] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [trackingHistory, setTrackingHistory] = useState<TrackingEntry[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadTrackingHistory()
      setStatus(purchaseRequest.status)
      setNextDesignation(purchaseRequest.current_designation)
      setRemarks("")
    }
  }, [isOpen, purchaseRequest.status, purchaseRequest.current_designation])

  const loadTrackingHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const history = await getTrackingHistory(purchaseRequest.id)
      setTrackingHistory(history)
    } catch (error) {
      console.error("Error loading tracking history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      let message = `Purchase request ${status} by Procurement: ${remarks}`
      if (status === "assessed") {
        message = "Purchase request assessed: Delivery inspected and matches the order"
      } else if (status === "discrepancy") {
        message = "Purchase request discrepancy reported: Delivery does not match the order"
      }
      await updatePurchaseRequestStatus(purchaseRequest.id, status, nextDesignation, message)
      await loadTrackingHistory()
      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating purchase request:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "returned":
        return "text-yellow-500"
      case "disapproved":
        return "text-red-500"
      case "approved":
        return "text-green-500"
      case "forwarded":
        return "text-blue-500"
      case "received":
        return "text-purple-500"
      case "pending":
        return "text-blue-300"
      case "assessed":
        return "text-green-600"
      case "discrepancy":
        return "text-red-600"
      case "delivered":
        return "text-violet-500"
      default:
        return ""
    }
  }

  const getStatusMessage = (entry: TrackingEntry) => {
    const statusColor = getStatusColor(entry.status)
    switch (entry.status) {
      case "assessed":
        return (
          <span className={cn("font-semibold", statusColor)}>
            PR Assessed: Delivery inspected and matches the order
          </span>
        )
      case "discrepancy":
        return (
          <span className={cn("font-semibold", statusColor)}>PR Discrepancy: Delivery does not match the order</span>
        )
      case "delivered":
        return <span className={cn("font-semibold", statusColor)}>PR Delivered by Supply</span>
      default:
        return (
          <span className={cn("font-semibold", statusColor)}>
            PR {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)} by {entry.designation}
          </span>
        )
    }
  }

  const renderStatusOptions = () => {
    switch (purchaseRequest.status) {
      case "delivered":
        return (
          <>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="assessed">Assess Delivery (Matches Order)</SelectItem>
            <SelectItem value="discrepancy">Report Discrepancy (Doesn't Match Order)</SelectItem>
          </>
        )
      case "assessed":
        return (
          <>
            <SelectItem value="assessed">Assessed (Matches Order)</SelectItem>
            <SelectItem value="discrepancy">Report Discrepancy (Doesn't Match Order)</SelectItem>
            <SelectItem value="forwarded">Forward</SelectItem>
          </>
        )
      case "discrepancy":
        return (
          <>
            <SelectItem value="assessed">Assess Delivery (Matches Order)</SelectItem>
            <SelectItem value="discrepancy">Discrepancy (Doesn't Match Order)</SelectItem>
            <SelectItem value="returned">Return</SelectItem>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Request Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pr-number">PR Number</Label>
            <Input id="pr-number" value={purchaseRequest.pr_number} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={purchaseRequest.description} readOnly />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Tracking Information</h3>
            <div className="bg-gray-100 rounded-lg p-4 space-y-4 max-h-[200px] overflow-y-auto">
              {isLoadingHistory ? (
                <p className="text-center text-gray-500">Loading tracking history...</p>
              ) : trackingHistory.length === 0 ? (
                <p className="text-center text-gray-500">No tracking history available</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300" />
                  {trackingHistory.map((entry) => (
                    <div key={entry.id} className="relative pl-8 pb-4">
                      <div className="absolute left-0 w-4 h-4 rounded-full bg-[#2E8B57] border-4 border-white" />
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">{formatDate(entry.created_at)}</div>
                        <div className="font-medium">{getStatusMessage(entry)}</div>
                        {entry.notes && <div className="text-sm text-gray-600">{entry.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {purchaseRequest.status !== "forwarded" && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: PRStatus) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="disapproved">Disapproved</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    {renderStatusOptions()}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-designation">Next Designation</Label>
                <Select
                  value={nextDesignation}
                  onValueChange={(value: PRDesignation) => setNextDesignation(value)}
                  disabled={status !== "forwarded" && status !== "returned"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select next designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {["admin", "budget", "director", "bac", "supply"].map(
                      (designation) =>
                        designation !== purchaseRequest.current_designation && (
                          <SelectItem key={designation} value={designation as PRDesignation}>
                            {designation.charAt(0).toUpperCase() + designation.slice(1)}
                          </SelectItem>
                        ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks..."
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Updating..." : purchaseRequest.status === "forwarded" ? "Receive" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

