'use client'

import { Navbar } from "./Navbar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname } from 'next/navigation'

export function Layout({ children }) {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <div className="container mx-auto px-4 py-4">
        {!isAuthPage && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {paths.map((path, index) => (
                <BreadcrumbItem key={path}>
                  <BreadcrumbSeparator />
                  {index === paths.length - 1 ? (
                    <BreadcrumbPage>{path}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={`/${paths.slice(0, index + 1).join('/')}`}>
                      {path}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <main className={isAuthPage ? "" : "py-6"}>
          {children}
        </main>
      </div>
    </div>
  )
} 