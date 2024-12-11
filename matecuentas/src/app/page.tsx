'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'
import AuthenticatedHome from '@/components/home/AuthenticatedHome'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-madera">Cargando...</p>
    </div>
  }

  if (isAuthenticated) {
    return <AuthenticatedHome />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-beige">
      <h1 className="text-6xl font-handwriting text-yerba mb-8">MateCuentas</h1>
      <p className="text-xl text-madera mb-8 text-center max-w-md">
        Bienvenido a MateCuentas, donde compartir es más fácil que cebar un mate.
      </p>
      <div className="space-x-4">
        <Link href="/auth/register" className="bg-yerba hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <FaUserPlus className="mr-2" />
          Registrate
        </Link>
        <Link href="/auth/login" className="bg-madera hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <FaSignInAlt className="mr-2" />
          Iniciá sesión
        </Link>
      </div>
    </div>
  )
}

