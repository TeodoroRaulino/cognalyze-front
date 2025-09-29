interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

interface ApiConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
}

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

  private async makeRequest<T>(endpoint: string, config: ApiConfig = {}): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, requireAuth = true } = config

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    if (requireAuth) {
      const token = this.getAuthToken()
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = response.ok ? await response.json() : null

      return {
        data,
        status: response.status,
        error: !response.ok ? `Request failed with status ${response.status}` : undefined,
      }
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  // Condition API methods
  async getConditions() {
    return this.makeRequest("/api/Condition", { requireAuth: false })
  }

  async getCondition(id: string) {
    return this.makeRequest(`/api/Condition/${id}`, { requireAuth: false })
  }

  // Scenario API methods
  async getScenarios(conditionId?: string) {
    const endpoint = conditionId ? `/api/Scenarios?conditionId=${conditionId}` : "/api/Scenarios"
    return this.makeRequest(endpoint)
  }

  async getScenario(id: string) {
    return this.makeRequest(`/api/Scenarios/${id}`)
  }

  async createScenario(scenario: {
    title: string
    description: string
    conditionId: string
    questionnaireId: string
    s3Keys: string[]
  }) {
    return this.makeRequest("/api/Scenarios", {
      method: "POST",
      body: scenario,
    })
  }

  async updateScenario(
    id: string,
    scenario: Partial<{
      title: string
      description: string
      conditionId: string
      questionnaireId: string
      s3Keys: string[]
    }>,
  ) {
    return this.makeRequest(`/api/Scenarios/${id}`, {
      method: "PUT",
      body: scenario,
    })
  }

  async deleteScenario(id: string) {
    return this.makeRequest(`/api/Scenarios/${id}`, {
      method: "DELETE",
    })
  }

  // Questionnaire API methods
  async getQuestionnaires() {
    return this.makeRequest("/api/Questionnaires")
  }

  async getQuestionnaire(id: string) {
    return this.makeRequest(`/api/Questionnaires/${id}`)
  }

  async createQuestionnaire(conditionId: string) {
    return this.makeRequest(`/api/Questionnaires/${conditionId}`, {
      method: "POST",
    })
  }

  async setDefaultQuestionnaire(conditionId: string, questionnaireId: string) {
    return this.makeRequest(`/api/Questionnaires/${conditionId}/${questionnaireId}/set-default`, {
      method: "POST",
    })
  }

  // Evaluation API methods
  async getEvaluations() {
    return this.makeRequest("/api/Evaluations")
  }

  async getEvaluation(id: string) {
    return this.makeRequest(`/api/Evaluations/${id}`)
  }

  async getEvaluationWithResponses(id: string) {
    return this.makeRequest(`/api/Evaluations/${id}/with-responses`)
  }

  async createEvaluation(evaluation: {
    scenarioId: string
    questionnaireId: string
  }) {
    return this.makeRequest("/api/Evaluations", {
      method: "POST",
      body: evaluation,
    })
  }

  async submitEvaluationResponse(
    evaluationId: string,
    response: {
      content: string
      imageKey?: string | null
    },
  ) {
    return this.makeRequest(`/api/Evaluations/${evaluationId}/responses`, {
      method: "POST",
      body: response,
    })
  }

  async completeEvaluation(id: string) {
    return this.makeRequest(`/api/Evaluations/${id}/complete`, {
      method: "PATCH",
    })
  }

  // File upload methods
  async uploadFile(file: File, evaluationId?: string) {
    const formData = new FormData()
    formData.append("file", file)
    if (evaluationId) {
      formData.append("evaluationId", evaluationId)
    }

    const token = this.getAuthToken()
    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/Files/upload`, {
        method: "POST",
        headers,
        body: formData,
      })

      const data = response.ok ? await response.json() : null

      return {
        data,
        status: response.status,
        error: !response.ok ? `Upload failed with status ${response.status}` : undefined,
      }
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for use in components
export type { ApiResponse }
