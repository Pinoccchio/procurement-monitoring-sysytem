import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E8B57] mb-6">Terms of Service</h1>
      <Card>
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            These Terms of Service govern your use of our Procurement Monitoring System. By accessing or using our
            service, you agree to be bound by these Terms.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Use of Service</h2>
          <p>You agree to use our service only for lawful purposes and in accordance with these Terms of Service.</p>
          <h2 className="text-xl font-semibold mt-4 mb-2">User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information. You are responsible
            for safeguarding the password and for all activities that occur under your account.
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by us and are protected by
            international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
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

