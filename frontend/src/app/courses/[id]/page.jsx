'use client'

import { useUser } from '@/contexts/UserContext'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ChevronLeft, FileText, Video } from 'lucide-react'
import { AddModuleModal } from '@/components/courses/AddModuleModal'
import { EditModuleModal } from '@/components/courses/EditModuleModal'
import { DeleteModuleButton } from '@/components/courses/DeleteModuleButton'
import { UploadFileModal } from '@/components/courses/UploadFileModal'
import Link from 'next/link'

export default function CoursePage() {
  const { userData } = useUser()
  const params = useParams()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourse = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch course')
      }

      const data = await response.json()
      setCourse(data.course)
      setError(null)
    } catch (err) {
      console.error('Error fetching course:', err)
      setError('Failed to load course. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!course) {
    return <div>Course not found</div>
  }

  console.log('Current Course State:', course)
  console.log('Current Modules:', course.Modules)

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{course.name}</h1>
              <p className="text-muted-foreground">
                {userData?.role === 'student' ? 'Instructor: ' + course.instructor : 'Your Course'}
              </p>
            </div>
          </div>
          {userData?.role === 'instructor' && (
            <AddModuleModal courseId={params.id} onModuleAdded={fetchCourse} />
          )}
        </div>

        <div className="grid gap-6">
          {Array.isArray(course.Modules) && course.Modules.length > 0 ? (
            course.Modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{module.name}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    {userData?.role === 'instructor' && (
                      <div className="flex items-center space-x-2">
                        <UploadFileModal 
                          moduleId={module.id} 
                          onFileUploaded={fetchCourse} 
                        />
                        <EditModuleModal 
                          module={module} 
                          courseId={params.id} 
                          onModuleUpdated={fetchCourse} 
                        />
                        <DeleteModuleButton 
                          module={module} 
                          courseId={params.id} 
                          onModuleDeleted={fetchCourse} 
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {module.files?.map((file) => (
                      <div key={file.id} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                    {module.videos?.map((video) => (
                      <div key={video.id} className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>{video.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No modules available for this course.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 