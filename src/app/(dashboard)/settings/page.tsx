'use client'

import { useEffect, useState } from 'react'
import { Settings, Building2, User, Bell } from 'lucide-react'
import { getUser } from '@/lib/api'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400">Configurez votre compte et votre organisation</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profil */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Profil</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <p className="text-white">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nom</label>
              <p className="text-white">{user?.name || '-'}</p>
            </div>
          </div>
        </div>

        {/* Organisation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Organisation</h2>
          </div>
          <p className="text-gray-400">
            Les paramètres d'organisation seront disponibles prochainement.
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <p className="text-gray-400">
            Les paramètres de notifications seront disponibles prochainement.
          </p>
        </div>
      </div>
    </div>
  )
}
