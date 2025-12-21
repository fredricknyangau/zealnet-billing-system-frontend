import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setAuth: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

/**
 * Authentication store - SECURITY UPDATE
 * 
 * Token storage has been REMOVED from client-side for security.
 * Authentication now relies entirely on httpOnly cookies set by the backend.
 * 
 * Benefits:
 * - Immune to XSS attacks (JavaScript cannot access httpOnly cookies)
 * - Automatic cookie transmission with requests
 * - Server-side token validation
 * 
 * The backend sets the token as an httpOnly cookie on login,
 * and the browser automatically includes it in subsequent requests.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => {
        // Token is stored securely in httpOnly cookie by backend
        // We only store user data and auth state
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        // Clear local state - backend will clear httpOnly cookie
        set({ user: null, isAuthenticated: false })
      },
      updateUser: (userUpdates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data and auth state, NOT the token
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

