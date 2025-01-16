'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const userType = formData.get('userType') as string

  if (!email || !password || !userType) {
    return { success: false, error: 'Please fill in all fields' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'User not found' }
    }

    // Check if the user's role matches the selected user type
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('account_type')
      .eq('id', data.user.id)
      .single()

    if (userError || !userData) {
      return { success: false, error: 'Failed to verify user role' }
    }

    if (userData.account_type !== userType) {
      return { success: false, error: 'Invalid user type selected' }
    }

    // Set session cookie
    const cookieStore = await cookies() // Await the promise here
    await cookieStore.set('session', JSON.stringify(data.session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return { success: true, userType: userData.account_type }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}