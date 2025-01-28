import "./globals.css"
import type { Metadata } from "next"
import { SessionCheck } from "@/components/SessionCheck"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Procurement Monitoring System",
  description: "Streamline your procurement tracking and management process",
  icons: {
    icon: "/pms-logo.png", // This will be used as favicon
    apple: "/pms-logo.png", // For iOS devices
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/pms-logo.png" />
      </head>
      <body>
        <SessionCheck />
        {children}
        <Toaster />
      </body>
    </html>
  )
}

