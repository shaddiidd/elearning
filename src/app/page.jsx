'use client'

import { useUser } from '@/contexts/UserContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { CreateCourseModal } from '@/components/courses/CreateCourseModal'
import { EditCourseModal } from '@/components/courses/EditCourseModal'
import { DeleteCourseModal } from '@/components/courses/DeleteCourseModal'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function HomePage() {
  const { userData, loading: userLoading } = useUser()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourses = async () => {
    if (!userData) return;
    
    try {
      setIsLoading(true)
      const endpoint = process.env.NEXT_PUBLIC_API_URL + (userData.role === 'student' 
        ? '/courses/student/enrolled'
        : '/courses/instructor')
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      setCourses(data.courses || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load courses. Please try again later.')
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [userData])

  if (userLoading || isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!userData) {
    return <div>Please log in to view your courses.</div>
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData.fName}!
          </p>
        </div>

        {userData.role === 'student' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">My Courses</h2>
            {!courses.length ? (
              <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses && courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.name}</CardTitle>
                      <CardDescription>Instructor: {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button className="w-full">View Course</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Courses</h2>
              <CreateCourseModal onCourseCreated={fetchCourses} />
            </div>
            {!courses.length ? (
              <p className="text-muted-foreground">You haven't created any courses yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex space-x-2">
                      <Link href={`/courses/${course.id}`} className="flex-1">
                        <Button className="w-full">View</Button>
                      </Link>
                      <EditCourseModal course={course} onCourseUpdated={fetchCourses} />
                      <DeleteCourseModal course={course} onCourseDeleted={(courseId) => {
                        setCourses(prevCourses => prevCourses.filter(c => c.id !== courseId))
                      }} />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
} 