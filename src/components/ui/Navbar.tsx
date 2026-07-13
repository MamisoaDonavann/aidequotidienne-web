// src/components/ui/Navbar.tsx
'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import Button from './Button'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">AQ</div>
            <span className="font-bold text-xl text-primary-800">Aide<span className="text-accent-500">Quotidienne</span></span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/recherche" className="text-gray-600 hover:text-primary-600 font-medium transition">Rechercher</Link>
            {user ? (
              <>
                <Link href="/dashboard/client" className="text-gray-600 hover:text-primary-600">Tableau de bord</Link>
                <Link href="/messages" className="text-gray-600 hover:text-primary-600">Messages</Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{profile?.full_name}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>Déconnexion</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
                <Link href="/auth/signup"><Button size="sm">Inscription</Button></Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link href="/recherche" className="block py-2 text-gray-600">Rechercher</Link>
            {user ? (
              <>
                <Link href="/dashboard/client" className="block py-2 text-gray-600">Tableau de bord</Link>
                <Link href="/messages" className="block py-2 text-gray-600">Messages</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-600">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 text-gray-600">Connexion</Link>
                <Link href="/auth/signup" className="block py-2 text-gray-600">Inscription</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}