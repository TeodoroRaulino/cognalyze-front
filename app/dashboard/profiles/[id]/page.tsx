"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { getConditionById } from "@/services/api/condition"
import { updateQuestionnaire } from "@/services/api/questionnaire"
import type { ConditionDetails } from "@/types/api"
import { BarChart3, FileText, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfileDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [condition, setCondition] = useState<ConditionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<{
    id: string
    content: string
  } | null>(null)
  const [editPrompt, setEditPrompt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchConditionDetails()
  }, [id])

  const fetchConditionDetails = async () => {
    try {
      const data = await getConditionById(id as string)
      setCondition(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditQuestionnaire = (questionnaireId: string, content: string) => {
    setEditingQuestionnaire({ id: questionnaireId, content })
    setEditPrompt("")
    setIsEditModalOpen(true)
  }

  const handleSubmitEdit = async () => {
    if (!editingQuestionnaire || !editPrompt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um prompt para atualização",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await updateQuestionnaire(editingQuestionnaire.id, { prompt: editPrompt })

      toast({
        title: "Sucesso",
        description: "Questionário atualizado com sucesso",
      })

      await fetchConditionDetails()
      setIsEditModalOpen(false)
      setEditingQuestionnaire(null)
      setEditPrompt("")
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error?.response?.data?.message || "Não foi possível atualizar o questionário. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateScenario = () => {
    router.push(`/dashboard/scenarios/create?conditionId=${id}`)
  }

  const handleViewScenario = (scenarioId: string) => {
    router.push(`/dashboard/scenarios/${scenarioId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  if (!condition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Perfil não encontrado</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{condition.name}</CardTitle>
                <Button onClick={() => router.push(`/dashboard/profiles/${id}/edit`)}>Editar Perfil</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Informações do Perfil</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{condition.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm mb-2">Diretrizes de Acessibilidade</h3>
                <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  <MarkdownRenderer
                    content={condition.guidelines || "Sem descrição disponível"}
                    variant="default"
                    className="text-gray-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push(`/dashboard/questionnaires?conditionId=${id}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerenciar Questionários
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleCreateScenario}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Cenário
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push(`/dashboard/evaluations?conditionId=${id}`)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Todas Avaliações
              </Button>
            </CardContent>
          </Card>

          {/* Questionnaires */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Questionários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {condition.questionnaires.map((questionnaire) => (
                <div key={questionnaire.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Questionário</span>
                    {questionnaire.default && (
                      <Badge variant="default" className="text-xs">
                        Padrão
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    <MarkdownRenderer
                      content={questionnaire.content || "Sem descrição disponível"}
                      variant="default"
                      className="text-gray-700"
                    />
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleEditQuestionnaire(questionnaire.id, questionnaire.content)}
                  >
                    Editar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Questionário</DialogTitle>
            <DialogDescription>
              Insira um prompt para atualizar o questionário. O sistema irá processar sua solicitação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="current-content" className="text-sm font-medium">
                Conteúdo Atual
              </label>
              <div className="p-3 bg-muted rounded-md text-sm max-h-32 overflow-y-auto">
                <MarkdownRenderer content={editingQuestionnaire?.content || ""} variant="default" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-prompt" className="text-sm font-medium">
                Prompt de Atualização
              </label>
              <Textarea
                id="edit-prompt"
                placeholder="Ex: Adicione perguntas sobre navegação por teclado..."
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitEdit} disabled={isSubmitting || !editPrompt.trim()}>
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
