import { api } from "./api";
import {
  Background,
  BackgroundCreate,
  STARStoryCreate,
  ExperienceCreate,
  STARStory,
  Experience,
  ResumeParseResponse,
} from "@/types/background";

export const backgroundService = {
  async create(data: BackgroundCreate): Promise<Background> {
    const response = await api.post("/api/background", data);
    return response.data;
  },

  async get(id: string): Promise<Background> {
    const response = await api.get(`/api/background/${id}`);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<BackgroundCreate>,
  ): Promise<Background> {
    const response = await api.put(`/api/background/${id}`, data);
    return response.data;
  },

  async addSTARStory(
    backgroundId: string,
    data: STARStoryCreate,
  ): Promise<STARStory> {
    const response = await api.post(
      `/api/background/${backgroundId}/star-stories`,
      data,
    );
    return response.data;
  },

  async addExperience(
    backgroundId: string,
    data: ExperienceCreate,
  ): Promise<Experience> {
    const response = await api.post(
      `/api/background/${backgroundId}/experiences`,
      data,
    );
    return response.data;
  },

  async parseResume(resumeText: string): Promise<ResumeParseResponse> {
    const response = await api.post("/api/background/parse-resume", {
      resume_text: resumeText,
    });
    return response.data;
  },
};
