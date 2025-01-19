'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BudgetPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedView, setSelectedView] = useState('budget')
  const router = useRouter()

  const handleViewChange = (value: string) => {
    setSelectedView(value)
    if (value === 'administrative') {
      router.push('/admin/administrative')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl font-bold text-[#2E8B57]"
          >
            Management
          </motion.h1>
          <Select value={selectedView} onValueChange={handleViewChange}>
            <SelectTrigger className="w-[180px]">
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
          className="relative w-full md:w-[300px]"
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
            <CardTitle>Budget Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Budgets</h3>
                <Button className="bg-[#2E8B57] hover:bg-[#1a5235]">Add Budget</Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Department</th>
                    <th className="text-left py-2">Total Budget</th>
                    <th className="text-left py-2">Spent</th>
                    <th className="text-left py-2">Remaining</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">Department {index + 1}</td>
                      <td className="py-2">${(100000 + index * 10000).toLocaleString()}</td>
                      <td className="py-2">${(50000 + index * 5000).toLocaleString()}</td>
                      <td className="py-2">${(50000 + index * 5000).toLocaleString()}</td>
                      <td className="py-2">
                        <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-50">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

