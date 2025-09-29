import { Condition, ConditionCreate, ConditionDetails } from "@/types/api";
import api from "../api";

export const getConditionById = async (id: string): Promise<ConditionDetails> => {
  const response = await api.get(`/condition/${id}`);
  return response.data;
}

export const getConditions = async (): Promise<Condition[]> => {
  const response = await api.get("/condition");
  return response.data;
};

export const createCondition = async (data: ConditionCreate) => {
  const response = await api.post("/condition", data);
  return response.data;
};
