import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function TesteConexaoServer() {
  let status = 'Testando conexão...'
  
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from('teste').select('*')
    
    if (error) {
      status = `Erro na conexão: ${error.message}`
    } else {
      status = 'Conexão com Supabase estabelecida com sucesso!'
    }
  } catch (error) {
    if (error instanceof Error) {
      status = `Erro: ${error.message}`
    } else {
      status = `Erro desconhecido: ${String(error)}`
    }
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão Supabase (Server-Side)</h1>
      <p>{status}</p>
    </div>
  )
} 