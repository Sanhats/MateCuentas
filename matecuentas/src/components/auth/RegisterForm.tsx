'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres, che.')
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/dashboard')
      } else {
        setError('Revisá tu correo para confirmar tu cuenta, che.')
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrarse. Probá de nuevo, che.')
      console.error('Error de registro:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-madera">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-yerba rounded-md text-sm shadow-sm placeholder-madera/50
                     focus:outline-none focus:border-yerba focus:ring-1 focus:ring-yerba"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-madera">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full px-3 py-2 bg-white border border-yerba rounded-md text-sm shadow-sm placeholder-madera/50
                     focus:outline-none focus:border-yerba focus:ring-1 focus:ring-yerba"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yerba hover:bg-yerba/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yerba"
      >
        Registrarse
      </button>
    </form>
  )
}

