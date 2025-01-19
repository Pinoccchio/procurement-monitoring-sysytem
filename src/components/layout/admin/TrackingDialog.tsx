import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { supabaseClient } from "@/utils/procurement/purchase-requests"
import type { PurchaseRequest, PRStatus, PRDesignation } from "@/types/procurement/purchase-request"

interface TrackingDialogProps {
  isOpen: boolean
  onClose: () => void
  purchaseRequest: PurchaseRequest
  onUpdate: () => void
}

export function TrackingDialog({ isOpen, onClose, purchaseRequest, onUpdate }: TrackingDialogProps) {
  const [status, setStatus] = useState<PRStatus>(purchaseRequest.status)
  const [nextDesignation, setNextDesignation] = useState<PRDesignation>(purchaseRequest.current_designation)
  const [remarks, setRemarks] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const { error } = await supabaseClient
        .from('purchase_requests')
        .update({
          status: status,
          current_designation: nextDesignation,
          updated_by: 'admin',
          remarks: remarks
        })
        .eq('id', purchaseRequest.id)

      if (error) throw error

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating purchase request:', error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Request Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pr-number" className="text-right">
              PR Number
            </Label>
            <Input id="pr-number" value={purchaseRequest.pr_number} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input id="department" value={purchaseRequest.department} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: PRStatus) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="disapproved">Disapproved</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="next-designation" className="text-right">
              Next Designation
            </Label>
            <Select value={nextDesignation} onValueChange={(value: PRDesignation) => setNextDesignation(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select next designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="bac">BAC</SelectItem>
                <SelectItem value="supply">Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remarks" className="text-right">
              Remarks
            </Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="col-span-3"
              placeholder="Enter remarks..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

