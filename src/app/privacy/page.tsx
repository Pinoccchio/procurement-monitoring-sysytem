import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E8B57] mb-6">Privacy Policy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This Privacy Policy outlines how we collect, use, and protect your personal information when you use our
            Procurement Monitoring System.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Personal information (name, email address, phone number)</li>
            <li>Account information</li>
            <li>Transaction data</li>
            <li>Usage information</li>
          </ul>
          <h2 className="text-xl font-semibold mt-4 mb-2">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Provide and maintain our services</li>
            <li>Improve and personalize user experience</li>
            <li>Communicate with you about our services</li>
            <li>Ensure the security of our system</li>
          </ul>
          {/* Add more sections as needed */}
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

