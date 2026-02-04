const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supabase.novalys.io'

// Récupérer le token depuis localStorage (client-side)
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('shiftmate_token')
}

// Récupérer l'utilisateur depuis localStorage
export function getUser() {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('shiftmate_user')
  return userStr ? JSON.parse(userStr) : null
}

// Se déconnecter
export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('shiftmate_token')
  localStorage.removeItem('shiftmate_user')
}

// Headers pour les requêtes API
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// Fetch wrapper avec gestion d'erreur
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: getHeaders()
  })
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  
  return res.json()
}

// ============ ORGANISATIONS ============

export async function getOrganisation(orgId: string) {
  const data = await apiFetch<any[]>(`/shiftmate_organisations?id=eq.${orgId}`)
  return data[0] || null
}

export async function getOrganisationByOwner(ownerId: string) {
  const data = await apiFetch<any[]>(`/shiftmate_organisations?owner_id=eq.${ownerId}`)
  return data[0] || null
}

// ============ EMPLOYEES ============

export async function getEmployees(orgId: string) {
  return apiFetch<any[]>(`/shiftmate_employees?organisation_id=eq.${orgId}&order=name`)
}

export async function createEmployee(employee: {
  organisation_id: string
  name: string
  email?: string
  phone?: string
  role?: string
  hourly_rate?: number
}) {
  const res = await fetch(`${API_URL}/shiftmate_employees`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(employee)
  })
  
  if (!res.ok) throw new Error('Failed to create employee')
  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}

export async function deleteEmployee(id: string) {
  const res = await fetch(`${API_URL}/shiftmate_employees?id=eq.${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
  
  if (!res.ok) throw new Error('Failed to delete employee')
}

// ============ SHIFTS ============

export async function getShifts(orgId: string, startDate: string, endDate: string) {
  return apiFetch<any[]>(
    `/shiftmate_shifts?organisation_id=eq.${orgId}&date=gte.${startDate}&date=lte.${endDate}&order=date,start_time`
  )
}

export async function createShift(shift: {
  organisation_id: string
  employee_id: string
  date: string
  start_time: string
  end_time: string
  notes?: string
}) {
  const res = await fetch(`${API_URL}/shiftmate_shifts`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(shift)
  })
  
  if (!res.ok) throw new Error('Failed to create shift')
  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}

export async function updateShift(id: string, updates: Partial<{
  employee_id: string
  date: string
  start_time: string
  end_time: string
  notes: string
  status: string
}>) {
  const res = await fetch(`${API_URL}/shiftmate_shifts?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(),
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(updates)
  })
  
  if (!res.ok) throw new Error('Failed to update shift')
  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}

export async function deleteShift(id: string) {
  const res = await fetch(`${API_URL}/shiftmate_shifts?id=eq.${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
  
  if (!res.ok) throw new Error('Failed to delete shift')
}

// ============ LEAVE REQUESTS ============

export async function getLeaveRequests(orgId: string) {
  return apiFetch<any[]>(
    `/shiftmate_leave_requests?employee_id=in.(select id from shiftmate_employees where organisation_id=eq.${orgId})&order=created_at.desc`
  )
}
