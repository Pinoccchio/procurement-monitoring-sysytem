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
  }, [isOpen, purchaseRequest.id, purchaseRequest.status, purchaseRequest.current_designation])

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
      if (purchaseRequest.status === "forwarded") {
        await updatePurchaseRequestStatus(
          purchaseRequest.id,
          "received",
          purchaseRequest.current_designation,
          "Purchase request received by Administrative",
        )
      } else if (status === "returned" || status === "disapproved") {
        await updatePurchaseRequestStatus(
          purchaseRequest.id,
          status,
          "procurement", // Always return to procurement for both returned and disapproved
          `Purchase request ${status} to Procurement by ${purchaseRequest.current_designation}: ${remarks}`,
        )
      } else {
        await updatePurchaseRequestStatus(purchaseRequest.id, status, nextDesignation, remarks)
      }
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
    )

    switch (entry.status) {
      case "approved":
        return <span className={statusClass}>PR Approved by {entry.designation}</span>
      case "disapproved":
        return <span className={statusClass}>PR Disapproved by {entry.designation}</span>
      case "forwarded":
        return <span className={statusClass}>PR Forwarded to {entry.designation}</span>
      case "pending":
        return <span className={statusClass}>PR Created and assigned to {entry.designation}</span>
      case "returned":
        return <span className={statusClass}>PR Returned to {entry.designation}</span>
      case "received":
        return <span className={statusClass}>PR Received by {entry.designation}</span>
      default:
        return (
          <span>
            PR Status updated to {entry.status} by {entry.designation}
          </span>
        )
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-designation">Next Designation</Label>
                <Select
                  value={status === "returned" || status === "disapproved" ? "procurement" : nextDesignation}
                  onValueChange={(value: PRDesignation) => setNextDesignation(value)}
                  disabled={status === "returned" || status === "disapproved"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select next designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="bac">BAC</SelectItem>
                    <SelectItem value="supply">Supply</SelectItem>
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

