import Link from 'next/link'
import { Calendar, Users, Clock, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get organisation
  const { data: org } = await supabase
    .from('shiftmate_organisations')
    .select('name')
    .eq('owner_id', user.id)
    .single()

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
          {org && (
            <p className="text-sm text-gray-500 mt-2 truncate">{org.name}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/planning" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LayoutDashboard className="h-5 w-5" />
                Planning
              </Link>
            </li>
            <li>
              <Link 
                href="/employees" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Users className="h-5 w-5" />
                Employés
              </Link>
            </li>
            <li>
              <Link 
                href="/shifts" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Clock className="h-5 w-5" />
                Shifts
              </Link>
            </li>
            <li>
              <Link 
                href="/settings" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Settings className="h-5 w-5" />
                Paramètres
              </Link>
            </li>
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
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
