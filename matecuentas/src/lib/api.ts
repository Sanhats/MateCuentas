import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las credenciales de Supabase')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getGroups() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No hay usuario autenticado')
  }

  try {
    // Primero obtenemos los grupos donde el usuario es miembro
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('group_id, role')
      .eq('user_id', user.id)

    if (membershipError) {
      logger.error('Error al obtener membresías:', membershipError)
      throw new Error('Error al obtener los grupos')
    }

    if (!memberships || memberships.length === 0) {
      return []
    }

    // Luego obtenemos los detalles de esos grupos
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .in('id', memberships.map(m => m.group_id))

    if (groupsError) {
      logger.error('Error al obtener grupos:', groupsError)
      throw new Error('Error al obtener los detalles de los grupos')
    }

    // Combinamos la información
    return groups.map(group => ({
      ...group,
      role: memberships.find(m => m.group_id === group.id)?.role || 'member'
    }))

  } catch (error) {
    logger.error('Error al obtener grupos:', error)
    throw new Error('Error al cargar los grupos')
  }
}

export async function getGroupMembers(groupId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No hay usuario autenticado')
  }

  try {
    // Verificar si el usuario es miembro del grupo
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (membershipError) {
      logger.error('Error al verificar membresía:', membershipError)
      throw new Error('No tienes acceso a este grupo')
    }

    // Obtener los miembros del grupo
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('id, user_id, role, created_at')
      .eq('group_id', groupId)

    if (membersError) {
      logger.error('Error al obtener miembros:', membersError)
      throw new Error('Error al obtener los miembros del grupo')
    }

    // Obtener los emails de los usuarios
    const emailPromises = members.map(async (member) => {
      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', member.user_id)
        .single()

      return {
        ...member,
        email: userData?.email || 'Email no disponible'
      }
    })

    return Promise.all(emailPromises)

  } catch (error) {
    logger.error('Error al obtener miembros:', error)
    throw new Error('Error al obtener los miembros del grupo')
  }
}

export async function getGroupDetails(groupId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No hay usuario autenticado')
  }

  try {
    // Obtener detalles del grupo
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupError) {
      logger.error('Error al obtener grupo:', groupError)
      throw new Error('Error al obtener los detalles del grupo')
    }

    // Obtener el rol del usuario en el grupo
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (membershipError) {
      logger.error('Error al verificar membresía:', membershipError)
      throw new Error('No tienes acceso a este grupo')
    }

    return {
      ...group,
      role: membership.role
    }

  } catch (error) {
    logger.error('Error al obtener detalles del grupo:', error)
    throw new Error('Error al obtener los detalles del grupo')
  }
}

export async function createGroup(name: string, description: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No hay usuario autenticado')
  }

  try {
    // Crear el grupo
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

    if (groupError) {
      logger.error('Error al crear grupo:', groupError)
      throw new Error(`Error al crear el grupo: ${groupError.message}`)
    }

    if (!group) {
      throw new Error('No se pudo crear el grupo')
    }

    // Crear el miembro admin
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
      // Si falla la creación del miembro, eliminar el grupo
      await supabase
        .from('groups')
        .delete()
        .eq('id', group.id)
      
      logger.error('Error al crear miembro del grupo:', memberError)
      throw new Error(`Error al crear el miembro del grupo: ${memberError.message}`)
    }

    return group
  } catch (error: any) {
    logger.error('Error en la transacción:', error)
    throw new Error(error.message || 'Error al crear el grupo')
  }
}

