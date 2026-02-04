'use client'

import { useEffect, useState } from 'react'
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUser, getEmployees, getShifts } from '@/lib/api'

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [employees, setEmployees] = useState<any[]>([])
  const [shifts, setShifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    async function loadData() {
      const user = getUser()
      if (!user?.organisationId) return

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

    loadData()
  }, [currentDate])

  const getShiftForEmployeeAndDay = (employeeId: string, date: Date) => {
    return shifts.find(
      s => s.employee_id === employeeId && s.date === format(date, 'yyyy-MM-dd')
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Planning</h1>
          <p className="text-gray-400">Gérez les horaires de votre équipe</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-5 w-5" />
          Ajouter un shift
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
            Chargement...
          </div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun employé</p>
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
    </div>
  )
}
