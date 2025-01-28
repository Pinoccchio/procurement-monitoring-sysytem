"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAdminProfile } from "@/utils/admin/purchase-requests"
import type { User } from "@/types/procurement/user"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAdminProfile() {
      try {
        const profile = await getAdminProfile()
        setUser(profile)
      } catch (error) {
        console.error("Error loading admin profile:", error)
        setError("Failed to load admin profile. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#2E8B57]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-bold mb-2">User Not Found</p>
          <p>Unable to retrieve admin profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-[#2E8B57] hover:text-[#1a5235]">
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#2E8B57]">Admin User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" value={user.first_name} readOnly className="bg-gray-100" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" value={user.last_name} readOnly className="bg-gray-100" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly className="bg-gray-100" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user.account_type} readOnly className="bg-gray-100" />
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

