"use client"

import { toast } from "@/hooks/use-toast"
import { useCallback, useState } from "react"
import type { ApiResponse } from "../api"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  showErrorToast?: boolean
  showSuccessToast?: boolean
  successMessage?: string
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const { showErrorToast = true, showSuccessToast = false, successMessage } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const response = await apiCall()

        if (response.error) {
          setState((prev) => ({ ...prev, loading: false, error: response.error! }))

          if (showErrorToast) {
            toast({
              title: "Erro",
              description: response.error,
              variant: "destructive",
            })
          }
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            data: response.data || null,
            error: null,
          }))

          if (showSuccessToast && successMessage) {
            toast({
              title: "Sucesso",
              description: successMessage,
            })
          }
        }

        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }))

        if (showErrorToast) {
          toast({
            title: "Erro",
            description: errorMessage,
            variant: "destructive",
          })
        }

        return { status: 0, error: errorMessage }
      }
    },
    [showErrorToast, showSuccessToast, successMessage],
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

export function useConditions() {
  return useApi({
    showErrorToast: true,
  })
}

export function useScenarios() {
  return useApi({
    showErrorToast: true,
  })
}

export function useEvaluations() {
  return useApi({
    showErrorToast: true,
  })
}

export function useQuestionnaires() {
  return useApi({
    showErrorToast: true,
  })
}
