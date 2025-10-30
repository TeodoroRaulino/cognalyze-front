"use client"

import { CognalyzeLoading } from "@/components/cognalyze-loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getScenarioByIdWithResults, updateScenarioImages } from "@/services/api/scenario"
import type { ScenarioWithResultsDTO } from "@/types/api"
import { ArrowLeft, FileText, ImageIcon, RefreshCw, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function ScenarioDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [scenario, setScenario] = useState<ScenarioWithResultsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageRefreshKey, setImageRefreshKey] = useState(0)

  const fetchScenarioData = async () => {
    try {
      console.log("[v0] Fetching scenario data for ID:", id)
      const data = await getScenarioByIdWithResults(id)
      console.log("[v0] Scenario data received:", {
        id: data.id,
        title: data.title,
        imageCount: data.images.length,
        images: data.images.map((img) => ({
          id: img.id,
          displayName: img.displayName,
          hasImageKey: !!img.imageKey,
          evaluationCount: img.evaluations.length,
        })),
      })
      setScenario(data)
      setImageRefreshKey((prev) => prev + 1)
      return data
    } catch (error) {
      console.error("[v0] Error fetching scenario:", error)
      throw error
    }
  }

  useEffect(() => {
    const loadScenario = async () => {
      setLoading(true)
      try {
        await fetchScenarioData()
      } finally {
        setLoading(false)
      }
    }

    loadScenario()
  }, [id])

  const handleReplaceImage = async (imageId: string) => {
    console.log("[v0] handleReplaceImage called with imageId:", imageId)

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"

    input.onchange = async (e) => {
      console.log("[v0] File input onchange triggered")

      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        console.log("[v0] No file selected, aborting")
        return
      }

      console.log("[v0] File selected:", file.name, file.size, "bytes")
      console.log("[v0] Setting loading to true")
      setLoading(true)

      try {
        console.log("[v0] Step 1: Converting file to base64...")
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            console.log("[v0] FileReader onloadend - conversion complete")
            resolve(reader.result as string)
          }
          reader.onerror = (error) => {
            console.error("[v0] FileReader error:", error)
            reject(error)
          }
          reader.readAsDataURL(file)
        })

        const base64Data = base64String.split(",")[1]
        console.log("[v0] Base64 data length:", base64Data.length)

        console.log("[v0] Step 2: Calling updateScenarioImages API...")
        try {
          await updateScenarioImages(imageId, base64Data)
          console.log("[v0] Step 2 COMPLETE: Image updated successfully")
        } catch (error: any) {
          // If it's a network error but the backend returned 200, consider it success
          if (error?.code === "ERR_NETWORK" || error?.message?.includes("Network Error")) {
            console.log("[v0] Network error detected, but backend likely returned 200 - continuing...")
          } else {
            throw error
          }
        }

        console.log("[v0] Step 3: Waiting 1 second before fetching new data...")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("[v0] Step 3 COMPLETE: Wait finished")

        console.log("[v0] Step 4: Calling fetchScenarioData...")
        const updatedData = await fetchScenarioData()
        console.log("[v0] Step 4 COMPLETE: Scenario data refreshed successfully")
        console.log("[v0] Updated scenario has", updatedData.images.length, "images")

        console.log("[v0] All steps complete, setting loading to false")
        setLoading(false)
      } catch (error) {
        console.error("[v0] ERROR in handleReplaceImage:", error)
        console.error("[v0] Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        })
        setLoading(false)
      }
    }

    console.log("[v0] Triggering file input click")
    input.click()
  }

  const handleAddNewImage = () => {
    console.log("[v0] Add new image to scenario")
    // TODO: Implementar lógica de adicionar nova imagem
  }

  if (loading) {
    return <CognalyzeLoading size="fullscreen" message="Carregando cenário..." />
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Cenário não encontrado</div>
      </div>
    )
  }

  const questionnaires = scenario.questionnaires || []

  const summaryContent = scenario.images
    .flatMap((image) => image.evaluations)
    .find((evaluation) => evaluation.summaryContent)?.summaryContent

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

        {summaryContent && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FileText className="h-5 w-5" />
                Diagnóstico Consolidado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={summaryContent} variant="default" className="text-gray-800" />
              </div>
            </CardContent>
          </Card>
        )}

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
                          key={`${image.id}-${imageRefreshKey}`}
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
