import { Inter } from "next/font/google"
import "./globals.css"
import { Layout } from "@/components/layout/Layout"
import { AuthProvider } from "@/contexts/AuthContext"
import { UserProvider } from "@/contexts/UserContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-Learning Platform",
  description: "A modern e-learning platform built with Next.js and Shadcn UI",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <Layout>{children}</Layout>
          </UserProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
} 