"use client"
import { ImageUploader } from "@/components/image-uploader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getConditions } from "@/services/api/condition"
import { createScenario } from "@/services/api/scenario"
import type { Condition } from "@/types/api"
import { ChevronLeft, ChevronRight, Images, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ImageFile {
  name: string
  url: string
  size: number
  base64: string
}

export default function CreateScenarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [conditions, setConditions] = useState<Condition[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    conditionId: "",
    questionnaireId: "",
  })

  const totalSteps = 2
  const progress = (currentStep / totalSteps) * 100

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

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.title.trim() || !formData.conditionId) {
        toast({
          title: "Erro",
          description: "Preencha o título e selecione uma persona",
          variant: "destructive",
        })
        return
      }

      const selectedCondition = conditions.find((c) => c.id === formData.conditionId)
      if (selectedCondition?.defaultQuestionaireId) {
        setFormData((prev) => ({
          ...prev,
          questionnaireId: selectedCondition.defaultQuestionaireId!,
        }))
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma imagem",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const scenarioData = {
        title: formData.title,
        description: formData.description,
        conditionId: formData.conditionId,
        questionnaireId: formData.questionnaireId,
        s3Keys: selectedImages.map((img) => img.base64),
      }

      const scenario = await createScenario(scenarioData)

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

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Settings className="h-5 w-5" />
      case 2:
        return <Images className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Configuração"
      case 2:
        return "Imagens"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Adicionar um Perfil de Acessibilidade</h1>
        <p className="text-gray-600">Crie um novo cenário de teste para avaliação de acessibilidade</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Etapa {currentStep} de {totalSteps}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="w-full" />

            <div className="flex justify-between">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`flex items-center space-x-2 ${step <= currentStep ? "text-primary" : "text-gray-400"}`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step <= currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {step < currentStep ? <ChevronRight className="h-4 w-4" /> : getStepIcon(step)}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{getStepTitle(step)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getStepIcon(currentStep)}
            <span>{getStepTitle(currentStep)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Configuration - Combined basic info and profile */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Nome do Cenário *</Label>
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
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o cenário de teste..."
                />
              </div>

              <div>
                <Label htmlFor="condition">Persona *</Label>
                <Select
                  value={formData.conditionId}
                  onValueChange={(value) => {
                    const selectedCondition = conditions.find((c) => c.id === value)
                    setFormData((prev) => ({
                      ...prev,
                      conditionId: value,
                      questionnaireId: selectedCondition?.defaultQuestionaireId || "",
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma persona" />
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

              {formData.conditionId && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  {(() => {
                    const selectedCondition = conditions.find((c) => c.id === formData.conditionId)
                    return selectedCondition ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-blue-900">{selectedCondition.name}</p>
                        <p className="text-sm text-blue-700">{selectedCondition.description}</p>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Image Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label>Seleção de Imagens *</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Selecione as imagens que serão utilizadas neste cenário de teste.
                </p>
              </div>

              <ImageUploader onImagesChange={setSelectedImages} />

              {selectedImages.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    {selectedImages.length} imagem{selectedImages.length !== 1 ? "ns" : ""} selecionada
                    {selectedImages.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={handleNext} className="flex items-center space-x-2">
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading} className="flex items-center space-x-2">
            <span>{loading ? "Criando..." : "Finalizar Cenário"}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
