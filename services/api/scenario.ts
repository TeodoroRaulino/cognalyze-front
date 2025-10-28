import { Scenario, ScenarioCreate, ScenarioWithResultsDTO } from "@/types/api";
import api from "../api";

export const createScenario = async (
  data: ScenarioCreate
): Promise<Scenario> => {
  const response = await api.post<Scenario>("/scenarios", data);
  return response.data;
};

export const getScenarios = async (): Promise<Scenario[]> => {
  const response = await api.get<Scenario[]>("/scenarios");
  return response.data;
};

export const getScenarioById = async (id: string): Promise<Scenario> => {
  const response = await api.get<Scenario>(`/scenarios/${id}`);
  return response.data;
}

export const getScenarioByIdWithResults = async (id: string): Promise<ScenarioWithResultsDTO> => {
  const response = await api.get<ScenarioWithResultsDTO>(`/scenarios/${id}/with-results`);
  return response.data;
}

export const updateScenarioImages = async (
  id: string,
  image: string
): Promise<void> => {
  const data: { imageKey: string, displayName?: string } = { imageKey: image };
  await api.put(`/ScenarioImages/${id}`, data);
}
