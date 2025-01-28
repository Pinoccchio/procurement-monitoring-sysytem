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
      } else if (status === "forwarded" || status === "returned") {
        message = `Purchase request ${status} to ${nextDesignation} by Procurement: ${remarks}`
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

  const getStatusMessage = (entry: TrackingEntry) => {
    const statusClass = cn(
      "font-semibold",
      entry.status === "returned" && "text-yellow-500",
      entry.status === "disapproved" && "text-red-500",
      entry.status === "approved" && "text-green-500",
      entry.status === "forwarded" && "text-blue-500",
      entry.status === "received" && "text-purple-500",
      entry.status === "pending" && "text-blue-300",
      entry.status === "assessed" && "text-green-600",
      entry.status === "discrepancy" && "text-red-600",
      entry.status === "delivered" && "text-violet-500",
    )

    switch (entry.status) {
      case "forwarded":
        if (entry.designation === "procurement") {
          if (entry.notes && entry.notes.includes("quotation_abstract")) {
            return (
              <span className={statusClass}>
                Purchase request forwarded to procurement for quotation_abstract by BAC
              </span>
            )
          } else if (entry.notes && entry.notes.includes("purchase_order")) {
            return (
              <span className={statusClass}>
                Purchase request forwarded to procurement for purchase order by Budget
              </span>
            )
          } else {
            return <span className={statusClass}>Purchase request forwarded to procurement</span>
          }
        }
        return <span className={statusClass}>PR Forwarded to {entry.designation}</span>
      case "returned":
        return <span className={statusClass}>PR Returned to {entry.designation}</span>
      case "delivered":
        return <span className={statusClass}>PR Delivered to {entry.designation}</span>
      default:
        return (
          <span className={statusClass}>
            PR {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)} by {entry.designation}
          </span>
        )
    }
  }

  const renderStatusOptions = () => {
    return [
      <SelectItem key="approved" value="approved">
        Approved
      </SelectItem>,
      <SelectItem key="disapproved" value="disapproved">
        Disapproved
      </SelectItem>,
      <SelectItem key="returned" value="returned">
        Returned
      </SelectItem>,
      <SelectItem key="forwarded" value="forwarded">
        Forward
      </SelectItem>,
      <SelectItem key="assessed" value="assessed">
        Assess Delivery
      </SelectItem>,
      <SelectItem key="discrepancy" value="discrepancy">
        Report Discrepancy
      </SelectItem>,
    ]
  }

  const canChangeStatus = () => {
    return purchaseRequest.current_designation === "procurement" && purchaseRequest.status !== "forwarded"
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

          {canChangeStatus() && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: PRStatus) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>{renderStatusOptions()}</SelectContent>
                </Select>
              </div>

              {(status === "forwarded" || status === "returned") && (
                <div className="space-y-2">
                  <Label htmlFor="next-designation">Next Designation</Label>
                  <Select value={nextDesignation} onValueChange={(value: PRDesignation) => setNextDesignation(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select next designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {["admin", "budget", "director", "bac", "supply"].map((designation) => (
                        <SelectItem key={designation} value={designation as PRDesignation}>
                          {designation.charAt(0).toUpperCase() + designation.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
          {canChangeStatus() && (
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : purchaseRequest.status === "forwarded" ? "Receive" : "Update"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


