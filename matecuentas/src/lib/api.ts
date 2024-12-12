import { supabase } from './supabase'

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getGroups() {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('created_by', user.id)

  if (error) throw error
  return data || []
}

export async function getGroupMembers(groupId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)

  if (error) {
    console.error('Error al obtener miembros del grupo:', error)
    throw new Error('No se pudieron obtener los miembros del grupo')
  }

  return data || []
}

export async function createGroup(name: string, description: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('groups')
    .insert([{ name, description, created_by: user.id }])
    .select()

  if (error) throw error

  // Agregar al creador como miembro administrador
  await supabase
    .from('group_members')
    .insert([{ group_id: data[0].id, user_id: user.id, role: 'admin' }])

  return data[0]
}

export async function createInvitation(groupId: string, email: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  // Aquí deberías implementar la lógica para crear y enviar una invitación
  // Por ahora, simplemente simularemos que se ha enviado
  console.log(`Invitación enviada a ${email} para el grupo ${groupId}`)
  return { success: true, message: 'Invitación enviada' }
}

