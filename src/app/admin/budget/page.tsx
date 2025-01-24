"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function BudgetPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState("budget")
  const router = useRouter()

  const handleViewChange = (value: string) => {
    setSelectedView(value)
    if (value === "administrative") {
      router.push("/admin/administrative")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 sm:p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold text-[#2E8B57]"
          >
            Management
          </motion.h1>
          <Select value={selectedView} onValueChange={handleViewChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full sm:w-[300px]"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2E8B57]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#2E8B57] focus:ring-[#2E8B57]"
            placeholder="Search budgets"
            type="search"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Budget Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold">Budgets</h3>
                <Button className="w-full sm:w-auto bg-[#2E8B57] hover:bg-[#1a5235]">Add Budget</Button>
              </div>
              <ScrollArea className="h-[300px] sm:h-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-1 sm:px-2">Department</th>
                      <th className="text-left py-2 px-1 sm:px-2">Total Budget</th>
                      <th className="text-left py-2 px-1 sm:px-2">Spent</th>
                      <th className="text-left py-2 px-1 sm:px-2">Remaining</th>
                      <th className="text-left py-2 px-1 sm:px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-1 sm:px-2">Department {index + 1}</td>
                        <td className="py-2 px-1 sm:px-2">${(100000 + index * 10000).toLocaleString()}</td>
                        <td className="py-2 px-1 sm:px-2">${(50000 + index * 5000).toLocaleString()}</td>
                        <td className="py-2 px-1 sm:px-2">${(50000 + index * 5000).toLocaleString()}</td>
                        <td className="py-2 px-1 sm:px-2">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto text-red-500 border-red-500 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

