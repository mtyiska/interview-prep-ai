import { api } from "./api";
import {
  InterviewSession,
  StartSessionRequest,
  Feedback,
  SessionSummary,
} from "@/types/interview";

export const interviewService = {
  async start(data: StartSessionRequest): Promise<InterviewSession> {
    const response = await api.post("/api/interview/start", data);
    return response.data;
  },

  async getSession(sessionId: string): Promise<InterviewSession> {
    const response = await api.get(`/api/interview/${sessionId}`);
    return response.data;
  },

  async submitAnswer(sessionId: string, answerText: string): Promise<Feedback> {
    const response = await api.post(`/api/interview/${sessionId}/answer`, {
      answer_text: answerText,
    });
    return response.data;
  },

  async nextQuestion(
    sessionId: string,
  ): Promise<{ completed: boolean; question_index?: number; question?: any }> {
    const response = await api.post(`/api/interview/${sessionId}/next`);
    return response.data;
  },

  async endSession(sessionId: string): Promise<SessionSummary> {
    const response = await api.post(`/api/interview/${sessionId}/end`);
    return response.data;
  },
};
