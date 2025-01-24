"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getTrackingHistory, supabaseClient } from "@/utils/procurement/purchase-requests"
import type { TrackingEntry } from "@/types/procurement/purchase-request"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/utils/auth"

interface ProcurementAppBarProps {
  isSidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
  className?: string
}

export function ProcurementAppBar({ isSidebarOpen, onSidebarOpenChange, className }: ProcurementAppBarProps) {
  const [notifications, setNotifications] = useState<TrackingEntry[]>([])
  const [newNotifications, setNewNotifications] = useState<TrackingEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const history = await getTrackingHistory()
      const sortedHistory = history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setNotifications(sortedHistory)
      setNewNotifications(sortedHistory)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()

    const subscription = supabaseClient
      .channel("tracking_history_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tracking_history" }, (payload) => {
        console.log("Change received!", payload)
        loadNotifications()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [loadNotifications])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500"
      case "disapproved":
        return "text-red-500"
      case "returned":
        return "text-yellow-500"
      case "forwarded":
        return "text-blue-500"
      case "received":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setNewNotifications([])
    }
  }

  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className={cn("bg-white border-b sticky top-0 z-50 shadow-sm", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSidebarOpenChange(!isSidebarOpen)}
              className="hover:bg-[#f0f7f0]"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <div
                  className={cn(
                    "h-0.5 bg-[#2E8B57] transition-all duration-300",
                    isSidebarOpen ? "w-6 -rotate-45 translate-y-2" : "w-6",
                  )}
                />
                <div
                  className={cn("h-0.5 bg-[#2E8B57] transition-all duration-300", isSidebarOpen ? "opacity-0" : "w-4")}
                />
                <div
                  className={cn(
                    "h-0.5 bg-[#2E8B57] transition-all duration-300",
                    isSidebarOpen ? "w-6 rotate-45 -translate-y-2" : "w-6",
                  )}
                />
              </div>
            </Button>
            <h1 className="text-xl font-bold text-[#2E8B57] hidden sm:block">Procurement Management</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Popover open={isOpen} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-[#f0f7f0]">
                  <Bell className="h-5 w-5 text-[#2E8B57]" />
                  {newNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-[#FFD700] rounded-full" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 sm:w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#2E8B57]" />
                    <h3 className="font-semibold text-[#2E8B57]">Recent Activity</h3>
                  </div>
                </div>
                <ScrollArea className="h-[300px] sm:h-[400px]">
                  {isLoading ? (
                    <div className="p-4 text-center text-sm text-gray-500">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No recent activity</div>
                  ) : (
                    <div className="py-2">
                      {notifications.map((notification, index) => (
                        <div key={notification.id}>
                          <div className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 space-y-1">
                                <p className={cn("text-sm font-medium", getStatusColor(notification.status))}>
                                  PR {notification.pr_number} - {notification.status.toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-500">{notification.notes}</p>
                                <p className="text-xs text-gray-400">{formatDate(notification.created_at)}</p>
                              </div>
                            </div>
                          </div>
                          {index < notifications.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#2E8B57] hover:bg-[#1a5235] text-white transition-colors duration-300 px-2 sm:px-4">
                  <span className="hidden sm:inline">PROCUREMENT</span>
                  <ChevronDown className="h-4 w-4 sm:ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/procurement/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSignOut}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}


