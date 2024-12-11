'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        if (data.user.email_confirmed_at) {
          router.push('/dashboard')
        } else {
          setError('Che, parece que no confirmaste tu correo. Revisá tu bandeja de entrada y hacé clic en el enlace de confirmación.')
        }
      }
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error)
      if (error.message === 'Invalid login credentials') {
        setError('Uy, las credenciales no son correctas. ¿Estás seguro de que el correo y la contraseña están bien?')
      } else {
        setError('Hubo un problema al iniciar sesión. Intentá de nuevo, che.')
      }
    } finally {
      setIsLoading(false)
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
          className="mt-1 block w-full px-3 py-2 bg-white border border-yerba rounded-md text-sm shadow-sm placeholder-madera/50
                     focus:outline-none focus:border-yerba focus:ring-1 focus:ring-yerba"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yerba hover:bg-yerba/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yerba disabled:opacity-50"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}

