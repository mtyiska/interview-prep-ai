import { api } from "./api";
import { Question, QuestionGenerateRequest } from "@/types/question";

export const questionService = {
  async generate(
    data: QuestionGenerateRequest,
  ): Promise<{ questions: Question[] }> {
    const response = await api.post("/api/questions/generate", data);
    return response.data;
  },

  async getQuestionBank(): Promise<Record<string, any[]>> {
    const response = await api.get("/api/questions/bank");
    return response.data;
  },
};
