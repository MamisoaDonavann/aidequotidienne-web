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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error || !data.user) {
      setErrorMsg(error?.message || 'Erreur inconnue')
      toast.error('Inscription échouée')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role,
    })

    if (profileError) {
      setErrorMsg(profileError.message)
      toast.error('Erreur lors de la création du profil')
    } else {
      toast.success('Compte créé avec succès !')
      router.push('/auth/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
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
            label="Mot de passe"
            type="password"
            placeholder="Au moins 6 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Je suis un</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${
                  role === 'client' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${
                  role === 'provider' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Prestataire
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
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