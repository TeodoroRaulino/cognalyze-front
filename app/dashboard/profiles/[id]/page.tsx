"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { getConditionById } from "@/services/api/condition"
import { ConditionDetails } from "@/types/api"
import { ArrowLeft, BarChart3, FileText, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function ProfileDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [condition, setCondition] = useState<ConditionDetails | null>(null)
  const [loading, setLoading] = useState(true)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-semibold">[{condition.name}]</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => router.push("/")}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
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

            {/* Scenarios Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Cenários
                  </CardTitle>
                  <Button onClick={handleCreateScenario} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo cenário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {condition.scenarios.map((scenario) => (
                    <Card
                      key={scenario.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleViewScenario(scenario.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{scenario.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              Cenário
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{scenario.description}</p>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-xs text-blue-600 hover:underline">Ver resultado →</span>
                            <span className="text-xs text-blue-600 hover:underline">Reenviar →</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add New Scenario Card */}
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
                    onClick={handleCreateScenario}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[120px]">
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Novo cenário</span>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Cenários</span>
                  <Badge variant="secondary">{condition.totalScenarios}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questionários</span>
                  <Badge variant="secondary">{condition.questionnaires.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avaliações Ativas</span>
                  <Badge variant="secondary">2</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
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
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleCreateScenario}
                >
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
                      onClick={() => router.push(`/dashboard/questionnaires/${questionnaire.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
