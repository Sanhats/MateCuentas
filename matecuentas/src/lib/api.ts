import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las credenciales de Supabase')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  user_id: string
  role: 'admin' | 'member'
  created_at: string
  email?: string
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Usuario no autenticado')
  }
  
  return user
}

export async function getGroups(): Promise<Group[]> {
  try {
    const user = await getCurrentUser()

    // Consulta simple sin joins
    const { data: groups, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Obtener membresías en una consulta separada
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('group_id, role')
      .eq('user_id', user.id)

    if (membershipError) throw membershipError

    // Filtrar grupos y agregar roles en memoria
    const membershipMap = new Map(memberships.map(m => [m.group_id, m.role]))
    const userGroups = groups.filter(group => 
      group.created_by === user.id || membershipMap.has(group.id)
    ).map(group => ({
      ...group,
      role: membershipMap.get(group.id) || (group.created_by === user.id ? 'admin' : 'member')
    }))

    return userGroups

  } catch (error) {
    logger.error('Error en getGroups:', error)
    throw new Error('Error al obtener los grupos')
  }
}

export async function getGroupDetails(groupId: string) {
  try {
    const user = await getCurrentUser();

    // Obtener el grupo
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (groupError) throw groupError;

    // Obtener el rol del usuario en el grupo
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (membershipError && group.created_by !== user.id) {
      throw new Error('No tienes acceso a este grupo');
    }

    return {
      ...group,
      role: membership?.role || (group.created_by === user.id ? 'admin' : 'member')
    };

  } catch (error) {
    logger.error('Error en getGroupDetails:', error);
    throw new Error('Error al obtener los detalles del grupo');
  }
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  try {
    // Obtener miembros con una consulta simple
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select(`
        id,
        group_id,
        user_id,
        role,
        created_at
      `)
      .eq('group_id', groupId);

    if (membersError) throw membersError;

    // Obtener emails de usuarios en una sola consulta
    const userIds = members.map(member => member.user_id);
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .in('id', userIds);

    if (usersError) {
      logger.error('Error al obtener emails:', usersError);
      return members.map(member => ({
        ...member,
        email: 'Email no disponible'
      }));
    }

    // Crear un mapa de ids a emails
    const emailMap = new Map(users.map(user => [user.id, user.email]));

    // Combinar la información
    return members.map(member => ({
      ...member,
      email: emailMap.get(member.user_id) || 'Email no disponible'
    }));

  } catch (error) {
    logger.error('Error en getGroupMembers:', error);
    throw new Error('Error al obtener los miembros del grupo');
  }
}

export async function createGroup(name: string, description: string): Promise<Group> {
  try {
    const user = await getCurrentUser()

    // Crear grupo
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

    // Agregar creador como admin
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
      // Rollback manual
      await supabase.from('groups').delete().eq('id', group.id)
      throw memberError
    }

    return { ...group, role: 'admin' }

  } catch (error) {
    logger.error('Error en createGroup:', error)
    throw new Error('Error al crear el grupo')
  }
}

export async function inviteToGroup(groupId: string, email: string): Promise<boolean> {
  try {
    // Verificar si el usuario existe
    const { data: userToInvite, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !userToInvite) {
      throw new Error('El usuario no está registrado en el sistema');
    }

    // Verificar si ya es miembro
    const { data: existingMember, error: memberError } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userToInvite.id)
      .single();

    if (existingMember) {
      throw new Error('El usuario ya es miembro del grupo');
    }

    // Obtener información del grupo para el email
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('name, description')
      .eq('id', groupId)
      .single();

    if (groupError) {
      throw new Error('No se pudo obtener la información del grupo');
    }

    // Agregar el nuevo miembro
    const { error: insertError } = await supabase
      .from('group_members')
      .insert([
        {
          group_id: groupId,
          user_id: userToInvite.id,
          role: 'member'
        }
      ]);

    if (insertError) {
      throw insertError;
    }

    // Aquí podrías implementar el envío de email usando un servicio de email
    // Por ahora, solo registramos que se agregó el miembro exitosamente
    logger.info(`Usuario ${email} agregado al grupo ${group.name}`);

    return true;
  } catch (error) {
    logger.error('Error en inviteToGroup:', error);
    throw error;
  }
}

