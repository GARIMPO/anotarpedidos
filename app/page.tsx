"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona diretamente para o dashboard sem verificar login
    router.push("/dashboard")
  }, [router])

  // Retorna um componente vazio pois será redirecionado
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Sistema de Gerenciamento de Pedidos</h1>
      <p className="text-xl mb-8">Bem-vindo ao sistema de gerenciamento de pedidos</p>
      
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard" 
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Acessar Dashboard
        </Link>
        
        <Link 
          href="/teste-conexao" 
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Testar Conexão com Supabase
        </Link>
      </div>
    </div>
  )
}

