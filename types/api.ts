export interface Condition {
  id: string;
  name: string;
  description: string;
  guidelines: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConditionDetails {
  id: string
  name: string
  description: string
  guidelines: string
  totalScenarios: number
  questionnaires: Questionnaire[]
  scenarios: Scenario[]
}

export interface ConditionCreate {
  name: string;
  description: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  conditionId: string;
  questionnaireId: string;
  s3Keys: string[];
  createdAt?: string;
  updatedAt?: string;
  condition?: Condition;
}

export interface ScenarioToDashboard {
  id: string;
  title: string;
  description: string;
  conditionId: string;
  conditionName: string;
}

export interface ScenarioCreate {
  title: string;
  description: string;
  conditionId: string;
  questionnaireId: string;
  s3Keys: string[];
}

export interface Questionnaire {
  id: string;
  conditionId: string;
  content: string;
  criteria: QuestionnaireItem[];
  default?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionnaireItem {
  id: string;
  text: string;
  type: string;
  category?: string;
  required?: boolean;
  order?: number;
}

export interface Evaluation {
  id: string;
  scenarioId: string;
  questionnaireId: string;
  status: "pending" | "in-progress" | "completed";
  isCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
  responses?: EvaluationResponse[];
  scenario?: Scenario;
  questionnaire?: Questionnaire;
}

export interface EvaluationResponse {
  id: string;
  evaluationId: string;
  questionId: string;
  content: string;
  imageKey?: string;
  createdAt: string;
}

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  evaluationId?: string;
  createdAt: string;
}

// Request/Response types
export interface CreateScenarioRequest {
  title: string;
  description: string;
  conditionId: string;
  questionnaireId: string;
  s3Keys: string[];
}

export interface CreateEvaluationRequest {
  scenarioId: string;
  questionnaireId: string;
}

export interface SubmitResponseRequest {
  content: string;
  imageKey?: string | null;
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
