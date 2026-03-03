import { api } from "./api";
import { SessionSummary } from "@/types/interview";

export interface SessionHistoryItem {
  id: string;
  mode: string;
  status: string;
  questions_count: number;
  answers_count: number;
  average_score: number | null;
  created_at: string;
}

export const historyService = {
  async list(
    backgroundId?: string,
    limit: number = 20,
  ): Promise<SessionHistoryItem[]> {
    const params = new URLSearchParams();
    if (backgroundId) params.append("background_id", backgroundId);
    params.append("limit", limit.toString());

    const response = await api.get(`/api/history?${params}`);
    return response.data;
  },

  async getDetail(sessionId: string): Promise<SessionSummary> {
    const response = await api.get(`/api/history/${sessionId}`);
    return response.data;
  },
};
