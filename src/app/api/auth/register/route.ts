import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, orgName } = await request.json()
    
    if (!email || !password || !orgName) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom d\'organisation requis' },
        { status: 400 }
      )
    }
    
    const result = await signUp(email, password, name || '', orgName)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
    
    // Créer la réponse avec le cookie de session
    const response = NextResponse.json({
      user: result.user,
      token: result.token
    })
    
    // Set cookie httpOnly pour la sécurité
    response.cookies.set('shiftmate_token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
