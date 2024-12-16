import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Che, faltan las credenciales de Supabase en las variables de entorno!')
  throw new Error('Faltan las credenciales de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

