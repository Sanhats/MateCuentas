'use client'

import { useState } from 'react'
import { createInvitation } from '@/lib/api'
import { FaEnvelope } from 'react-icons/fa'

export default function InviteMemberForm({ groupId }: { groupId: string }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await createInvitation(groupId, email)
      setSuccess(`Invitación enviada a ${email}`)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Hubo un problema al enviar la invitación. Intentá de nuevo, che.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo del nuevo miembro"
          required
          className="flex-grow px-3 py-2 border border-yerba rounded-l-md focus:outline-none focus:ring-2 focus:ring-yerba"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-yerba text-white px-4 py-2 rounded-r-md hover:bg-yerba/90 focus:outline-none focus:ring-2 focus:ring-yerba focus:ring-offset-2 disabled:opacity-50"
        >
          <FaEnvelope className="inline-block mr-2" />
          {isLoading ? 'Enviando...' : 'Invitar'}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      {success && <p className="mt-2 text-green-500 text-sm">{success}</p>}
    </form>
  )
}

