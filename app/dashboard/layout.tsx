import React from "react"
import type { Metadata } from "next"

// Removemos a definição de metadata diretamente aqui
// No lugar, o arquivo metadata.ts define os metadados

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 