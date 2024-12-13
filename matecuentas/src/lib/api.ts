import { supabase } from './supabase'
import { logger } from './logger'

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getGroups() {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  try {
    const { data: memberGroups, error: memberError } = await supabase
      .from('group_members')
      .select(`
        group_id,
        role,
        groups:group_id (
          id,
          name,
          description,
          created_by,
          created_at
        )
      `)
      .eq('user_id', user.id)

    if (memberError) {
      logger.error('Error al obtener grupos:', memberError)
      throw new Error('Error al obtener los grupos')
    }

    if (!memberGroups) {
      return []
    }

    return memberGroups.map(mg => ({
      ...mg.groups,
      role: mg.role
    }))

  } catch (error) {
    logger.error('Error inesperado al obtener grupos:', error)
    throw new Error('Error al cargar los grupos')
  }
}

export async function getGroupMembers(groupId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  try {
    // Primero, verificamos si el usuario es miembro del grupo
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (membershipError) {
      logger.error('Error al verificar membresía:', membershipError)
      throw new Error('Error al verificar la membresía del grupo')
    }

    if (!membership) {
      throw new Error('No eres miembro de este grupo')
    }

    // Si el usuario es miembro, obtenemos los miembros del grupo
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select(`
        id,
        user_id,
        role,
        created_at,
        users:user_id (
          email
        )
      `)
      .eq('group_id', groupId)

    if (membersError) {
      logger.error('Error al obtener miembros:', membersError)
      throw new Error('Error al obtener los miembros del grupo')
    }

    return members?.map(member => ({
      ...member,
      email: member.users?.email
    })) || []

  } catch (error) {
    logger.error('Error al obtener miembros:', error)
    throw new Error('Error al obtener los miembros del grupo')
  }
}

export async function createGroup(name: string, description: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  try {
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert([
        {
          name,
          description,
          created_by: user.id
        }
      ])
      .select()
      .single()

    if (groupError) throw groupError

    const { error: memberError } = await supabase
      .from('group_members')
      .insert([
        {
          group_id: group.id,
          user_id: user.id,
          role: 'admin'
        }
      ])

    if (memberError) {
      await supabase
        .from('groups')
        .delete()
        .eq('id', group.id)
      throw memberError
    }

    return group
  } catch (error) {
    logger.error('Error al crear grupo:', error)
    throw new Error('Error al crear el grupo')
  }
}

