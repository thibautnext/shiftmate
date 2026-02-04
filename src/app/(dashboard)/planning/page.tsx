import { createClient } from '@/lib/supabase/server'
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function PlanningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get organisation
  const { data: org } = await supabase
    .from('shiftmate_organisations')
    .select('id, name')
    .eq('owner_id', user?.id)
    .single()

  // Get employees
  const { data: employees } = await supabase
    .from('shiftmate_employees')
    .select('*')
    .eq('organisation_id', org?.id)
    .order('name')

  // Current week
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Planning</h1>
          <p className="text-gray-400">Semaine du {format(weekStart, 'd MMMM yyyy', { locale: fr })}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
              Aujourd&apos;hui
            </button>
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus className="h-5 w-5" />
            Ajouter un shift
          </button>
        </div>
      </div>

      {/* Planning Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Days header */}
        <div className="grid grid-cols-8 border-b border-slate-800">
          <div className="p-4 bg-slate-800/50">
            <span className="text-sm font-medium text-gray-400">Employé</span>
          </div>
          {weekDays.map((day, i) => {
            const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            return (
              <div 
                key={i} 
                className={`p-4 text-center ${isToday ? 'bg-purple-500/10' : ''}`}
              >
                <p className="text-xs text-gray-500 uppercase">
                  {format(day, 'EEE', { locale: fr })}
                </p>
                <p className={`text-lg font-semibold ${isToday ? 'text-purple-400' : 'text-white'}`}>
                  {format(day, 'd')}
                </p>
              </div>
            )
          })}
        </div>

        {/* Employees rows */}
        {employees && employees.length > 0 ? (
          employees.map((employee) => (
            <div key={employee.id} className="grid grid-cols-8 border-b border-slate-800 last:border-b-0">
              <div className="p-4 flex items-center gap-3 bg-slate-800/30">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{employee.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{employee.role}</p>
                </div>
              </div>
              {weekDays.map((day, i) => {
                const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                return (
                  <div 
                    key={i} 
                    className={`p-2 min-h-[80px] border-l border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer ${isToday ? 'bg-purple-500/5' : ''}`}
                  >
                    {/* Shifts would go here */}
                  </div>
                )
              })}
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Aucun employé</h3>
            <p className="text-gray-400 mb-6">
              Commencez par ajouter des employés pour créer votre planning.
            </p>
            <a 
              href="/employees" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Ajouter un employé
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
