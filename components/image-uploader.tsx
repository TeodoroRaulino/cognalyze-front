"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JSZip from "jszip"
import { FileImage, FolderOpen, Loader2, Plus, Upload, X } from "lucide-react"
import type React from "react"
import { useCallback, useState } from "react"

interface ImageFile {
  name: string
  url: string
  size: number
  base64: string
}

interface ImageUploaderProps {
  onImagesChange: (images: ImageFile[]) => void
}

export function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const updateImages = (newImages: ImageFile[]) => {
    console.log("[v0] Updating images - current count:", images.length, "new count:", newImages.length)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const processZipFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Por favor, selecione um arquivo ZIP válido.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const zip = new JSZip()
      const zipContent = await zip.loadAsync(file)
      const imageFiles: ImageFile[] = []

      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]

      for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
        if (!zipEntry.dir && imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext))) {
          try {
            const blob = await zipEntry.async("blob")
            const url = URL.createObjectURL(blob)
            const base64 = await blobToBase64(blob)

            imageFiles.push({
              name: filename,
              url,
              size: blob.size,
              base64,
            })
          } catch (err) {
            console.error(`Erro ao processar ${filename}:`, err)
          }
        }
      }

      updateImages([...images, ...imageFiles])

      if (imageFiles.length === 0) {
        setError("Nenhuma imagem foi encontrada no arquivo ZIP.")
      }
    } catch (err) {
      setError("Erro ao processar o arquivo ZIP. Verifique se o arquivo não está corrompido.")
      console.error("Erro ao processar ZIP:", err)
    } finally {
      setLoading(false)
    }
  }

  const processIndividualImages = async (files: FileList) => {
    console.log("[v0] Processing individual images - files count:", files.length, "current images:", images.length)
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]
    const imageFiles: ImageFile[] = []

    for (const file of Array.from(files)) {
      if (imageExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
        const url = URL.createObjectURL(file)
        const base64 = await fileToBase64(file)

        imageFiles.push({
          name: file.name,
          url,
          size: file.size,
          base64,
        })
      }
    }

    if (imageFiles.length > 0) {
      console.log("[v0] Adding", imageFiles.length, "new images to existing", images.length, "images")
      updateImages([...images, ...imageFiles])
      setError(null)
    } else {
      setError("Nenhuma imagem válida foi selecionada.")
    }
  }

  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await processZipFile(file)
  }

  const handleIndividualUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    await processIndividualImages(files)
    setLoading(false)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const zipFile = Array.from(files).find((file) => file.name.toLowerCase().endsWith(".zip"))

    if (zipFile) {
      await processZipFile(zipFile)
    } else {
      setLoading(true)
      await processIndividualImages(files)
      setLoading(false)
    }
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    URL.revokeObjectURL(images[index].url)
    updateImages(newImages)
  }

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.url))
    updateImages([])
    setError(null)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64Data = result.split(",")[1]
        resolve(base64Data)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = () => {
        const result = reader.result as string
        const base64Data = result.split(",")[1]
        resolve(base64Data)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Arraste e solte seus arquivos aqui</h3>
        <p className="text-muted-foreground mb-4">
          Suporte para imagens individuais (JPG, PNG, GIF, BMP, WebP, SVG) ou arquivos ZIP
        </p>
        <p className="text-sm text-muted-foreground">ou use as opções abaixo</p>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Upload Individual
          </TabsTrigger>
          <TabsTrigger value="zip" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Upload ZIP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Upload de Imagens Individuais
              </CardTitle>
              <CardDescription>Selecione uma ou múltiplas imagens para adicionar à sua coleção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="individual-files">Imagens</Label>
                <Input
                  id="individual-files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleIndividualUpload}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zip">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Upload de Arquivo ZIP
              </CardTitle>
              <CardDescription>Selecione um arquivo ZIP contendo imagens para extrair todas de uma vez</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zip-file">Arquivo ZIP</Label>
                <Input id="zip-file" type="file" accept=".zip" onChange={handleZipUpload} disabled={loading} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Processando arquivos...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Imagens Selecionadas
            </CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {images.length} imagem{images.length !== 1 ? "ns" : ""} selecionada{images.length !== 1 ? "s" : ""}
              </p>
              <Button variant="outline" size="sm" onClick={clearImages}>
                Limpar Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(image.url, "_blank")}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm font-medium text-foreground truncate" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(image.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
