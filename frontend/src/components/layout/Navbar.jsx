'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/contexts/UserContext'

export function Navbar() {
  const { user, logout } = useAuth()
  const { userData } = useUser()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            E-Learning Platform
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/courses">
                <Button variant="ghost">Courses</Button>
              </Link>
              {userData && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    {userData.fName} {userData.lName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({userData.role})
                  </span>
                </div>
              )}
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 