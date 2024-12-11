'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGroups } from '@/lib/api'

export default function GroupList() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGroups() {
      try {
        const fetchedGroups = await getGroups()
        setGroups(fetchedGroups)
      } catch (err) {
        setError('Uy, hubo un problemita al cargar los grupos. ¿Probamos de nuevo?')
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) return <p>Cargando grupos...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-handwriting text-yerba">Tus grupos de mate</h2>
      {groups.length === 0 ? (
        <p>Todavía no tenés grupos. ¡Creá uno para empezar a compartir gastos!</p>
      ) : (
        <ul className="space-y-2">
          {groups.map((group) => (
            <li key={group.id} className="bg-white p-4 rounded-lg shadow">
              <Link href={`/groups/${group.id}`} className="text-lg font-semibold text-madera hover:text-yerba">
                {group.name}
              </Link>
              <p className="text-sm text-gray-600">{group.description}</p>
            </li>
          ))}
        </ul>
      )}
      <Link href="/groups/new" className="inline-block bg-yerba text-white px-4 py-2 rounded hover:bg-opacity-90">
        Crear nuevo grupo
      </Link>
    </div>
  )
}

