"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CreateEvaluationRequest {
  scenarioId: string
  questionnaireId: string
}

export default function CreateEvaluationPage() {
  const [formData, setFormData] = useState<CreateEvaluationRequest>({
    scenarioId: "",
    questionnaireId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: keyof CreateEvaluationRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.scenarioId.trim()) {
      toast({
        title: "Validation Error",
        description: "Scenario ID is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.questionnaireId.trim()) {
      toast({
        title: "Validation Error",
        description: "Questionnaire ID is required",
        variant: "destructive",
      })
      return false
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(formData.scenarioId)) {
      toast({
        title: "Validation Error",
        description: "Scenario ID must be a valid UUID",
        variant: "destructive",
      })
      return false
    }

    if (!uuidRegex.test(formData.questionnaireId)) {
      toast({
        title: "Validation Error",
        description: "Questionnaire ID must be a valid UUID",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        toast({
          title: "Configuration Error",
          description: "API base URL is not configured",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${baseUrl}/api/Evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      if (response.status === 409) {
        toast({
          title: "Conflict Error",
          description: "An evaluation with these parameters already exists.",
          variant: "destructive",
        })
        return
      }

      if (response.status === 500) {
        toast({
          title: "Server Error",
          description: "An internal server error occurred. Please try again later.",
          variant: "destructive",
        })
        return
      }

      if (response.status === 201) {
        const result = await response.json()
        toast({
          title: "Success",
          description: "Evaluation created successfully!",
        })

        if (result.id) {
          router.push(`/evaluations/${result.id}`)
        } else {
          router.push("/evaluations")
        }
        return
      }

      toast({
        title: "Error",
        description: `Failed to create evaluation. Status: ${response.status}`,
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error creating evaluation:", error)
      toast({
        title: "Network Error",
        description: "Failed to connect to the server. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              ← Voltar
            </Button>
            <h1 className="text-lg font-medium">Criar Avaliação</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Home
            </Button>
            <Button variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Nova Avaliação</CardTitle>
                <CardDescription>Preencha as informações necessárias para criar uma nova avaliação</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="scenarioId" className="text-sm font-medium">
                      ID do Cenário *
                    </Label>
                    <Input
                      id="scenarioId"
                      type="text"
                      placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
                      value={formData.scenarioId}
                      onChange={(e) => handleInputChange("scenarioId", e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="questionnaireId" className="text-sm font-medium">
                      ID do Questionário *
                    </Label>
                    <Input
                      id="questionnaireId"
                      type="text"
                      placeholder="Ex: 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                      value={formData.questionnaireId}
                      onChange={(e) => handleInputChange("questionnaireId", e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Criando..." : "Criar Avaliação"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Information panel */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Sobre as Avaliações:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Vincule cenários a questionários específicos</li>
                    <li>• IDs devem estar no formato UUID válido</li>
                    <li>• Avaliações podem ser reutilizadas</li>
                    <li>• Resultados ficam disponíveis após criação</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Próximos Passos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Após criar a avaliação:</p>
                  <ol className="text-xs space-y-1 ml-4">
                    <li>1. Visualizar detalhes</li>
                    <li>2. Executar questionário</li>
                    <li>3. Analisar resultados</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
