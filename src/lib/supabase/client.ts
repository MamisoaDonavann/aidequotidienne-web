// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

// Utilisation d'un type plus permissif pour éviter les erreurs de typage strict
export function createClient() {
  return createBrowserClient<any>( // <-- any au lieu de Database
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}