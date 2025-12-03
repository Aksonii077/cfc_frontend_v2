import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'
import { supabaseApi } from '../axios'

// Create a single shared Supabase client instance with email confirmation disabled
export const supabase = createSupabaseClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Disable email confirmation for development/demo purposes
      flowType: 'implicit'
    }
  }
)

// Export a function that returns the configured Supabase client
// This is needed for components that import createClient
export const createClient = () => supabase

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
}

export class AuthService {
  static async signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      // Use direct Supabase signup with email confirmation bypass
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`
          },
          // Don't require email confirmation
          emailRedirectTo: undefined
        }
      })

      if (error) {
        console.error('Signup error:', error)
        throw error
      }

      // If user exists but session is not created (email confirmation needed)
      if (data.user && !data.session) {
        // Try to sign in immediately (works if email confirmation is disabled in Supabase settings)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

        if (signInError) {
          throw signInError
        }

        return signInData
      }

      return data
    } catch (error) {
      console.error('Network error during signup:', error)
      throw error
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Sign in network error:', error)
      throw error
    }
  }

  static async signInWithGoogle() {
    try {
      // IMPORTANT: To enable Google OAuth, follow setup instructions at:
      // https://supabase.com/docs/guides/auth/social-login/auth-google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) {
        console.error('Google sign in error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Google sign in network error:', error)
      throw error
    }
  }

  static async signInWithApple() {
    try {
      // IMPORTANT: To enable Apple OAuth, follow setup instructions at:
      // https://supabase.com/docs/guides/auth/social-login/auth-apple
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) {
        console.error('Apple sign in error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Apple sign in network error:', error)
      throw error
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
    } catch (error) {
      console.error('Sign out network error:', error)
      throw error
    }
  }

  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Get session error:', error)
        throw error
      }
      return session
    } catch (error) {
      console.error('Get session network error:', error)
      throw error
    }
  }

  static async getUserProfile() {
    try {
      const session = await this.getCurrentSession()
      if (!session?.access_token) {
        throw new Error('No active session')
      }

      const response = await supabaseApi.callFunction('make-server-d1c33be8/auth/profile', { 
        session 
      });
      
      if (!response.success) {
        console.error('Get profile error from server:', response.error)
        throw new Error(response.error || 'Failed to get user profile')
      }

      const data = response.data;

      return data.user
    } catch (error) {
      console.error('Get profile network error:', error)
      throw error
    }
  }
}