"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MarkdownEditor } from "@/components/ui/markdown-renderer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getConditions } from "@/services/api/condition"
import { Condition } from "@/types/api"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

export default function CreateScenarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [conditions, setConditions] = useState<Condition[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    conditionId: "",
    questionnaireId: "",
  })

  useEffect(() => {
    fetchConditions()
  }, [])

  const fetchConditions = async () => {
    try {
      const data = await getConditions()
      setConditions(data)
    } catch (error) {
      console.error("[v0] Error fetching conditions:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as condições",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.conditionId) {
      toast({
        title: "Erro",
        description: "Título e condição são obrigatórios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Creating scenario with data:", formData)

      let questionnaireId = formData.questionnaireId
      if (!questionnaireId) {
        console.log("[v0] Creating questionnaire for condition:", formData.conditionId)
        const questionnaire = await createQuestionnaireForCondition(formData.conditionId)
        questionnaireId = questionnaire.id
        console.log("[v0] Created questionnaire:", questionnaire.id)
      }

      const scenarioData = {
        title: formData.title,
        description: formData.description,
        conditionId: formData.conditionId,
        questionnaireId: questionnaireId,
        s3Keys: [],
      }

      console.log("[v0] Creating scenario with final data:", scenarioData)
      const scenario = await createScenario(scenarioData)
      console.log("[v0] Created scenario:", scenario)

      toast({
        title: "Sucesso",
        description: "Cenário criado com sucesso!",
      })

      router.push(`/dashboard/scenarios?conditionId=${formData.conditionId}`)
    } catch (error) {
      console.error("[v0] Error creating scenario:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o cenário",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Adicionar um Perfil de Acessibilidade</h1>
        <p className="text-gray-600">Crie um novo cenário de teste para avaliação de acessibilidade</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Definição do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Nome do Cenário</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Testando projeto A"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <MarkdownEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Descreva o cenário de teste usando markdown para formatação rica..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="condition">Perfil de Acessibilidade</Label>
                <Select
                  value={formData.conditionId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, conditionId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.id}>
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando..." : "Gerar novo perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.conditionId ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nome</Label>
                    <p className="mt-1">{conditions.find((c) => c.id === formData.conditionId)?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                    <p className="mt-1 text-gray-700">
                      {conditions.find((c) => c.id === formData.conditionId)?.description ||
                        "Transtorno do Espectro Autista. Foca em interfaces previsíveis, com baixa estimulação sensorial e instruções claras."}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Selecione um perfil para ver as informações</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diretrizes de Acessibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Recomendações Gerais:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Manter interfaces consistentes e previsíveis</li>
                  <li>Evitar distrações e elementos que piscam</li>
                  <li>Fornecer tempo suficiente para leitura e interação</li>
                  <li>Usar linguagem clara e objetiva</li>
                  <li>Oferecer feedback claro para ações</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
