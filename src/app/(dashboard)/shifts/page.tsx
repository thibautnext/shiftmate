'use client'

import { Clock } from 'lucide-react'

export default function ShiftsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Créneaux</h1>
        <p className="text-gray-400">Liste de tous les créneaux de travail</p>
      </div>

      <div className="text-center py-12">
        <Clock className="h-16 w-16 mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Gérez vos créneaux depuis le planning</h3>
        <p className="text-gray-400">Allez sur la page Planning pour créer et modifier les créneaux de votre équipe.</p>
      </div>
    </div>
  )
}
