'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Calendar, Users, Clock, Settings, LayoutDashboard } from 'lucide-react'
import { getUser, getOrganisationByOwner } from '@/lib/api'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [orgName, setOrgName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Small delay to ensure localStorage is ready after redirect
    const timer = setTimeout(() => {
      const currentUser = getUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      setUser(currentUser)
      setLoading(false)
      
      // Fetch org name
      if (currentUser.organisationId) {
        getOrganisationByOwner(currentUser.id)
          .then(org => {
            if (org) setOrgName(org.name)
          })
          .catch(() => {})
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { href: '/planning', icon: LayoutDashboard, label: 'Planning' },
    { href: '/employees', icon: Users, label: 'Employés' },
    { href: '/shifts', icon: Clock, label: 'Créneaux' },
    { href: '/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/planning" className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">ShiftMate</span>
          </Link>
          {orgName && (
            <p className="text-sm text-gray-500 mt-2 truncate">{orgName}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
