'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/api'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
    >
      <LogOut className="h-5 w-5" />
      <span>Déconnexion</span>
    </button>
  )
}
