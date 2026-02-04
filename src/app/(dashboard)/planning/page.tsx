'use client'

import { useEffect, useState } from 'react'
import { Calendar, Plus, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUser, getEmployees, getShifts, createShift } from '@/lib/api'

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [employees, setEmployees] = useState<any[]>([])
  const [shifts, setShifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [orgId, setOrgId] = useState<string>('')
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    loadData()
  }, [currentDate])

  async function loadData() {
    const user = getUser()
    if (!user?.organisationId) return

    setOrgId(user.organisationId)
    
    try {
      const [emps, shiftData] = await Promise.all([
        getEmployees(user.organisationId),
        getShifts(
          user.organisationId,
          format(weekDays[0], 'yyyy-MM-dd'),
          format(weekDays[6], 'yyyy-MM-dd')
        )
      ])
      setEmployees(emps)
      setShifts(shiftData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getShiftForEmployeeAndDay = (employeeId: string, date: Date) => {
    return shifts.find(
      s => s.employee_id === employeeId && s.date === format(date, 'yyyy-MM-dd')
    )
  }

  const openAddModal = (employeeId?: string, date?: Date) => {
    setSelectedEmployee(employeeId || (employees[0]?.id || ''))
    setSelectedDate(date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))
    setStartTime('09:00')
    setEndTime('17:00')
    setNotes('')
    setShowModal(true)
  }

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee || !selectedDate || !orgId) return

    setSaving(true)
    try {
      const newShift = await createShift({
        organisation_id: orgId,
        employee_id: selectedEmployee,
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        notes: notes || undefined
      })
      setShifts([...shifts, newShift])
      setShowModal(false)
    } catch (error) {
      console.error('Error creating shift:', error)
      alert('Erreur lors de la création du créneau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Planning</h1>
          <p className="text-gray-400">Gérez les horaires de votre équipe</p>
        </div>
        <button 
          onClick={() => openAddModal()}
          disabled={employees.length === 0}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un créneau
        </button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          Semaine du {format(weekStart, "d MMMM yyyy", { locale: fr })}
        </h2>
        <button
          onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Planning grid */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        {/* Days header */}
        <div className="grid grid-cols-8 border-b border-slate-800">
          <div className="p-4 bg-slate-800/50">
            <span className="text-sm font-medium text-gray-400">Employé</span>
          </div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="p-4 text-center bg-slate-800/50">
              <div className="text-xs text-gray-500 uppercase">
                {format(day, 'EEE', { locale: fr })}
              </div>
              <div className="text-lg font-semibold text-white">
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            Chargement...
          </div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Aucun employé</p>
            <p className="text-sm">Ajoutez des employés pour créer le planning</p>
          </div>
        ) : (
          employees.map((employee) => (
            <div key={employee.id} className="grid grid-cols-8 border-b border-slate-800 last:border-0">
              <div className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 text-sm font-medium">
                    {employee.name.charAt(0)}
                  </span>
                </div>
                <span className="text-white font-medium truncate">{employee.name}</span>
              </div>
              {weekDays.map((day) => {
                const shift = getShiftForEmployeeAndDay(employee.id, day)
                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => !shift && openAddModal(employee.id, day)}
                    className="p-2 border-l border-slate-800 min-h-[80px] hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    {shift ? (
                      <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-2 text-xs">
                        <div className="text-purple-400 font-medium">
                          {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                        </div>
                        {shift.notes && (
                          <div className="text-gray-500 mt-1 truncate">{shift.notes}</div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Modal Ajouter Créneau */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Ajouter un créneau</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddShift} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Employé *
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Début *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fin *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Service du midi, caisse..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
