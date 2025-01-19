'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight, Eye, EyeOff, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from '@/utils/auth'

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  onShowSignUp: () => void
}

export function LoginDialog({ isOpen, onClose, onShowSignUp }: LoginDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<string>('')
  const [isFormValid, setIsFormValid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    setIsFormValid(!!userType && !!email && !!password)
  }, [userType, email, password])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!userType) {
      setError('Please select a user type')
      setIsLoading(false)
      return
    }

    try {
      const { profile } = await signIn(email, password)
      
      if (profile.account_type !== userType) {
        setError('Selected user type does not match your account')
        setIsLoading(false)
        return
      }

      onClose()
      if (profile.account_type === 'procurement') {
        router.push('/procurement/dashboard')
      } else if (profile.account_type === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push(`/dashboard/${profile.account_type}`)
      }
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-6 text-[#2E8B57]">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Select onValueChange={(value) => setUserType(value)} required>
                <SelectTrigger className="w-full border-slate-200 focus:ring-[#2E8B57] focus:ring-offset-0">
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
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="budget">Budget Officer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-200 focus:ring-[#2E8B57] focus:ring-offset-0"
              />
            </div>
            
            <div className="relative">
              <Input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-slate-200 focus:ring-[#2E8B57] focus:ring-offset-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
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
                  key="error-message"
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
              className={`w-full ${
                !isFormValid
                  ? 'bg-[#2E8B57]/50 cursor-not-allowed'
                  : isLoading
                  ? 'bg-[#2E8B57]/70'
                  : 'bg-[#2E8B57] hover:bg-[#1a5235]'
              } text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:ring-offset-2`} 
              disabled={!isFormValid || isLoading}
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
                <span className="flex items-center justify-center">
                  Sign In
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>

            <p className="text-center text-sm text-slate-600 mt-4">
              Don't have an account?{' '}
              <button 
                onClick={() => {
                  onClose();
                  onShowSignUp();
                }} 
                className="font-medium text-[#2E8B57] hover:text-[#1a5235] transition-colors"
              >
                Sign up
              </button>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

