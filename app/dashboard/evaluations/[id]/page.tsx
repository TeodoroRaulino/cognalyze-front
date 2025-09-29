"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { FileText, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Evaluation {
  id: string
  scenarioId: string
  questionnaireId: string
  createdAt?: string
  status?: string
  isCompleted?: boolean
}

interface Question {
  id: string
  text: string
  type: string
  category: string
}

export default function EvaluationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [questions] = useState<Question[]>([
    {
      id: "1",
      text: "Com base nos critérios definidos para suprir alguma alteração",
      type: "text",
      category: "Critério 1",
    },
    {
      id: "2",
      text: "Eu quero remover ou segundo critério",
      type: "text",
      category: "Critério 2",
    },
  ])
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    fetchEvaluation()
  }, [])

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/Evaluations/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEvaluation(data)

        if (data.isCompleted) {
          router.push(`/dashboard/evaluations/${params.id}/results`)
          return
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a avaliação",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmitResponse = async (questionId: string) => {
    const response = responses[questionId]
    if (!response?.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a resposta",
        variant: "destructive",
      })
      return
    }

    try {
      const apiResponse = await fetch(`/api/Evaluations/${params.id}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: response,
          imageKey: null,
        }),
      })

      if (apiResponse.ok) {
        toast({
          title: "Sucesso",
          description: "Resposta enviada com sucesso!",
        })

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta",
        variant: "destructive",
      })
    }
  }

  const handleCompleteEvaluation = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/Evaluations/${params.id}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Avaliação finalizada com sucesso!",
        })
        router.push(`/dashboard/evaluations/${params.id}/results`)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível finalizar a avaliação",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      toast({
        title: "Upload",
        description: `${files.length} arquivo(s) selecionado(s)`,
      })
    }
  }

  const completedQuestions = Object.keys(responses).filter((id) => responses[id]?.trim()).length
  const progress = (completedQuestions / questions.length) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Avaliação</h1>
        <p className="text-gray-600">
          Por favor, adicione suas respostas na avaliação e clique em enviar para prosseguir
        </p>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da Avaliação</span>
            <span>
              {completedQuestions} de {questions.length} questões
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Questions */}
        <div className="lg:col-span-2 space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className={`${index === currentQuestionIndex ? "ring-2 ring-blue-500" : ""}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{question.category}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{question.text}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`response-${question.id}`} className="text-sm font-medium">
                    Sua resposta:
                  </Label>
                  <Textarea
                    id={`response-${question.id}`}
                    value={responses[question.id] || ""}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    rows={4}
                    className="w-full mt-2"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {responses[question.id]?.trim() ? (
                      <span className="text-green-600 font-medium">✓ Respondida</span>
                    ) : (
                      <span>Aguardando resposta</span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleSubmitResponse(question.id)}
                    size="sm"
                    disabled={!responses[question.id]?.trim()}
                  >
                    Enviar Resposta
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column - Upload and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Arquivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Arraste e solte arquivos aqui ou clique para selecionar</p>
                <p className="text-xs text-gray-500 mb-4">
                  Formatos aceitos: <strong>ZIP, TXT</strong>
                </p>
                <input
                  type="file"
                  multiple
                  accept=".zip,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                  Selecionar Arquivos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Finalizar Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Status atual:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${completedQuestions > 0 ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span>
                      Respostas: {completedQuestions}/{questions.length}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span>Arquivos: 0 enviados</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleCompleteEvaluation}
                disabled={submitting || completedQuestions === 0}
                className="w-full"
              >
                {submitting ? "Finalizando..." : "Avaliar"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Certifique-se de responder todas as questões antes de finalizar
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
