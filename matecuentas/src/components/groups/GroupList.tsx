'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGroups, Group } from '@/lib/api'
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa'
import { logger } from '@/lib/logger'

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
    } catch (err: any) {
      logger.error('Error al cargar grupos:', err)
      setError('No se pudieron cargar los grupos. Por favor, intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-yerba text-2xl mr-2" />
        <span className="text-madera">Cargando grupos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center text-red-600 mb-4">
          <FaExclamationTriangle className="text-xl mr-2" />
          <p>{error}</p>
        </div>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-handwriting text-yerba">Tus grupos de mate</h2>
        <Link
          href="/groups/new"
          className="bg-yerba text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          Crear nuevo grupo
        </Link>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-madera mb-6">
            Todavía no tenés grupos. ¡Creá uno para empezar a compartir gastos!
          </p>
          <Link
            href="/groups/new"
            className="inline-block bg-yerba text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Crear mi primer grupo
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-madera mb-2">
                {group.name}
              </h3>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                group.role === 'admin' 
                  ? 'bg-yerba text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {group.role === 'admin' ? 'Administrador' : 'Miembro'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

