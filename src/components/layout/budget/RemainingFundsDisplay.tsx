import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RemainingFundsDisplayProps {
  amount: number
  canEdit: boolean
  onUpdate: (newAmount: number) => Promise<void>
}

export function RemainingFundsDisplay({ amount, canEdit, onUpdate }: RemainingFundsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editAmount, setEditAmount] = useState(amount.toString())

  const handleEdit = () => {
    setIsEditing(true)
    setEditAmount(amount.toString())
  }

  const handleSave = async () => {
    const newAmount = Number.parseFloat(editAmount)
    if (!isNaN(newAmount)) {
      await onUpdate(newAmount)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditAmount(amount.toString())
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="w-40" />
          <Button onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
          {canEdit && <Button onClick={handleEdit}>Edit</Button>}
        </div>
      )}
    </div>
  )
}

