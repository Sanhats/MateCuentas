'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [message, setMessage] = useState<string>('Verificando conexión con Supabase...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) throw error

        setMessage('¡Conexión con Supabase establecida correctamente, che!')
      } catch (error: any) {
        console.error('Error al conectar con Supabase:', error)
        setMessage('Uy, parece que hubo un problemita al conectar con Supabase.')
        setError(error.message || 'Error desconocido')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold text-yerba mb-2">Estado de Supabase</h2>
      <p className="text-madera">{message}</p>
      {error && (
        <p className="text-red-500 mt-2">
          Detalles del error: {error}
        </p>
      )}
    </div>
  )
}

