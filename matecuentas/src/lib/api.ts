import { supabase, getCurrentUser } from './supabase'

// Tipos
type Group = {
  id: string
  name: string
  description: string
}

type GroupMember = {
  id: string
  group_id: string
  user_id: string
  role: 'admin' | 'member'
}

type Invitation = {
  id: string
  group_id: string
  invited_email: string
  status: 'pending' | 'accepted' | 'rejected'
}

// Funciones para grupos
export async function createGroup(name: string, description: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('groups')
    .insert({ name, description, created_by: user.id })
    .select()
  if (error) throw error
  return data[0] as Group
}

export async function getGroups() {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('created_by', user.id)
  if (error) throw error
  return data as Group[]
}

export async function updateGroup(id: string, name: string, description: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('groups')
    .update({ name, description })
    .eq('id', id)
    .eq('created_by', user.id)
    .select()
  if (error) throw error
  return data[0] as Group
}

export async function deleteGroup(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id)
    .eq('created_by', user.id)
  if (error) throw error
}

// Funciones para miembros de grupo
export async function addGroupMember(groupId: string, userId: string, role: 'admin' | 'member') {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('group_members')
    .insert({ group_id: groupId, user_id: userId, role })
    .select()
  if (error) throw error
  return data[0] as GroupMember
}

export async function getGroupMembers(groupId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
  if (error) throw error
  return data as GroupMember[]
}

export async function removeGroupMember(groupId: string, userId: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error('No hay usuario autenticado')

  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId)
  if (error) throw error
}

// Funciones para invitaciones
export async function createInvitation(groupId: string, invitedEmail: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('invitations')
    .insert({ group_id: groupId, invited_email: invitedEmail, invited_by: user.id, status: 'pending' })
    .select()
  if (error) throw error
  return data[0] as Invitation
}

export async function getInvitations(groupId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('group_id', groupId)
  if (error) throw error
  return data as Invitation[]
}

export async function updateInvitationStatus(id: string, status: 'accepted' | 'rejected') {
  const user = await getCurrentUser()
  if (!user) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('invitations')
    .update({ status })
    .eq('id', id)
    .eq('invited_email', user.email)
    .select()
  if (error) throw error
  return data[0] as Invitation
}

