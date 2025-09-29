"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Edit2, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Criterion {
  id: string
  title: string
  description: string
  type: "positive" | "problem" | "recommendation" | "priority"
}

interface Questionnaire {
  id: string
  conditionId: string
  criteria: Criterion[]
}

export default function EditQuestionnairePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingCriterion, setEditingCriterion] = useState<string | null>(null)
  const [newCriterion, setNewCriterion] = useState({
    title: "",
    description: "",
    type: "positive" as const,
  })

  useEffect(() => {
    fetchQuestionnaire()
  }, [])

  const fetchQuestionnaire = async () => {
    try {
      const mockQuestionnaire: Questionnaire = {
        id: params.id,
        conditionId: "condition-1",
        criteria: [
          {
            id: "1",
            title: "Critério 1",
            description: "Explicação do primeiro critério de avaliação",
            type: "positive",
          },
          {
            id: "2",
            title: "Critério 2",
            description: "Explicação do segundo critério de avaliação",
            type: "positive",
          },
        ],
      }

      setQuestionnaire(mockQuestionnaire)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o questionário",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCriterion = () => {
    if (!newCriterion.title.trim()) {
      toast({
        title: "Erro",
        description: "Título do critério é obrigatório",
        variant: "destructive",
      })
      return
    }

    const criterion: Criterion = {
      id: Date.now().toString(),
      title: newCriterion.title,
      description: newCriterion.description,
      type: newCriterion.type,
    }

    setQuestionnaire((prev) =>
      prev
        ? {
            ...prev,
            criteria: [...prev.criteria, criterion],
          }
        : null,
    )

    setNewCriterion({
      title: "",
      description: "",
      type: "positive",
    })
  }

  const handleRemoveCriterion = (criterionId: string) => {
    setQuestionnaire((prev) =>
      prev
        ? {
            ...prev,
            criteria: prev.criteria.filter((c) => c.id !== criterionId),
          }
        : null,
    )
  }

  const handleUpdateCriterion = (criterionId: string, updates: Partial<Criterion>) => {
    setQuestionnaire((prev) =>
      prev
        ? {
            ...prev,
            criteria: prev.criteria.map((c) => (c.id === criterionId ? { ...c, ...updates } : c)),
          }
        : null,
    )
    setEditingCriterion(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Sucesso",
        description: "Questionário salvo com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o questionário",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getCriterionColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "problem":
        return "bg-yellow-100 text-yellow-800"
      case "recommendation":
        return "bg-red-100 text-red-800"
      case "priority":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCriterionLabel = (type: string) => {
    switch (type) {
      case "positive":
        return "Pontos Positivos"
      case "problem":
        return "Principais Problemas"
      case "recommendation":
        return "Recomendações Gerais"
      case "priority":
        return "Prioridades de Correção"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Editar Questionário</h1>
          <p className="text-gray-600">Gerencie os critérios de avaliação do questionário</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Criteria List */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5" />
                Critérios Atuais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questionnaire?.criteria.map((criterion) => (
                <div key={criterion.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingCriterion === criterion.id ? (
                        <div className="space-y-3">
                          <Input
                            value={criterion.title}
                            onChange={(e) => handleUpdateCriterion(criterion.id, { title: e.target.value })}
                            placeholder="Título do critério"
                          />
                          <Textarea
                            value={criterion.description}
                            onChange={(e) => handleUpdateCriterion(criterion.id, { description: e.target.value })}
                            placeholder="Descrição do critério"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setEditingCriterion(null)}>
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingCriterion(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h4 className="font-medium text-sm">{criterion.title}</h4>
                            <Badge className={getCriterionColor(criterion.type)}>
                              {getCriterionLabel(criterion.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{criterion.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 ml-3">
                      <Button size="sm" variant="ghost" onClick={() => setEditingCriterion(criterion.id)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveCriterion(criterion.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Add New Criterion */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Novo Critério
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="criterionTitle">Título do Critério</Label>
                <Input
                  id="criterionTitle"
                  value={newCriterion.title}
                  onChange={(e) => setNewCriterion((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Critério 3"
                />
              </div>

              <div>
                <Label htmlFor="criterionDescription">Descrição</Label>
                <Textarea
                  id="criterionDescription"
                  value={newCriterion.description}
                  onChange={(e) => setNewCriterion((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Explicação detalhada do critério..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="criterionType">Tipo do Critério</Label>
                <select
                  id="criterionType"
                  value={newCriterion.type}
                  onChange={(e) => setNewCriterion((prev) => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="positive">Pontos Positivos</option>
                  <option value="problem">Principais Problemas</option>
                  <option value="recommendation">Recomendações Gerais</option>
                  <option value="priority">Prioridades de Correção</option>
                </select>
              </div>

              <Button onClick={handleAddCriterion} className="w-full">
                Adicionar Critério
              </Button>
            </CardContent>
          </Card>

          {/* Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Executivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    Pontos Positivos: [{questionnaire?.criteria.filter((c) => c.type === "positive").length || 0}]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>
                    Principais Problemas: [{questionnaire?.criteria.filter((c) => c.type === "problem").length || 0}]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>
                    Recomendações Gerais: [
                    {questionnaire?.criteria.filter((c) => c.type === "recommendation").length || 0}]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>
                    Prioridades de Correção: [{questionnaire?.criteria.filter((c) => c.type === "priority").length || 0}
                    ]
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
