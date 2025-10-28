import { QuestionnaireUpdate } from "@/types/api";
import api from "../api";

export const updateQuestionnaire = async (
  id: string,
  data: QuestionnaireUpdate
): Promise<void> => {
  await api.post(`/questionnaires/${id}/update`, data);
}