"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Scenario {
  id: string
  title: string
  description: string
  conditionId: string
  questionnaireId: string
}

interface Evaluation {
  id: string
  scenarioId: string
  status: string
  createdAt: string
}

export default function ScenarioDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScenario()
    fetchEvaluations()
  }, [])

  const fetchScenario = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Scenarios/${params.id}`, {
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
        setScenario(data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o cenário",
        variant: "destructive",
      })
    }
  }

  const fetchEvaluations = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Evaluations/by-scenario/${params.id}`, {
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
        setEvaluations(data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartEvaluation = async () => {
    if (!scenario) return

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
          scenarioId: scenario.id,
          questionnaireId: scenario.questionnaireId,
        }),
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (response.status === 201) {
        const evaluation = await response.json()
        router.push(`/evaluations/${evaluation.id}`)
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <Skeleton className="h-8 w-20" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-6">
          <Skeleton className="h-64 w-full" />
        </div>
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
            <h1 className="text-lg font-semibold">{scenario?.title || "Cenário"}</h1>
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Cenário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scenario && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Título</Label>
                      <p className="mt-1">{scenario.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                      <p className="mt-1 text-gray-700">{scenario.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">ID do Cenário</Label>
                      <p className="mt-1 font-mono text-sm break-all">{scenario.id}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Histórico de Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                {evaluations.length > 0 ? (
                  <div className="space-y-3">
                    {evaluations.map((evaluation) => (
                      <div key={evaluation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Avaliação {evaluation.id.substring(0, 8)}...</p>
                          <p className="text-xs text-gray-600">
                            {new Date(evaluation.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{evaluation.status}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/evaluations/${evaluation.id}/results`)}
                          >
                            Ver Resultados
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhuma avaliação encontrada</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleStartEvaluation}>
                  Iniciar Nova Avaliação
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/scenarios/${params.id}/edit`)}
                >
                  Editar Cenário
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/scenarios")}>
                  Voltar aos Cenários
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
