'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getGroups, getGroupMembers } from '@/lib/api'
import { FaUsers, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import InviteMemberForm from '@/components/groups/InviteMemberForm'

interface Member {
  id: string
  user_id: string
  role: 'admin' | 'member'
  email?: string
  created_at: string
}

interface Group {
  id: string
  name: string
  description: string
  created_by: string
  created_at: string
  role?: 'admin' | 'member'
}

export default function GroupDetailsPage() {
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  useEffect(() => {
    let isMounted = true

    async function fetchGroupDetails() {
      try {
        setLoading(true)
        setError(null)

        // Obtener el grupo
        const groups = await getGroups()
        const foundGroup = groups.find(g => g.id === groupId)
        
        if (!foundGroup) {
          throw new Error('Grupo no encontrado')
        }

        if (isMounted) {
          setGroup(foundGroup)
          
          try {
            // Obtener miembros
            const groupMembers = await getGroupMembers(groupId)
            if (isMounted) {
              setMembers(groupMembers)
            }
          } catch (memberError: any) {
            console.error('Error al obtener miembros:', memberError)
            if (isMounted) {
              setError('Error al obtener los miembros del grupo')
            }
          }
        }
      } catch (err: any) {
        console.error('Error al cargar detalles:', err)
        if (isMounted) {
          setError(err.message || 'Error al cargar los detalles del grupo')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchGroupDetails()

    return () => {
      isMounted = false
    }
  }, [groupId])

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
                <span className="text-madera">{member.email || member.user_id}</span>
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
            <InviteMemberForm groupId={groupId} />
          </>
        )}
      </div>
    </div>
  )
}

