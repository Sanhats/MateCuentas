'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Confirmando tu correo electrónico...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (token && type === 'signup') {
        const { error } = await supabase.auth.verifyOtp({ token, type })
        if (error) {
          setMessage('Uy, hubo un problema al confirmar tu correo. Intentá de nuevo o contactá soporte.')
        } else {
          setMessage('¡Correo confirmado con éxito! Redirigiendo al inicio de sesión...')
          setTimeout(() => router.push('/auth/login'), 3000)
        }
      } else {
        setMessage('Enlace de confirmación inválido.')
      }
    }

    confirmEmail()
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-beige">
      <h1 className="text-3xl font-handwriting text-yerba mb-4">Confirmación de Correo</h1>
      <p className="text-madera">{message}</p>
    </div>
  )
}

