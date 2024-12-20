'use client'

import { useState } from 'react'
import { inviteToGroup } from '@/lib/api'
import { FaEnvelope, FaSpinner } from 'react-icons/fa'

interface InviteMemberFormProps {
  groupId: string;
  onMemberAdded?: () => void;
}

export default function InviteMemberForm({ groupId, onMemberAdded }: InviteMemberFormProps) {
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
      await inviteToGroup(groupId, email.trim())
      setSuccess(`Se ha invitado exitosamente a ${email}`)
      setEmail('')
      onMemberAdded?.()
    } catch (err: any) {
      setError(err.message || 'Error al invitar al usuario')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo del nuevo miembro"
            required
            disabled={isLoading}
            className="flex-grow px-3 py-2 border border-yerba rounded-l-md focus:outline-none focus:ring-2 focus:ring-yerba disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-yerba text-white px-4 py-2 rounded-r-md hover:bg-yerba/90 focus:outline-none focus:ring-2 focus:ring-yerba focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Invitando...
              </>
            ) : (
              <>
                <FaEnvelope className="mr-2" />
                Invitar
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}
      </div>
    </form>
  )
}

