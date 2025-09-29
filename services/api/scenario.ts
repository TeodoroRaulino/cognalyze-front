import api from "../api";
import { Scenario, ScenarioCreate } from "@/types/api";

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
