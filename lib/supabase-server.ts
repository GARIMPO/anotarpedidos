import { createClient } from '@supabase/supabase-js'

// Função para criar o cliente Supabase no lado do servidor
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('supabaseUrl e supabaseKey são obrigatórios')
  }
  
  return createClient(supabaseUrl, supabaseKey)
} 