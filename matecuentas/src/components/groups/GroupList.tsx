'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGroups } from '@/lib/api'
import { FaSpinner } from 'react-icons/fa'
import { logger } from '@/lib/logger'

interface Group {
  id: string
  name: string
  description: string
  created_by: string
  created_at: string
  role: 'admin' | 'member'
}

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedGroups = await getGroups()
      setGroups(fetchedGroups)
    } catch (err) {
      logger.error('Error al cargar grupos:', err)
      setError('Uy, hubo un problemita al cargar los grupos. ¿Probamos de nuevo?')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-yerba text-2xl" />
        <span className="ml-2 text-madera">Cargando grupos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchGroups}
          className="bg-yerba text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-handwriting text-yerba">Tus grupos de mate</h2>
      {groups.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-madera mb-4">
            Todavía no tenés grupos. ¡Creá uno para empezar a compartir gastos!
          </p>
          <Link
            href="/groups/new"
            className="inline-block bg-yerba text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Crear mi primer grupo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-madera hover:text-yerba transition-colors">
                {group.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{group.description}</p>
              <span className={`mt-2 inline-block px-2 py-1 rounded-full text-xs ${
                group.role === 'admin' ? 'bg-yerba text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {group.role === 'admin' ? 'Administrador' : 'Miembro'}
              </span>
            </Link>
          ))}
        </div>
      )}
      
      {groups.length > 0 && (
        <Link
          href="/groups/new"
          className="inline-block bg-yerba text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          Crear nuevo grupo
        </Link>
      )}
    </div>
  )
}

