"use client"

import { CognalyzeLoading } from "@/components/cognalyze-loading"
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
  const [editContent, setEditContent] = useState("")
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
    setEditContent(content)
    setIsEditModalOpen(true)
  }

  const handleSubmitEdit = async () => {
    if (!editingQuestionnaire || !editContent.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o conteúdo do questionário",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await updateQuestionnaire(editingQuestionnaire.id, { content: editContent })

      toast({
        title: "Sucesso",
        description: "Questionário atualizado com sucesso",
      })

      await fetchConditionDetails()
      setIsEditModalOpen(false)
      setEditingQuestionnaire(null)
      setEditContent("")
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
    return <CognalyzeLoading size="fullscreen" message="Carregando perfil..." />
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
                {/* <Button onClick={() => router.push(`/dashboard/profiles/${id}/edit`)}>Editar Perfil</Button> */}
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
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Editar Questionário</DialogTitle>
            <DialogDescription>
              Edite o conteúdo do questionário diretamente. Você pode usar Markdown para formatação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-content" className="text-sm font-medium">
                Conteúdo do Questionário
              </label>
              <Textarea
                id="edit-content"
                placeholder="Digite o conteúdo do questionário em Markdown..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Dica: Use Markdown para formatação (ex: **negrito**, *itálico*, # títulos, - listas)
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pré-visualização</label>
              <div className="p-3 bg-muted rounded-md text-sm max-h-48 overflow-y-auto">
                <MarkdownRenderer content={editContent || "Nenhum conteúdo para pré-visualizar"} variant="default" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitEdit} disabled={isSubmitting || !editContent.trim()}>
              {isSubmitting ? (
                   <CognalyzeLoading size="fullscreen" message="Salvando..." />
              ) : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
