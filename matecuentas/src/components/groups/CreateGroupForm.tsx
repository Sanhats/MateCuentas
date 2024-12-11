'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createGroup } from '@/lib/api'

export default function CreateGroupForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await createGroup(name, description)
      router.push('/groups')
    } catch (err: any) {
      console.error('Error al crear el grupo:', err)
      setError(err.message || 'Hubo un problema al crear el grupo. Intentá de nuevo, che.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-madera">
          Nombre del grupo
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-yerba rounded-md text-sm shadow-sm placeholder-madera/50
                     focus:outline-none focus:border-yerba focus:ring-1 focus:ring-yerba"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-madera">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-yerba rounded-md text-sm shadow-sm placeholder-madera/50
                     focus:outline-none focus:border-yerba focus:ring-1 focus:ring-yerba"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yerba hover:bg-yerba/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yerba disabled:opacity-50"
      >
        {isLoading ? 'Creando...' : 'Crear grupo'}
      </button>
    </form>
  )
}

