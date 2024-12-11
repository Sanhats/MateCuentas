'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getGroups, getGroupMembers } from '@/lib/api'
import { FaUsers } from 'react-icons/fa'
import InviteMemberForm from '@/components/groups/InviteMemberForm'

export default function GroupDetailsPage() {
  const [group, setGroup] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const groupId = params.id as string

  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        const groups = await getGroups()
        const foundGroup = groups.find(g => g.id === groupId)
        if (foundGroup) {
          setGroup(foundGroup)
          try {
            const groupMembers = await getGroupMembers(groupId)
            setMembers(groupMembers)
          } catch (memberError) {
            console.error('Error al obtener miembros:', memberError)
            setError('No se pudieron cargar los miembros del grupo. Intentá de nuevo más tarde.')
          }
        } else {
          setError('Che, no encontramos ese grupo. ¿Estás seguro que existe?')
        }
      } catch (err) {
        console.error('Error al cargar detalles del grupo:', err)
        setError('Uy, hubo un problemita al cargar los detalles del grupo. ¿Probamos de nuevo?')
      } finally {
        setLoading(false)
      }
    }

    fetchGroupDetails()
  }, [groupId])

  if (loading) return <p className="text-center text-madera">Cargando detalles del grupo...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!group) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-handwriting text-yerba mb-4">{group.name}</h1>
      <p className="text-madera mb-8">{group.description}</p>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-handwriting text-yerba mb-4 flex items-center">
          <FaUsers className="mr-2" /> Miembros del grupo
        </h2>
        {members.length > 0 ? (
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="flex items-center">
                <span className="text-madera">{member.user_id}</span>
                <span className="ml-2 px-2 py-1 bg-yerba text-white text-xs rounded-full">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-madera">Todavía no hay miembros en este grupo.</p>
        )}
        
        <h3 className="text-xl font-handwriting text-yerba mt-6 mb-2">Invitar nuevo miembro</h3>
        <InviteMemberForm groupId={groupId} />
      </div>

      {/* Aquí irán los componentes para manejar gastos */}
    </div>
  )
}

