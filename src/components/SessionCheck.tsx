'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/utils/auth'

export function SessionCheck() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const user = await getUser()
      if (user) {
        if (user.account_type === 'procurement') {
          router.push('/procurement/dashboard')
        } else if (user.account_type === 'admin') {
          router.push('/admin/dashboard')
        } else if (user.account_type === "director") {
          router.push("/director/director")
        } else if (user.account_type === "bac") {
          router.push("/bac/bac")
        } else if (user.account_type === "budget") {
          router.push("/budget/budget")
        } else if (user.account_type === "supply") {
          router.push("/supply/supply")
        } else if (user.account_type === "end-user") {
          router.push("/end-user/purchase-requests")
        } 
        else {
          router.push(`${user.account_type}/dashboard`)
        }  
      }
    }

    checkSession()
  }, [router])

  return null
}

