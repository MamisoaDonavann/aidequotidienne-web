// src/app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'provider'>('client')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    // 1. Créer l'utilisateur dans Auth (avec redirection email de confirmation)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // Redirige vers notre route de callback après clic sur le lien de l'email
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error || !data.user) {
      setErrorMsg(error?.message || 'Erreur inconnue')
      toast.error('Inscription échouée')
      setLoading(false)
      return
    }

    // 2. Créer le profil (le trigger handle_new_user le fera aussi, mais on force le rôle)
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role,
    })

    if (profileError) {
      console.error('Erreur création profil:', profileError)
      // On continue même si le profil existe déjà (trigger)
    }

    setSuccess(true)
    toast.success('Un email de confirmation vous a été envoyé.')
    setLoading(false)
  }

  // Écran de succès après inscription
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vérifiez votre email</h2>
          <p className="text-gray-500 mb-6">
            Un lien de confirmation a été envoyé à <strong>{email}</strong>.<br />
            Cliquez dessus pour activer votre compte.
          </p>
          <Button onClick={() => router.push('/auth/login')} variant="primary" className="w-full">
            Aller à la connexion
          </Button>
        </div>
      </div>
    )
  }

  // Formulaire d'inscription
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-fade-in border border-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-center text-primary-800 mb-6">Inscription</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Nom complet"
            type="text"
            placeholder="Jean Rakoto"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="exemple@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Mot de passe (6+ caractères)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Je suis un</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                  role === 'client'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                  role === 'provider'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Prestataire
              </button>
            </div>
          </div>
          {errorMsg && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{errorMsg}</p>
          )}
          <Button type="submit" className="w-full" isLoading={loading}>
            Créer mon compte
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-primary-600 hover:underline font-medium">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}