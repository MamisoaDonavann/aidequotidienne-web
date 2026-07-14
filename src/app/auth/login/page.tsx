// src/app/auth/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshProfile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Gestion des messages de redirection (confirmation d'email)
  const confirmed = searchParams.get('confirmed')
  const errorParam = searchParams.get('error')

  useEffect(() => {
    if (confirmed) {
      toast.success('Email confirmé avec succès, vous pouvez vous connecter.')
    }
    if (errorParam) {
      toast.error('Erreur lors de la confirmation.')
    }
  }, [confirmed, errorParam])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Votre email n’a pas encore été confirmé. Vérifiez votre boîte de réception.')
        toast.error('Email non confirmé')
      } else if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Email ou mot de passe incorrect.')
        toast.error('Identifiants invalides')
      } else {
        setErrorMsg(error.message)
        toast.error('Erreur de connexion')
      }
    } else {
      await refreshProfile()
      toast.success('Connexion réussie')
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-fade-in border border-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-center text-primary-800 mb-6">Connexion</h1>

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMsg && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{errorMsg}</p>
          )}
          <Button type="submit" className="w-full" isLoading={loading}>
            Se connecter
          </Button>
        </form>

        {/* Renvoyer l'email de confirmation */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Vous n'avez pas reçu l'email de confirmation ?{' '}
            <button
              onClick={async () => {
                if (!email) {
                  toast.error('Veuillez entrer votre email ci-dessus.')
                  return
                }
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email,
                })
                if (error) toast.error(error.message)
                else toast.success('Email de confirmation renvoyé !')
              }}
              className="text-primary-600 hover:underline font-medium"
            >
              Renvoyer
            </button>
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">ou</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link href="/auth/signup" className="text-primary-600 hover:underline font-medium">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}