'use client'

import { useEffect, useState } from 'react'
import { getPendingInvitations, PendingInvitation } from '@/lib/api'
import { FaSpinner, FaClock } from 'react-icons/fa'

interface PendingInvitationsProps {
  groupId: string
}

export default function PendingInvitations({ groupId }: PendingInvitationsProps) {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInvitations() {
      try {
        const data = await getPendingInvitations(groupId)
        setInvitations(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadInvitations()
  }, [groupId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <FaSpinner className="animate-spin text-yerba mr-2" />
        <span className="text-madera">Cargando invitaciones...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-3">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  if (invitations.length === 0) {
    return null
  }

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold text-madera mb-4 flex items-center">
        <FaClock className="mr-2" />
        Invitaciones pendientes
      </h3>
      <ul className="space-y-2">
        {invitations.map((invitation) => (
          <li
            key={invitation.id}
            className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg"
          >
            <span className="text-madera">{invitation.email}</span>
            <span className="text-sm text-yellow-600">
              Pendiente - {new Date(invitation.expires_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

