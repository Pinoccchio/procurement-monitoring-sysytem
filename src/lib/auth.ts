import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'end-user' | 'procurement' | 'budget' | 'director' | 'bac' | 'supply'

interface SignUpData {
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
}

export async function signUp({ email, password, role, firstName, lastName }: SignUpData) {
  try {
    console.log('Attempting to sign up:', { email, role, firstName, lastName })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
        }
      }
    })

    if (error) {
      console.error('Supabase signUp error:', error)
      throw error
    }

    if (!data.user) {
      console.error('User object is null after successful signup')
      throw new Error('Failed to create user account')
    }

    console.log('User signed up successfully:', data.user)

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          role: role,
          email: email,
        }
      ])
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // If profile creation fails, we should delete the auth user to maintain consistency
      await supabase.auth.admin.deleteUser(data.user.id)
      throw new Error(`Failed to create user profile: ${profileError.message}`)
    }

    console.log('Profile created successfully:', profile)

    return { user: data.user, profile }
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

