import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E8B57] mb-6">About Us</h1>
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            At Procurement Monitoring System, our mission is to revolutionize the way organizations manage their
            procurement processes. We strive to provide cutting-edge solutions that enhance efficiency, transparency,
            and cost-effectiveness in procurement operations.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Our Values</h2>
          <ul className="list-disc list-inside">
            <li>Innovation: We continuously seek new ways to improve procurement processes</li>
            <li>Integrity: We uphold the highest standards of honesty and ethical conduct</li>
            <li>Customer-Centric: We put our customers' needs at the heart of everything we do</li>
            <li>Collaboration: We believe in the power of teamwork and partnerships</li>
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

