import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ProcurementManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E8B57] mb-6">Procurement Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Our Procurement Management solution offers a comprehensive set of tools to streamline your procurement
            processes. From requisition to payment, we provide end-to-end visibility and control.
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Centralized procurement data</li>
            <li>Automated approval workflows</li>
            <li>Supplier performance tracking</li>
            <li>Cost savings analysis</li>
            <li>Compliance management</li>
          </ul>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Link href="/" className="text-[#2E8B57] hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

