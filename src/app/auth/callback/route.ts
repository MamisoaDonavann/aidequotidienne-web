// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Route d'appel après OAuth (Google)
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    // Rediriger vers la page d'accueil
    return NextResponse.redirect(`${requestUrl.origin}/`)
  }

  // En cas d'erreur, rediriger vers la connexion
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_failed`)
}