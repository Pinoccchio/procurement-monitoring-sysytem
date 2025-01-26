import { Card, CardContent } from "@/components/ui/card"

interface StatusCardProps {
  title: string
  count: number
  type:
    | "approved"
    | "disapproved"
    | "pending"
    | "forwarded"
    | "returned"
    | "assessed"
    | "discrepancy"
    | "received"
    | "delivered"
}

export function StatusCard({ title, count, type }: StatusCardProps) {
  const getCardStyle = () => {
    switch (type) {
      case "approved":
        return "bg-green-100 border-green-200 text-green-800"
      case "disapproved":
        return "bg-red-100 border-red-200 text-red-800"
      case "pending":
        return "bg-blue-100 border-blue-200 text-blue-800"
      case "forwarded":
        return "bg-blue-100 border-blue-200 text-blue-800"
      case "returned":
        return "bg-yellow-100 border-yellow-200 text-yellow-800"
      case "assessed":
        return "bg-green-100 border-green-200 text-green-800"
      case "discrepancy":
        return "bg-red-100 border-red-200 text-red-800"
      case "received":
        return "bg-violet-100 border-violet-200 text-violet-800"
      case "delivered":
        return "bg-violet-100 border-violet-200 text-violet-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  return (
    <Card className={`${getCardStyle()} border`}>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{count}</p>
      </CardContent>
    </Card>
  )
}


