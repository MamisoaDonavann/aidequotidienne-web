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
    <nav className="sticky top-3 z-50 mx-auto max-w-7xl px-4 mt-3">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-lg shadow-gray-200/50 rounded-3xl px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition">
            AQ
          </div>
          <span className="font-bold text-xl text-primary-800">
            Aide<span className="text-accent-500">Quotidienne</span>
          </span>
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/recherche" className="text-gray-600 hover:text-primary-600 transition">Rechercher</Link>
          {user ? (
            <>
              <Link href="/dashboard/client" className="text-gray-600 hover:text-primary-600">Tableau de bord</Link>
              <Link href="/messages" className="text-gray-600 hover:text-primary-600">Messages</Link>
              <div className="flex items-center gap-4 ml-2">
                <span className="text-gray-700">{profile?.full_name}</span>
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

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="mt-2 mx-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 md:hidden">
          <div className="flex flex-col gap-3 text-base font-medium">
            <Link href="/recherche" className="py-2 px-3 rounded-xl hover:bg-gray-50">Rechercher</Link>
            {user ? (
              <>
                <Link href="/dashboard/client" className="py-2 px-3 rounded-xl hover:bg-gray-50">Tableau de bord</Link>
                <Link href="/messages" className="py-2 px-3 rounded-xl hover:bg-gray-50">Messages</Link>
                <button onClick={handleLogout} className="w-full text-left py-2 px-3 rounded-xl hover:bg-gray-50">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="py-2 px-3 rounded-xl hover:bg-gray-50">Connexion</Link>
                <Link href="/auth/signup" className="py-2 px-3 rounded-xl hover:bg-gray-50">Inscription</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}