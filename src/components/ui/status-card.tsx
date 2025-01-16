import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

interface StatusCardProps {
  title: string
  count: number
  type: 'approved' | 'disapproved' | 'pending'
}

export function StatusCard({ title, count, type }: StatusCardProps) {
  const icons = {
    approved: <ThumbsUp className="w-8 h-8 text-green-500" />,
    disapproved: <ThumbsDown className="w-8 h-8 text-red-500" />,
    pending: <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
  }

  return (
    <Card className="bg-white border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        {icons[type]}
        <span className="text-4xl font-bold">{count}</span>
      </CardContent>
    </Card>
  )
}

