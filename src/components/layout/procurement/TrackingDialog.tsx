import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { updatePurchaseRequestStatus, getTrackingHistory } from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest, PRStatus, PRDesignation, TrackingEntry } from "@/types/procurement/purchase-request"

interface TrackingDialogProps {
  isOpen: boolean
  onClose: () => void
  purchaseRequest: PurchaseRequest
  onUpdate: () => void
}

export function TrackingDialog({ isOpen, onClose, purchaseRequest, onUpdate }: TrackingDialogProps) {
  const [nextDesignation, setNextDesignation] = useState<PRDesignation>(purchaseRequest.current_designation)
  const [remarks, setRemarks] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [trackingHistory, setTrackingHistory] = useState<TrackingEntry[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadTrackingHistory()
    }
  }, [isOpen, purchaseRequest.id])

  const loadTrackingHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const history = await getTrackingHistory(purchaseRequest.id)
      setTrackingHistory(history)
    } catch (error) {
      console.error('Error loading tracking history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updatePurchaseRequestStatus(
        purchaseRequest.id,
        'forwarded',
        nextDesignation,
        remarks
      )
      await loadTrackingHistory()
      onUpdate()
    } catch (error) {
      console.error('Error updating purchase request:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusMessage = (entry: TrackingEntry) => {
    switch (entry.status) {
      case 'approved':
        return `PR Approved by ${entry.designation}`
      case 'disapproved':
        return `PR Disapproved by ${entry.designation}`
      case 'forwarded':
        return `PR Forwarded to ${entry.designation}`
      case 'pending':
        return `PR Created and assigned to ${entry.designation}`
      case 'returned':
        return `PR Returned to ${entry.designation}`
      default:
        return `PR Status updated to ${entry.status} by ${entry.designation}`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Purchase Request Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pr-number">PR Number</Label>
              <Input id="pr-number" value={purchaseRequest.pr_number} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={purchaseRequest.department} readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Tracking Information</h3>
            <div className="bg-gray-100 rounded-lg p-4 space-y-4">
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
                        <div className="text-sm text-gray-600">
                          {formatDate(entry.created_at)}
                        </div>
                        <div className="font-medium">
                          {getStatusMessage(entry)}
                        </div>
                        {entry.notes && (
                          <div className="text-sm text-gray-600">{entry.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="next-designation">Forward to</Label>
              <Select value={nextDesignation} onValueChange={(value: PRDesignation) => setNextDesignation(value)}>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Forward'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

