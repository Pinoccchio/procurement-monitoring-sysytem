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
        } else {
          router.push(`/dashboard/${user.account_type}`)
        }
      }
    }

    checkSession()
  }, [router])

  return null
}

