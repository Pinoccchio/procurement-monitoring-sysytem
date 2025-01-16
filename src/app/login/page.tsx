'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { login } from '../actions/login'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<string>('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    formData.append('userType', userType)
    const result = await login(formData)
    setIsLoading(false)
    if (result.success) {
      // Redirect based on user type
      switch (result.userType) {
        case 'end-user':
          router.push('/dashboard/end-user')
          break
        case 'procurement':
          router.push('/dashboard/procurement')
          break
        case 'supply':
          router.push('/dashboard/supply')
          break
        case 'director':
          router.push('/dashboard/director')
          break
        case 'bac':
          router.push('/dashboard/bac')
          break
        case 'budget':
          router.push('/dashboard/budget')
          break
        default:
          router.push('/dashboard')
      }
    } else {
      setError(result.error || 'An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Select onValueChange={(value) => setUserType(value)} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>General Users</SelectLabel>
                      <SelectItem value="end-user">End User</SelectItem>
                      <SelectItem value="procurement">Procurement Officer</SelectItem>
                      <SelectItem value="supply">Supply Officer</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Management</SelectLabel>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="bac">BAC Member</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Administration</SelectLabel>
                      <SelectItem value="budget">Budget Officer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Input name="email" type="email" placeholder="Email" required />
              </div>
              <div className="relative">
                <Input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button 
                type="submit" 
                className={`w-full ${isLoading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-gray-600">
              New to Procurement Monitoring System?{' '}
              <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

