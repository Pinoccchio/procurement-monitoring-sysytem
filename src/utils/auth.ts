import { createClient } from '@supabase/supabase-js'
import type { User } from '@/types/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'end-user' | 'procurement' | 'budget' | 'director' | 'bac' | 'supply' | 'admin'

interface SignUpData {
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
}

export async function signUp({ email, password, role, firstName, lastName }: SignUpData) {
  try {
    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing user:', fetchError)
      throw new Error(`Failed to check existing user: ${fetchError.message}`)
    }

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          account_type: role
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(`Authentication error: ${authError.message}`)
    }
    if (!authData.user) {
      console.error('No user data returned from auth signup')
      throw new Error('Failed to create user account: No user data returned')
    }

    // Create user profile in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert([
        {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          account_type: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (userError) {
      console.error('User profile creation error:', userError)
      // If profile creation fails, we should delete the auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id)
      if (deleteError) {
        console.error('Error deleting auth user after profile creation failure:', deleteError)
      }
      throw new Error(`Failed to create user profile: ${userError.message}`)
    }

    if (!userData) {
      console.error('No user data returned from profile creation')
      throw new Error('Failed to create user profile: No data returned')
    }

    console.log('User created successfully:', { id: userData.id, email: userData.email, role: userData.account_type })

    return { user: authData.user, profile: userData }
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      throw new Error(`Authentication error: ${error.message}`)
    }

    if (!data.user) {
      throw new Error('No user returned from sign in')
    }

    // Fetch the user's complete profile from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError) {
      console.error('Error fetching user profile:', userError)
      throw new Error(`Failed to fetch user profile: ${userError.message}`)
    }

    if (!userData) {
      console.error('No user profile found')
      throw new Error('User profile not found')
    }

    console.log('User signed in successfully:', { id: userData.id, email: userData.email, role: userData.account_type })

    return {
      user: data.user,
      profile: userData as User
    }
  } catch (error) {
    console.error('Sign in process error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw new Error(`Sign out failed: ${error.message}`)
    }
    console.log('User signed out successfully')
  } catch (error) {
    console.error('Sign out process error:', error)
    throw error
  }
}

export async function getUser(): Promise<User | null> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      if (userError.message === 'Auth session missing!') {
        console.log('No active session found')
        return null
      }
      console.error('Error fetching auth user:', userError)
      return null
    }

    if (!user) {
      console.log('No authenticated user found')
      return null
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    if (!data) {
      console.error('No user profile found for authenticated user')
      return null
    }

    console.log('User profile fetched successfully:', { id: data.id, email: data.email, role: data.account_type })

    return data as User
  } catch (error) {
    console.error('Get user process error:', error)
    return null
  }
}

