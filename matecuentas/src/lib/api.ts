import { supabase } from './supabase-singleton'
import { logger } from './logger'

export interface Group {
  id: string
  name: string
  description: string
  created_by: string
  created_at: string
  role?: 'admin' | 'member'
}

export interface GroupMember {
  id: string
  group_id: string
  email: string
  role: 'admin' | 'member'
  created_at: string
  status?: 'active' | 'pending'
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user?.email) {
    throw new Error('No autenticado')
  }
  
  return user
}

export async function getGroups(): Promise<Group[]> {
  try {
    const user = await getCurrentUser()
    
    // Primero obtener los grupos donde el usuario es miembro
    const { data: memberGroups, error: memberError } = await supabase
      .from('group_members')
      .select(`
        group_id,
        role,
        groups (
          id,
          name,
          description,
          created_by,
          created_at
        )
      `)
      .eq('email', user.email)

    if (memberError) throw memberError

    // Luego obtener los grupos creados por el usuario
    const { data: ownedGroups, error: ownedError } = await supabase
      .from('groups')
      .select('*')
      .eq('created_by', user.email)

    if (ownedError) throw ownedError

    // Combinar y formatear resultados
    const groups: Group[] = []

    // Agregar grupos donde es miembro
    memberGroups?.forEach(membership => {
      if (membership.groups) {
        groups.push({
          ...membership.groups,
          role: membership.role
        })
      }
    })

    // Agregar grupos que creó (si no están ya incluidos)
    ownedGroups?.forEach(group => {
      if (!groups.find(g => g.id === group.id)) {
        groups.push({
          ...group,
          role: 'admin'
        })
      }
    })

    return groups.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  } catch (error) {
    logger.error('Error en getGroups:', error)
    throw new Error('Error al obtener los grupos')
  }
}

export async function getGroupDetails(groupId: string): Promise<Group> {
  try {
    const user = await getCurrentUser()

    // Obtener detalles del grupo
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupError) throw groupError
    if (!group) throw new Error('Grupo no encontrado')

    // Obtener rol del usuario
    const { data: membership, error: memberError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('email', user.email)
      .single()

    return {
      ...group,
      role: membership?.role || (group.created_by === user.email ? 'admin' : 'member')
    }

  } catch (error) {
    logger.error('Error en getGroupDetails:', error)
    throw new Error('Error al obtener los detalles del grupo')
  }
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)

    if (error) throw error
    return data || []

  } catch (error) {
    logger.error('Error en getGroupMembers:', error)
    throw new Error('Error al obtener los miembros del grupo')
  }
}

export async function createGroup(name: string, description: string): Promise<Group> {
  try {
    const user = await getCurrentUser()

    // Crear el grupo
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert([
        {
          name,
          description,
          created_by: user.email
        }
      ])
      .select()
      .single()

    if (groupError) throw groupError

    // Agregar al creador como admin
    const { error: memberError } = await supabase
      .from('group_members')
      .insert([
        {
          group_id: group.id,
          email: user.email,
          role: 'admin'
        }
      ])

    if (memberError) {
      await supabase.from('groups').delete().eq('id', group.id)
      throw memberError
    }

    return { ...group, role: 'admin' }

  } catch (error) {
    logger.error('Error en createGroup:', error)
    throw new Error('Error al crear el grupo')
  }
}

