"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Trash2, TrendingUp, TrendingDown, DollarSign, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import type { Transacao } from "@/types/financas"
import { toast } from "@/components/ui/use-toast"

interface FinancasViewProps {
  transacoes: Transacao[]
  onAdd: (transacao: Transacao) => void
  onDelete: (id: string) => void
  onEdit: (id: string, transacao: Transacao) => void
}

export default function FinancasView({
  transacoes,
  onAdd,
  onDelete,
  onEdit,
}: FinancasViewProps) {
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita")
  const [data, setData] = useState<Date>(new Date())
  const [transacaoParaExcluir, setTransacaoParaExcluir] = useState<string | null>(null)
  const [transacaoParaEditar, setTransacaoParaEditar] = useState<Transacao | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Calculamos os valores totais dentro do componente
  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((sum, t) => sum + (t.valor || 0), 0)
  
  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((sum, t) => sum + (t.valor || 0), 0)
  
  const lucro = totalReceitas - totalDespesas

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tipo || !descricao || !valor || !data) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    const novaTransacao: Transacao = {
      id: transacaoParaEditar ? transacaoParaEditar.id : crypto.randomUUID(),
      tipo,
      descricao,
      valor: parseFloat(valor),
      data: data.toISOString(),
    }

    if (transacaoParaEditar) {
      // Atualizar transação existente
      const transacoesAtualizadas = transacoes.map((t) =>
        t.id === novaTransacao.id ? novaTransacao : t
      )
      onEdit(novaTransacao.id, novaTransacao)
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso",
      })
      
      // Fechar o diálogo após edição
      setEditDialogOpen(false)
    } else {
      // Adicionar nova transação
      onAdd(novaTransacao)
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso",
      })
    }

    resetarFormulario()
  }

  const editarTransacao = (transacao: Transacao) => {
    setTransacaoParaEditar(transacao)
    setDescricao(transacao.descricao || '')
    setValor(transacao.valor ? transacao.valor.toString() : '')
    setTipo(transacao.tipo)
    try {
      // Garantir que a data seja um objeto Date válido
      const dataTransacao = transacao.data ? new Date(transacao.data) : new Date()
      // Verificar se a data é válida antes de atribuir
      if (isNaN(dataTransacao.getTime())) {
        console.error("Data inválida:", transacao.data)
        setData(new Date()) // Usar data atual como fallback
      } else {
        setData(dataTransacao)
      }
    } catch (error) {
      console.error("Erro ao converter data:", error)
      setData(new Date()) // Usar data atual como fallback
    }
  }

  const handleEditTransacao = (id: string, transacao: Transacao) => {
    setTransacaoParaEditar({ id, ...transacao })
    setTipo(transacao.tipo)
    setDescricao(transacao.descricao)
    setValor(transacao.valor.toString())
    
    try {
      const dataObj = new Date(transacao.data)
      if (!isNaN(dataObj.getTime())) {
        setData(dataObj)
      } else {
        setData(new Date())
      }
    } catch (error) {
      console.error("Erro ao converter data:", error)
      setData(new Date())
    }
    
    // Abrir o diálogo de edição
    setEditDialogOpen(true)
  }

  const cancelarEdicao = () => {
    setTransacaoParaEditar(null)
    setEditDialogOpen(false)
    resetarFormulario()
  }

  const confirmarExclusao = (id: string) => {
    setTransacaoParaExcluir(id)
  }

  const cancelarExclusao = () => {
    setTransacaoParaExcluir(null)
  }

  const executarExclusao = () => {
    if (transacaoParaExcluir) {
      onDelete(transacaoParaExcluir)
      setTransacaoParaExcluir(null)
    }
  }

  const formatarValor = (valor: number) => {
    // Adicionamos verificação para o caso de valor ser undefined ou NaN
    if (valor === undefined || isNaN(valor)) {
      return "R$ 0,00"
    }
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const receitas = transacoes.filter((t) => t.tipo === "receita")
  const despesas = transacoes.filter((t) => t.tipo === "despesa")

  const resetarFormulario = () => {
    setDescricao("")
    setValor("")
    setTipo("receita")
    setData(new Date())
    setTransacaoParaEditar(null)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestão Financeira</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatarValor(totalReceitas)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatarValor(totalDespesas)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Lucro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatarValor(lucro)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Nova Transação</CardTitle>
            <CardDescription>Adicione uma nova receita ou despesa</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Transação</Label>
                <Select value={tipo} onValueChange={(value: "receita" | "despesa") => setTipo(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  placeholder="Ex: Venda de produtos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data && !isNaN(data.getTime()) 
                        ? format(data, "PPP", { locale: ptBR }) 
                        : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={data}
                      onSelect={(date) => date && setData(date)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full">
                Adicionar Transação
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="todas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="receitas">Receitas</TabsTrigger>
              <TabsTrigger value="despesas">Despesas</TabsTrigger>
            </TabsList>

            <TabsContent value="todas" className="mt-4 space-y-4">
              {transacoes.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Nenhuma transação registrada.</p>
              ) : (
                transacoes.map((transacao) => (
                  <TransacaoItem 
                    key={transacao.id} 
                    transacao={transacao} 
                    onDelete={confirmarExclusao} 
                    onEdit={handleEditTransacao} 
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="receitas" className="mt-4 space-y-4">
              {receitas.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Nenhuma receita registrada.</p>
              ) : (
                receitas.map((transacao) => (
                  <TransacaoItem 
                    key={transacao.id} 
                    transacao={transacao} 
                    onDelete={confirmarExclusao} 
                    onEdit={handleEditTransacao} 
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="despesas" className="mt-4 space-y-4">
              {despesas.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Nenhuma despesa registrada.</p>
              ) : (
                despesas.map((transacao) => (
                  <TransacaoItem 
                    key={transacao.id} 
                    transacao={transacao} 
                    onDelete={confirmarExclusao} 
                    onEdit={handleEditTransacao} 
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Diálogo de Edição */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
            <DialogDescription>
              Altere os dados da transação e clique em salvar para confirmar.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tipo">Tipo de Transação</Label>
              <Select value={tipo} onValueChange={(value: "receita" | "despesa") => setTipo(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-descricao">Descrição</Label>
              <Input
                id="edit-descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                placeholder="Ex: Venda de produtos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-valor">Valor (R$)</Label>
              <Input
                id="edit-valor"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-data">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data && !isNaN(data.getTime()) 
                      ? format(data, "PPP", { locale: ptBR }) 
                      : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={(date) => date && setData(date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cancelarEdicao}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!transacaoParaExcluir} onOpenChange={cancelarExclusao}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executarExclusao} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface TransacaoItemProps {
  transacao: Transacao
  onDelete: (id: string) => void
  onEdit: (id: string, transacao: Transacao) => void
}

function TransacaoItem({ transacao, onDelete, onEdit }: TransacaoItemProps) {
  const formatarValor = (valor: number) => {
    // Adicionamos verificação para o caso de valor ser undefined ou NaN
    if (valor === undefined || isNaN(valor)) {
      return "R$ 0,00"
    }
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const handleEdit = () => {
    onEdit(transacao.id, transacao)
  }

  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr)
      if (isNaN(data.getTime())) {
        return "Data inválida"
      }
      return format(data, "PPP", { locale: ptBR })
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return "Data inválida"
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className={`mt-1 p-2 rounded-full ${transacao.tipo === "receita" ? "bg-green-100" : "bg-red-100"}`}>
              {transacao.tipo === "receita" ? 
                <TrendingUp className="h-4 w-4 text-green-600" /> : 
                <TrendingDown className="h-4 w-4 text-red-600" />
              }
            </div>
            <div>
              <p className="font-medium">{transacao.descricao}</p>
              <p className="text-sm text-muted-foreground">
                {formatarData(transacao.data)}
              </p>
              <p className="text-xs text-muted-foreground capitalize mt-1">
                {transacao.tipo}
                {transacao.categoria && ` • ${transacao.categoria}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className={`font-medium ${transacao.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
              {transacao.tipo === "receita" ? "+" : "-"}
              {formatarValor(transacao.valor)}
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleEdit}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(transacao.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

