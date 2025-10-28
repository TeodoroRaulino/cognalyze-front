"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getScenarioByIdWithResults, updateScenarioImages } from "@/services/api/scenario"
import type { ScenarioWithResultsDTO } from "@/types/api"
import { ArrowLeft, FileText, ImageIcon, RefreshCw, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ScenarioDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [scenario, setScenario] = useState<ScenarioWithResultsDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const data = await getScenarioByIdWithResults(params.id)
        setScenario(data)
      } catch (error) {
        console.error("Error fetching scenario:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScenario()
  }, [params.id])

  const handleReplaceImage = async (imageId: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setLoading(true)

        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64String = reader.result as string
          const base64Data = base64String.split(",")[1]

          await updateScenarioImages(imageId, base64Data)

          const updatedData = await getScenarioByIdWithResults(params.id)
          setScenario(updatedData)
          setLoading(false)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Error replacing image:", error)
        setLoading(false)
      }
    }

    input.click()
  }

  const handleAddNewImage = () => {
    console.log("[v0] Add new image to scenario")
    // TODO: Implementar lógica de adicionar nova imagem
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Carregando...</div>
      </div>
    )
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Cenário não encontrado</div>
      </div>
    )
  }

  const questionnaires = scenario.questionnaires || []

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Cenário */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações do Cenário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Título</h3>
                <p className="text-lg font-semibold text-gray-900">{scenario.title}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
                <p className="text-gray-700">{scenario.description}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <ImageIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{scenario.images.length}</span> tela
                  {scenario.images.length !== 1 ? "s" : ""} cadastrada{scenario.images.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="pt-4">
                <Button onClick={handleAddNewImage} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Novas Telas
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questionários Atrelados</CardTitle>
            </CardHeader>
            <CardContent>
              {questionnaires.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {questionnaires.map((questionnaire) => (
                      <div key={questionnaire.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {/* <div className="flex items-start justify-between mb-2">
                          <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                          {questionnaire.default && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Padrão</span>
                          )}
                        </div> */}
                        <MarkdownRenderer
                          content={questionnaire.content || "Sem descrição disponível"}
                          variant="default"
                          className="text-gray-700"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-gray-500">Nenhum questionário atrelado</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Telas do Cenário</h2>

          {scenario.images.map((image, index) => (
            <Card key={image.id}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Imagem */}
                  <div className="space-y-3">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {image.imageKey ? (
                        <img
                          src={`data:image/png;base64,${image.imageKey}`}
                          alt={image.displayName || `Tela ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleReplaceImage(image.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Substituir Tela
                    </Button>
                  </div>

                  {/* Avaliações */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">{image.displayName || `Tela ${index + 1}`}</h3>

                    {image.evaluations.length > 0 ? (
                      <div className="space-y-4">
                        {image.evaluations.map((evaluation) => (
                          <div key={evaluation.evaluationId} className="space-y-2">
                            <ScrollArea className="h-[400px] pr-4">
                              {evaluation.message && (
                                <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200">
                                  <MarkdownRenderer
                                    content={evaluation.message || "Sem descrição disponível"}
                                    variant="default"
                                    className="text-gray-700"
                                  />
                                </div>
                              )}
                            </ScrollArea>

                            {evaluation.failureReason && (
                              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                {evaluation.failureReason}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhuma avaliação disponível</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card
            className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
            onClick={handleAddNewImage}
          >
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adicionar Nova Tela</h3>
                  <p className="text-sm text-gray-500">Clique para fazer upload de uma nova tela para este cenário</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
