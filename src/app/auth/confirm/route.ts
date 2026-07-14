// src/app/auth/confirm/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') // doit être 'signup'

  if (!token_hash || type !== 'signup') {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=missing_token`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: 'signup',
  })

  if (error) {
    console.error('Erreur confirmation email:', error.message)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=confirmation_failed`)
  }

  // Confirmation réussie → rediriger vers la page de connexion avec un message
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?confirmed=true`)
}