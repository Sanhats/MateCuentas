'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getGroups } from '@/lib/api'

export default function GroupDetailsPage() {
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const groupId = params.id as string

  useEffect(() => {
    async function fetchGroup() {
      try {
        const groups = await getGroups()
        const foundGroup = groups.find(g => g.id === groupId)
        if (foundGroup) {
          setGroup(foundGroup)
        } else {
          setError('Che, no encontramos ese grupo. ¿Estás seguro que existe?')
        }
      } catch (err) {
        setError('Uy, hubo un problemita al cargar el grupo. ¿Probamos de nuevo?')
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [groupId])

  if (loading) return <p>Cargando detalles del grupo...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!group) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-handwriting text-yerba mb-4">{group.name}</h1>
      <p className="text-madera mb-8">{group.description}</p>
      {/* Aquí irán los componentes para manejar miembros e invitaciones */}
    </div>
  )
}

