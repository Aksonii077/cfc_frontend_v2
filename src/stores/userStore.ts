import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// User data from the API
export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  is_onboarded: string;
  created_at: string;
  updated_at: string;
  // Derived properties for backward compatibility
  first_name?: string;
  last_name?: string;
  id?: string; // alias for user_id
}

// Complete check-user API response
export interface CheckUserResponse {
  exists: boolean;
  message: string;
  user?: User;
  error?: string;
}

// Zustand store state
interface UserState {
  // User data
  user: User | null;
  
  // Complete API response for components that need additional data
  checkUserResponse: CheckUserResponse | null;
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setCheckUserResponse: (response: CheckUserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
  
  // Authentication methods
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  
  // Helper methods
  isAuthenticated: () => boolean;
  getUserRole: () => string | null;
  getFormattedName: () => { firstName: string; lastName: string };
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        checkUserResponse: null,
        isLoading: true,
        
        // Actions
        setUser: (user) => {
          const enhancedUser = user ? {
            ...user,
            id: user.user_id,
            first_name: user.full_name?.split(' ')[0] || '',
            last_name: user.full_name?.split(' ').slice(1).join(' ') || ''
          } : null;
          set({ user: enhancedUser }, false, 'setUser');
        },
        
        setCheckUserResponse: (response) => {
          const enhancedUser = response?.user ? {
            ...response.user,
            id: response.user.user_id,
            first_name: response.user.full_name?.split(' ')[0] || '',
            last_name: response.user.full_name?.split(' ').slice(1).join(' ') || ''
          } : null;
          
          set({ 
            checkUserResponse: response,
            user: enhancedUser 
          }, false, 'setCheckUserResponse');
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading');
        },
        
        clearUser: () => {
          set({ 
            user: null, 
            checkUserResponse: null, 
            isLoading: false 
          }, false, 'clearUser');
          
          // Clear only token from localStorage
          localStorage.removeItem('token');
        },
        
        // Authentication methods
        signUp: async (email: string, password: string, firstName: string, lastName: string) => {
          console.log('signUp called (not implemented for backend auth)');
          return { success: false, error: 'Please use Google sign-in' };
        },
        
        signIn: async (email: string, password: string) => {
          console.log('signIn called (not implemented for backend auth)');
          return { success: false, error: 'Please use Google sign-in' };
        },
        
        signInWithGoogle: async () => {
          console.log('signInWithGoogle called (redirect handled in LoginPage)');
          return { success: true };
        },
        
        signInWithApple: async () => {
          console.log('signInWithApple called (not implemented)');
          return { success: false, error: 'Apple sign-in not yet implemented' };
        },
        
        signOut: async () => {
          try {
            console.log('Signing out user...');
            
            // Get current user from store before clearing
            const currentUser = get().user;

            // Invalidate server session cookie
            try {
              await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google/logout`, {
                method: 'POST',
                credentials: 'include',
              });
            } catch (logoutErr) {
              console.warn('Server logout failed or unavailable', logoutErr);
            }
            
            // Clear all localStorage items related to user session
            if (currentUser?.user_id) {
              localStorage.removeItem(`onboarding_complete_${currentUser.user_id}`);
              localStorage.removeItem(`user_role_${currentUser.user_id}`);
              localStorage.removeItem(`selected_dashboard_section_${currentUser.user_id}`);
              localStorage.removeItem(`onboarding_data_${currentUser.user_id}`);
            }
            
            // Clear user state from store (this also clears localStorage auth data)
            get().clearUser();
            
            // Redirect to main website URL or dashboard
            const mainWebsiteUrl = import.meta.env.VITE_MAIN_WEBSITE_URL;
            if (mainWebsiteUrl) {
              window.location.href = `${mainWebsiteUrl}?signout=true`;
            } else {
              // If no main website URL, redirect to dashboard
              window.location.href = '/dashboard/race-ai';
            }
          } catch (error) {
            console.error('Error during sign out:', error);
            // Even if there's an error, clear state and redirect
            get().clearUser();
            const mainWebsiteUrl = import.meta.env.VITE_MAIN_WEBSITE_URL;
            if (mainWebsiteUrl) {
              window.location.href = `${mainWebsiteUrl}?signout=true`;
            } else {
              // If no main website URL, redirect to dashboard
              window.location.href = '/dashboard/race-ai';
            }
          }
        },
        
        // Helper methods
        isAuthenticated: () => {
          const state = get();
          return !!state.user && !!state.checkUserResponse?.exists;
        },
        
        getUserRole: () => {
          const state = get();
          return state.user?.role || null;
        },
        
        getFormattedName: () => {
          const state = get();
          const fullName = state.user?.full_name || '';
          const nameParts = fullName.split(' ');
          return {
            firstName: nameParts[0] || 'User',
            lastName: nameParts.slice(1).join(' ') || ''
          };
        }
      }),
      {
        name: 'user-store',
        // Don't persist user data - only token is stored in localStorage
        partialize: () => ({})
      }
    ),
    {
      name: 'UserStore'
    }
  )
);

// Convenience hooks for common use cases
export const useUser = () => useUserStore((state) => state.user);
export const useCheckUserResponse = () => useUserStore((state) => state.checkUserResponse);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated());
export const useUserRole = () => useUserStore((state) => state.getUserRole());
export const useUserLoading = () => useUserStore((state) => state.isLoading);

// Authentication method hooks
export const useSignOut = () => useUserStore((state) => state.signOut);
export const useSignUp = () => useUserStore((state) => state.signUp);
export const useSignIn = () => useUserStore((state) => state.signIn);
export const useSignInWithGoogle = () => useUserStore((state) => state.signInWithGoogle);
export const useSignInWithApple = () => useUserStore((state) => state.signInWithApple);