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

