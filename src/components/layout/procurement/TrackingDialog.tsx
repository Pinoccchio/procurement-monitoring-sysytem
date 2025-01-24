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
  const isProcurement = purchaseRequest.current_designation === "procurement"
  const canModify = isProcurement && purchaseRequest.status !== "forwarded" && purchaseRequest.status !== "received"
  const [action, setAction] = useState<"approve" | "disapprove" | "forward">("approve")
  const [nextDesignation, setNextDesignation] = useState<PRDesignation | "">("")
  const [remarks, setRemarks] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [trackingHistory, setTrackingHistory] = useState<TrackingEntry[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadTrackingHistory()
      setAction("approve")
      setNextDesignation("")
      setRemarks("")
    }
  }, [isOpen, purchaseRequest.id])

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
    if (!isProcurement) {
      console.error("Cannot modify purchase request: not assigned to procurement")
      return
    }

    setIsUpdating(true)
    try {
      let status: PRStatus = action === "approve" ? "approved" : action === "disapprove" ? "disapproved" : "forwarded"
      let designation: PRDesignation = purchaseRequest.current_designation

      if (action === "forward" && nextDesignation) {
        status = "forwarded"
        designation = nextDesignation
      }

      await updatePurchaseRequestStatus(purchaseRequest.id, status, designation, remarks)
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
    )

    switch (entry.status) {
      case "approved":
        return <span className={statusClass}>PR Approved by {entry.designation}</span>
      case "disapproved":
        return <span className={statusClass}>PR Disapproved by {entry.designation}</span>
      case "forwarded":
        return <span className={statusClass}>PR Forwarded to {entry.designation}</span>
      case "pending":
        return <span>PR Created and assigned to {entry.designation}</span>
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

  const showForwardOption = purchaseRequest.status === "approved" && isProcurement

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

          {canModify && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select
                  value={action}
                  onValueChange={(value: "approve" | "disapprove" | "forward") => setAction(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseRequest.status !== "approved" && <SelectItem value="approve">Approve</SelectItem>}
                    {purchaseRequest.status !== "disapproved" && <SelectItem value="disapprove">Disapprove</SelectItem>}
                    {purchaseRequest.status === "approved" && <SelectItem value="forward">Forward</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              {(action === "forward" || showForwardOption) && (
                <div className="space-y-2">
                  <Label htmlFor="next-designation">Next Designation</Label>
                  <Select value={nextDesignation} onValueChange={(value: PRDesignation) => setNextDesignation(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select next designation" />
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
            Close
          </Button>
          {canModify && (
            <Button onClick={handleUpdate} disabled={isUpdating || (action === "forward" && !nextDesignation)}>
              {isUpdating
                ? "Updating..."
                : action === "approve"
                  ? "Approve"
                  : action === "disapprove"
                    ? "Disapprove"
                    : "Forward"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

