'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { getGroupDetails, acceptInvitation, rejectInvitation, Group } from '@/lib/api'
import { FaSpinner, FaCheck, FaTimes, FaUsers } from 'react-icons/fa'

export default function InvitationPage() {
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const groupId = params.groupId as string
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    async function loadGroupDetails() {
      try {
        if (!email || !token) {
          throw new Error('Invitación no válida')
        }

        const groupDetails = await getGroupDetails(groupId)
        setGroup(groupDetails)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los detalles del grupo')
      } finally {
        setLoading(false)
      }
    }

    loadGroupDetails()
  }, [groupId, email, token])

  const handleAccept = async () => {
    if (!email || !token) return
    
    try {
      setProcessing(true)
      await acceptInvitation(groupId, email, token)
      router.push(`/groups/${groupId}`)
    } catch (err: any) {
      setError(err.message || 'Error al aceptar la invitación')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!email || !token) return
    
    try {
      setProcessing(true)
      await rejectInvitation(groupId, email, token)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Error al rechazar la invitación')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-yerba text-2xl mr-2" />
        <p className="text-madera">Cargando detalles de la invitación...</p>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Invitación no válida'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-yerba text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-yerba p-6 text-white">
          <h1 className="text-3xl font-handwriting mb-2">Invitación a grupo</h1>
          <p className="opacity-90">Has sido invitado a unirte a un grupo en MateCuentas</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-handwriting text-yerba mb-2">
              {group.name}
            </h2>
            <p className="text-gray-600">{group.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-madera mb-2 flex items-center">
              <FaUsers className="mr-2" />
              Detalles del grupo
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Podrás ver y participar en los gastos del grupo</li>
              <li>• Recibirás notificaciones de actividades importantes</li>
              <li>• Podrás ver el balance de gastos con otros miembros</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleAccept}
              disabled={processing}
              className="flex-1 bg-yerba text-white px-4 py-2 rounded flex items-center justify-center hover:bg-opacity-90 disabled:opacity-50"
            >
              {processing ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaCheck className="mr-2" />
              )}
              Aceptar invitación
            </button>
            <button
              onClick={handleReject}
              disabled={processing}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center justify-center hover:bg-opacity-90 disabled:opacity-50"
            >
              {processing ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaTimes className="mr-2" />
              )}
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

