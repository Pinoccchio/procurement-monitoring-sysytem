import { TypeIcon as type, LucideIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StatusCardProps {
  title: string
  count: number
  type: "pending" | "approved" | "disapproved" | "completed"
  icon?: LucideIcon
}

export function StatusCard({ title, count, type, icon: Icon }: StatusCardProps) {
  const color =
    type === "pending"
      ? "text-amber-500"
      : type === "approved"
      ? "text-green-500"
      : type === "disapproved"
      ? "text-red-500"
      : "text-blue-500";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="py-2">
        <p className={`${color} text-lg font-semibold`}>{count}</p>
      </CardContent>
    </Card>
  )
}

