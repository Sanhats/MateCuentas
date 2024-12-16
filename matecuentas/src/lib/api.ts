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
    // Consulta simplificada que obtiene grupos y roles en una sola consulta
    const { data: groups, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner (
          role
        )
      `)
      .eq('group_members.user_id', user.id)

    if (error) {
      logger.error('Error al obtener grupos:', error)
      throw error
    }

    return groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      created_by: group.created_by,
      created_at: group.created_at,
      role: group.group_members[0].role
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
    // Consulta simplificada que obtiene miembros con sus emails
    const { data: members, error } = await supabase
      .from('group_members')
      .select(`
        id,
        role,
        created_at,
        users:user_id (
          email
        )
      `)
      .eq('group_id', groupId)

    if (error) {
      logger.error('Error al obtener miembros:', error)
      throw error
    }

    return members.map(member => ({
      id: member.id,
      user_id: member.user_id,
      role: member.role,
      email: member.users?.email,
      created_at: member.created_at
    }))

  } catch (error) {
    logger.error('Error al obtener miembros:', error)
    throw new Error('Error al obtener los miembros del grupo')
  }
}

export async function createGroup(name: string, description: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No hay usuario autenticado')
  }

  try {
    // Iniciar una transacción
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
      throw memberError
    }

    return group
  } catch (error) {
    logger.error('Error al crear grupo:', error)
    throw new Error('Error al crear el grupo')
  }
}

