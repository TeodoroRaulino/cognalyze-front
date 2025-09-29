"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Scenario {
  id: string
  title: string
  description: string
  conditionId: string
  questionnaireId: string
}

interface Condition {
  id: string
  name: string
}

export default function ScenariosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conditionId = searchParams.get("conditionId")

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [condition, setCondition] = useState<Condition | null>(null)
  const [selectedProfile, setSelectedProfile] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (conditionId) {
      fetchCondition()
      fetchScenarios()
    }
  }, [conditionId])

  const fetchCondition = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Condition/${conditionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (response.ok) {
        const data = await response.json()
        setCondition(data)
      }
    } catch (error) {
      console.error("Erro ao carregar condição:", error)
    }
  }

  const fetchScenarios = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Scenarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (response.ok) {
        const data = await response.json()
        const filteredScenarios = data.filter((scenario: Scenario) => scenario.conditionId === conditionId)
        setScenarios(filteredScenarios)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cenários",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartEvaluation = async (scenarioId: string, questionnaireId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Evaluations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioId,
          questionnaireId,
        }),
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (response.status === 201) {
        const evaluation = await response.json()
        router.push(`/evaluations/${evaluation.id}`)
      } else {
        throw new Error("Erro ao iniciar avaliação")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a avaliação",
        variant: "destructive",
      })
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Voltar
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Scenarios */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Cenário</h2>
            <p className="text-sm text-gray-600 mb-4">Área do cenário</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2">{scenario.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{scenario.description}</p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs bg-transparent"
                        onClick={() => router.push(`/scenarios/${scenario.id}`)}
                      >
                        Ver resultado →
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs bg-transparent"
                        onClick={() => handleStartEvaluation(scenario.id, scenario.questionnaireId)}
                      >
                        Reavaliar →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  <Plus className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600">Novo cenário</span>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Perfil de acessibilidade</label>
                <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {condition && <SelectItem value={condition.id}>{condition.name}</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Iniciar avaliação</Button>
            </div>
          </div>

          {/* Right Column - Questionnaire */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Questionário de avaliação</h2>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Perfil</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Critério 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Explicação</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Critério 2</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Explicação</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">### Resumo Executivo</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Pontos Positivos: [...]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Principais Problemas: [...]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Recomendações Gerais: [...]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Prioridades de Correção: [...]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
