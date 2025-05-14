'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserSession = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user session')
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      console.error('Error fetching user session:', error)
      return null
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const userData = await fetchUserSession(token)
        if (userData) {
          setUser({ ...userData, token })
        } else {
          // If session fetch fails, clear the token
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      const userData = await fetchUserSession(data.token)
      setUser({ ...userData, token: data.token })
      router.push('/')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      localStorage.setItem('token', data.token)
      const newUserData = await fetchUserSession(data.token)
      setUser({ ...newUserData, token: data.token })
      router.push('/')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 