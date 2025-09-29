"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Edit2, FileText, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Questionnaire {
  id: string
  conditionId: string
  conditionName: string
  criteriaCount: number
  isDefault: boolean
  createdAt: string
}

export default function QuestionnairesPage() {
  const router = useRouter()
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  const fetchQuestionnaires = async () => {
    try {
      const mockQuestionnaires: Questionnaire[] = [
        {
          id: "q1",
          conditionId: "c1",
          conditionName: "TEA",
          criteriaCount: 4,
          isDefault: true,
          createdAt: "2024-01-15",
        },
        {
          id: "q2",
          conditionId: "c2",
          conditionName: "TEA COM HIPERSENSIBILIDADE VISUAL",
          criteriaCount: 6,
          isDefault: false,
          createdAt: "2024-01-10",
        },
        {
          id: "q3",
          conditionId: "c3",
          conditionName: "TDAH",
          criteriaCount: 5,
          isDefault: true,
          createdAt: "2024-01-08",
        },
      ]

      setQuestionnaires(mockQuestionnaires)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os questionários",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (conditionId: string, questionnaireId: string) => {
    try {
      const response = await fetch(`/api/Questionnaires/${conditionId}/${questionnaireId}/set-default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Questionário definido como padrão!",
        })
        fetchQuestionnaires()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível definir como padrão",
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Questionários</h1>
          <p className="text-gray-600">Gerencie os questionários de avaliação por condição</p>
        </div>
        <Button onClick={() => router.push("/dashboard/questionnaires/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Questionário
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionnaires.map((questionnaire) => (
          <Card key={questionnaire.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{questionnaire.conditionName}</CardTitle>
                </div>
                {questionnaire.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Padrão
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Critérios:</strong> {questionnaire.criteriaCount}
                </p>
                <p>
                  <strong>Criado em:</strong> {new Date(questionnaire.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push(`/dashboard/questionnaires/${questionnaire.id}/edit`)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                {!questionnaire.isDefault && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetDefault(questionnaire.conditionId, questionnaire.id)}
                  >
                    Definir Padrão
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
