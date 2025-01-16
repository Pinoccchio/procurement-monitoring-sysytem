import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'

interface PurchaseRequestItemProps {
  prNumber: string
  status: string
}

export function PurchaseRequestItem({ prNumber, status }: PurchaseRequestItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
      <div className="font-bold text-lg">{prNumber}</div>
      <div className="flex items-center gap-4">
        <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm">
          {status}
        </span>
        <Button variant="ghost" size="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

