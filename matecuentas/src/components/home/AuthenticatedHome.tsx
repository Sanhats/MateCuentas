'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AuthenticatedHome() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-handwriting text-yerba mb-4">¡Bienvenido a MateCuentas, {user?.email}!</h1>
      <p className="text-madera mb-6">¿Qué querés hacer hoy?</p>
      <div className="space-y-4">
        <Link href="/groups" className="block w-full text-center bg-yerba hover:bg-yerba/90 text-white font-bold py-2 px-4 rounded">
          Ver mis grupos
        </Link>
        <Link href="/groups/new" className="block w-full text-center bg-madera hover:bg-madera/90 text-white font-bold py-2 px-4 rounded">
          Crear nuevo grupo
        </Link>
      </div>
    </div>
  )
}

