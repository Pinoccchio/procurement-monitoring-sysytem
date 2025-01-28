"use client"

import { useState, useEffect } from "react"
import { getRemainingFunds } from "@/utils/budget/budget"
import { RemainingFundsDisplay } from "@/components/layout/budget/RemainingFundsDisplay"
import { getDirectorProfile } from "@/utils/director/purchase-requests"
import type { User } from "@/types/procurement/user"
import { supabase } from "@/utils/auth"
import type { RealtimeChannel } from "@supabase/supabase-js"

export default function DirectorRemainingFundsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [remainingFunds, setRemainingFunds] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: RealtimeChannel

    async function loadData() {
      try {
        const [profile, funds] = await Promise.all([getDirectorProfile(), getRemainingFunds()])
        setUser(profile)
        setRemainingFunds(funds)

        // Set up real-time subscription
        channel = supabase
          .channel("remaining_funds_changes")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "remaining_funds",
            },
            (payload) => {
              setRemainingFunds(payload.new.amount)
            },
          )
          .subscribe()
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Cleanup subscription on component unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
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

  if (!user || remainingFunds === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-bold mb-2">Data Not Found</p>
          <p>Unable to retrieve user or remaining funds information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#2E8B57]">Director Remaining Funds View</h1>
      <RemainingFundsDisplay
        amount={remainingFunds}
        canEdit={false}
        onUpdate={async () => {
          // This function does nothing but satisfies the type requirement
          return Promise.resolve()
        }}
      />
    </div>
  )
}

