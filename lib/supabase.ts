import { createClient } from '@supabase/supabase-js'

// Forneça valores padrão para evitar erros durante a compilação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Verifique se as variáveis estão definidas antes de criar o cliente
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL ou chave não definidas corretamente nas variáveis de ambiente')
}

export const supabase = createClient(supabaseUrl, supabaseKey) 