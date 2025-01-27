import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DocumentationGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E8B57] mb-6">Documentation Guide</h1>
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This guide will help you navigate through our documentation effectively. Here are some tips to get the most
            out of our documentation:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Start with the &apos;Getting Started&apos; section for an overview of the system</li>
            <li>Use the search function to find specific topics quickly</li>
            <li>Check out code examples to see how to implement various features</li>
            <li>Refer to the API Reference for detailed information on all available endpoints</li>
            <li>
              If you can&apos;t find what you&apos;re looking for, don&apos;t hesitate to contact our support team
            </li>
          </ul>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Link href="/documentation" className="text-[#2E8B57] hover:underline mr-4">
          Back to Documentation
        </Link>
        <Link href="/" className="text-[#2E8B57] hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

