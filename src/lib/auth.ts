import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supabase.novalys.io'
const JWT_SECRET = process.env.JWT_SECRET || 'VkF3Np7xQ2sR9mYdL8wT4jB6hC0gZeUa'

export interface User {
  id: string
  email: string
  name?: string
  organisationId?: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// Générer un JWT pour l'utilisateur
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      sub: user.id, 
      email: user.email,
      role: 'app_user',
      organisationId: user.organisationId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Vérifier un JWT
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.sub,
      email: decoded.email,
      organisationId: decoded.organisationId
    }
  } catch {
    return null
  }
}

// Créer les headers avec auth JWT
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Inscription
export async function signUp(email: string, password: string, name: string, orgName: string): Promise<AuthResult> {
  try {
    // Hash le mot de passe
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Créer l'utilisateur
    const userRes = await fetch(`${API_URL}/shiftmate_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        email,
        password_hash: passwordHash,
        name
      })
    })
    
    if (!userRes.ok) {
      const error = await userRes.text()
      if (error.includes('duplicate') || error.includes('unique')) {
        return { success: false, error: 'Cet email est déjà utilisé' }
      }
      return { success: false, error: 'Erreur lors de la création du compte' }
    }
    
    const users = await userRes.json()
    const user = Array.isArray(users) ? users[0] : users
    
    // Créer l'organisation
    const orgRes = await fetch(`${API_URL}/shiftmate_organisations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: orgName,
        owner_id: user.id
      })
    })
    
    if (!orgRes.ok) {
      return { success: false, error: 'Erreur lors de la création de l\'organisation' }
    }
    
    const orgs = await orgRes.json()
    const org = Array.isArray(orgs) ? orgs[0] : orgs
    
    const authUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      organisationId: org.id
    }
    
    const token = generateToken(authUser)
    
    return { success: true, user: authUser, token }
  } catch (error) {
    console.error('SignUp error:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// Connexion
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    // Récupérer l'utilisateur par email
    const userRes = await fetch(`${API_URL}/shiftmate_users?email=eq.${encodeURIComponent(email)}`, {
      headers: { 'Accept': 'application/json' }
    })
    
    if (!userRes.ok) {
      return { success: false, error: 'Erreur de connexion' }
    }
    
    const users = await userRes.json()
    if (!users || users.length === 0) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
    
    const user = users[0]
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
    
    // Récupérer l'organisation de l'utilisateur
    const orgRes = await fetch(`${API_URL}/shiftmate_organisations?owner_id=eq.${user.id}`, {
      headers: { 'Accept': 'application/json' }
    })
    
    let organisationId: string | undefined
    if (orgRes.ok) {
      const orgs = await orgRes.json()
      if (orgs && orgs.length > 0) {
        organisationId = orgs[0].id
      }
    }
    
    const authUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      organisationId
    }
    
    const token = generateToken(authUser)
    
    return { success: true, user: authUser, token }
  } catch (error) {
    console.error('SignIn error:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
