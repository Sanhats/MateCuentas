'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getGroupDetails, getGroupMembers, Group, GroupMember } from '@/lib/api'
import { FaUsers, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import InviteMemberForm from '@/components/groups/InviteMemberForm'
import { logger } from '@/lib/logger'

export default function GroupDetailsPage() {
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const fetchGroupDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [groupDetails, groupMembers] = await Promise.all([
        getGroupDetails(groupId),
        getGroupMembers(groupId)
      ]);

      setGroup(groupDetails)
      setMembers(groupMembers)

    } catch (err: any) {
      logger.error('Error al cargar detalles:', err)
      setError(err.message || 'Error al cargar los detalles del grupo')
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    fetchGroupDetails()
  }, [fetchGroupDetails])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-yerba text-2xl mr-2" />
        <p className="text-madera">Cargando detalles del grupo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/groups')}
            className="mt-4 flex items-center text-madera hover:text-yerba"
          >
            <FaArrowLeft className="mr-2" />
            Volver a grupos
          </button>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-madera">No se encontró el grupo</p>
          <button
            onClick={() => router.push('/groups')}
            className="mt-4 flex items-center text-madera hover:text-yerba"
          >
            <FaArrowLeft className="mr-2" />
            Volver a grupos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => router.push('/groups')}
          className="flex items-center text-madera hover:text-yerba"
        >
          <FaArrowLeft className="mr-2" />
          Volver a grupos
        </button>
      </div>

      <h1 className="text-4xl font-handwriting text-yerba mb-4">{group.name}</h1>
      <p className="text-madera mb-8">{group.description}</p>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-handwriting text-yerba mb-4 flex items-center">
          <FaUsers className="mr-2" /> Miembros del grupo
        </h2>
        {members.length > 0 ? (
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-madera">{member.email}</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-white text-xs ${
                  member.role === 'admin' ? 'bg-yerba' : 'bg-madera'
                }`}>
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-madera">No hay miembros en este grupo.</p>
        )}
        
        {group.role === 'admin' && (
          <>
            <h3 className="text-xl font-handwriting text-yerba mt-6 mb-2">Invitar nuevo miembro</h3>
            <InviteMemberForm 
              groupId={groupId} 
              onMemberAdded={fetchGroupDetails}
            />
          </>
        )}
      </div>
    </div>
  )
}

