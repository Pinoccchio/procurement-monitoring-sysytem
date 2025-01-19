import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PurchaseRequest, TrackingEntry } from '@/types/procurement/purchase-request'
import { updatePurchaseRequestStatus } from '@/utils/procurement/purchase-requests'

interface TrackingDialogProps {
  isOpen: boolean
  onClose: () => void
  purchaseRequest: PurchaseRequest
  onUpdate: () => void
}

export function TrackingDialog({ isOpen, onClose, purchaseRequest, onUpdate }: TrackingDialogProps) {
  const [nextDesignation, setNextDesignation] = useState('')
  const [notes, setNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      await updatePurchaseRequestStatus(
        purchaseRequest.id,
        `PR Forwarded to ${nextDesignation}'s Office`,
        nextDesignation,
        notes
      )
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating PR:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tracking Information - {purchaseRequest.pr_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tracking Timeline */}
          <div className="space-y-4">
            {purchaseRequest.tracking_history.map((entry: TrackingEntry, index: number) => (
              <div key={entry.id} className="relative pl-8 pb-4">
                <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-[#2E8B57]" />
                {index !== purchaseRequest.tracking_history.length - 1 && (
                  <div className="absolute left-1 top-3 h-full w-0.5 bg-[#2E8B57]/20" />
                )}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                  <p className="font-medium">{entry.status}</p>
                  {entry.notes && (
                    <p className="text-sm text-gray-600">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Next Designation Form */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Next Designation</Label>
              <Select onValueChange={setNextDesignation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select next office..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procurement">Procurement Office</SelectItem>
                  <SelectItem value="admin">Admin Office</SelectItem>
                  <SelectItem value="budget">Budget Office</SelectItem>
                  <SelectItem value="director">Director's Office</SelectItem>
                  <SelectItem value="bac">BAC Office</SelectItem>
                  <SelectItem value="supply">Supply Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!nextDesignation || isUpdating}
                className="bg-[#2E8B57] hover:bg-[#1a5235]"
              >
                {isUpdating ? 'Updating...' : 'Forward to Next Office'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

