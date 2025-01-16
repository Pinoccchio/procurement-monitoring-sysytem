'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export async function signUp(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries())
  
  try {
    const validatedData = signUpSchema.parse(rawFormData)

    // First, create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          account_type: 'end-user', // Always set to 'end-user'
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return { success: false, error: `Authentication error: ${authError.message || 'Unknown error'}` }
    }

    if (!authData.user) {
      console.error('No user returned from auth signup')
      return { success: false, error: 'Failed to create user account' }
    }

    // Then, insert the user data into our custom users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        account_type: 'end-user', // Always set to 'end-user'
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      // If there's an error inserting into the users table, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: `Database error: ${error.message || 'Unknown error'}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: `Validation error: ${fieldErrors || 'Unknown error'}` }
    }
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' }
  }
}

