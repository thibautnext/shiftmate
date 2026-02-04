'use client'

import { useEffect, useState } from 'react'
import { Plus, Users, Mail, Phone, Trash2, Loader2 } from 'lucide-react'
import { getUser, getEmployees, createEmployee, deleteEmployee } from '@/lib/api'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [orgId, setOrgId] = useState<string>('')

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('employee')

  useEffect(() => {
    async function loadEmployees() {
      const user = getUser()
      if (!user?.organisationId) return

      setOrgId(user.organisationId)
      
      try {
        const data = await getEmployees(user.organisationId)
        setEmployees(data)
      } catch (error) {
        console.error('Error loading employees:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !orgId) return

    setSaving(true)
    try {
      const newEmployee = await createEmployee({
        organisation_id: orgId,
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        role
      })
      setEmployees([...employees, newEmployee])
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Error creating employee:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Supprimer cet employé ?')) return

    try {
      await deleteEmployee(id)
      setEmployees(employees.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPhone('')
    setRole('employee')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Employés</h1>
          <p className="text-gray-400">Gérez les membres de votre équipe</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un employé
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          Chargement...
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Aucun employé</h3>
          <p className="text-gray-400 mb-6">Commencez par ajouter les membres de votre équipe</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Ajouter un employé
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-lg font-semibold">
                      {employee.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{employee.name}</h3>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      {employee.role === 'manager' ? 'Manager' : 'Employé'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                {employee.email && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{employee.email}</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Ajouter un employé</h2>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="jean@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rôle
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="employee">Employé</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm() }}
                  className="flex-1 px-4 py-2 border border-slate-700 text-gray-300 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Ajout...
                    </>
                  ) : (
                    'Ajouter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
