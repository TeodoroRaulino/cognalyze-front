"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, Plus, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface EvaluationResult {
  id: string
  scenarioId: string
  questionnaireId: string
  status: string
  createdAt: string
  responses?: any[]
  scenarioTitle?: string
  conditionName?: string
}

interface ResultTable {
  id: string
  title: string
  criteria: {
    name: string
    status: "completed" | "pending" | "in-progress"
    color: string
    description?: string
  }[]
  completionRate: number
}

interface ExecutiveSummary {
  positivePoints: string[]
  mainProblems: string[]
  generalRecommendations: string[]
  correctionPriorities: string[]
}

export default function EvaluationResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(true)

  const [resultTables] = useState<ResultTable[]>([
    {
      id: "table1",
      title: "Tabela 1",
      completionRate: 75,
      criteria: [
        { name: "Critério 1", status: "completed", color: "bg-blue-500", description: "Navegação consistente" },
        { name: "Explicação", status: "completed", color: "bg-blue-500" },
        { name: "Critério 2", status: "pending", color: "bg-gray-300", description: "Contraste de cores" },
        { name: "Explicação", status: "pending", color: "bg-gray-300" },
      ],
    },
    {
      id: "table2",
      title: "Tabela 2",
      completionRate: 100,
      criteria: [
        { name: "Critério 1", status: "completed", color: "bg-blue-500", description: "Texto alternativo" },
        { name: "Explicação", status: "completed", color: "bg-blue-500" },
        { name: "Critério 2", status: "completed", color: "bg-blue-500", description: "Estrutura semântica" },
        { name: "Explicação", status: "completed", color: "bg-blue-500" },
      ],
    },
    {
      id: "table3",
      title: "Tabela 3",
      completionRate: 50,
      criteria: [
        { name: "Critério 1", status: "completed", color: "bg-blue-500", description: "Tempo de resposta" },
        { name: "Explicação", status: "completed", color: "bg-blue-500" },
        { name: "Critério 2", status: "in-progress", color: "bg-yellow-500", description: "Feedback visual" },
        { name: "Explicação", status: "pending", color: "bg-gray-300" },
      ],
    },
  ])

  const [executiveSummary] = useState<ExecutiveSummary>({
    positivePoints: ["Interface limpa e organizada", "Navegação intuitiva", "Boa estrutura de headings"],
    mainProblems: [
      "Contraste insuficiente em alguns elementos",
      "Falta de texto alternativo em imagens",
      "Elementos interativos sem feedback adequado",
    ],
    generalRecommendations: [
      "Implementar padrão de cores acessível",
      "Adicionar descrições para elementos visuais",
      "Melhorar feedback de interações",
    ],
    correctionPriorities: [
      "Corrigir contraste de cores (Prioridade Alta)",
      "Implementar textos alternativos (Prioridade Média)",
      "Adicionar indicadores de estado (Prioridade Baixa)",
    ],
  })

  useEffect(() => {
    fetchEvaluationResults()
  }, [])

  const fetchEvaluationResults = async () => {
    try {
      const response = await fetch(`/api/Evaluations/${params.id}/with-responses`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEvaluation({
          ...data,
          scenarioTitle: "Project A",
          conditionName: "TEA",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os resultados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportResults = () => {
    toast({
      title: "Exportando",
      description: "Gerando relatório em PDF...",
    })
  }

  const handleAddNewScreen = () => {
    router.push(`/dashboard/scenarios/create?evaluationId=${params.id}`)
  }

  const overallCompletion = Math.round(
    resultTables.reduce((acc, table) => acc + table.completionRate, 0) / resultTables.length,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando resultados...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Resultados - {evaluation?.scenarioTitle || "Project A"}[Scenario] - {evaluation?.conditionName || "TEA"}
            [Condition]
          </h1>
          <p className="text-gray-600">
            Análise completa da avaliação de acessibilidade realizada em {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportResults}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progresso Geral da Avaliação</span>
            <Badge
              className={
                overallCompletion >= 80
                  ? "bg-green-100 text-green-800"
                  : overallCompletion >= 50
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {overallCompletion}% Concluído
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallCompletion} className="h-3 mb-4" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-lg text-green-600">
                {resultTables.filter((t) => t.completionRate === 100).length}
              </div>
              <div className="text-gray-600">Tabelas Completas</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-yellow-600">
                {resultTables.filter((t) => t.completionRate > 0 && t.completionRate < 100).length}
              </div>
              <div className="text-gray-600">Em Progresso</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-gray-600">
                {resultTables.filter((t) => t.completionRate === 0).length}
              </div>
              <div className="text-gray-600">Pendentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resultTables.map((table) => (
          <Card key={table.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{table.title}</CardTitle>
                <Button size="sm" variant="outline">
                  Substituir Tela
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={table.completionRate} className="flex-1 h-2" />
                <span className="text-sm text-gray-600">{table.completionRate}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {table.criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${criterion.color}`}></div>
                    <span className="text-sm flex-1">{criterion.name}</span>
                    {criterion.status === "completed" && <span className="text-xs text-green-600">✓</span>}
                    {criterion.status === "in-progress" && <span className="text-xs text-yellow-600">⏳</span>}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-3 text-gray-800">### Resumo Executivo</h4>
                <div className="text-xs text-gray-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <span className="font-medium">Pontos Positivos:</span>
                      <div className="mt-1">
                        {executiveSummary.positivePoints.slice(0, 1).map((point, i) => (
                          <div key={i} className="text-xs">
                            • {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1"></div>
                    <div>
                      <span className="font-medium">Principais Problemas:</span>
                      <div className="mt-1">
                        {executiveSummary.mainProblems.slice(0, 1).map((problem, i) => (
                          <div key={i} className="text-xs">
                            • {problem}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                    <div>
                      <span className="font-medium">Recomendações:</span>
                      <div className="mt-1">
                        {executiveSummary.generalRecommendations.slice(0, 1).map((rec, i) => (
                          <div key={i} className="text-xs">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    <div>
                      <span className="font-medium">Prioridades:</span>
                      <div className="mt-1">
                        {executiveSummary.correctionPriorities.slice(0, 1).map((priority, i) => (
                          <div key={i} className="text-xs">
                            • {priority}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resultado Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Critérios avaliados:</span>
                <Badge variant="secondary">
                  {resultTables.reduce(
                    (acc, table) => acc + table.criteria.filter((c) => c.status === "completed").length,
                    0,
                  )}
                  /{resultTables.reduce((acc, table) => acc + table.criteria.length, 0)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxa de conclusão:</span>
                <Badge variant="secondary">{overallCompletion}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Status:</span>
                <Badge
                  className={
                    overallCompletion === 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {overallCompletion === 100 ? "Concluído" : "Em Progresso"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data da avaliação:</span>
                <span className="text-sm text-gray-600">{new Date().toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={handleAddNewScreen}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar nova tela para este cenário
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => router.push("/dashboard/evaluations/create")}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Iniciar nova avaliação
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/dashboard")}>
              Voltar para Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
