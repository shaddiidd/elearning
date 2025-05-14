'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const UserContext = createContext({})

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Accept': 'application/json'
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch user data')
          }

          const data = await response.json()
          setUserData(data.user)
        } catch (error) {
          console.error('Error fetching user data:', error)
          // If we can't fetch user data, log the user out
          logout()
        }
      } else {
        setUserData(null)
      }
      setLoading(false)
    }

    fetchUserData()
  }, [user?.token, logout])

  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }))
  }

  return (
    <UserContext.Provider value={{ userData, loading, updateUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 