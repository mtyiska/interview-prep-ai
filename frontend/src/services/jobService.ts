import { api } from "./api";
import { JobDescription, JobDescriptionCreate } from "@/types/job";

export const jobService = {
  async create(data: JobDescriptionCreate): Promise<JobDescription> {
    const response = await api.post("/api/job-descriptions", data);
    return response.data;
  },

  async get(id: string): Promise<JobDescription> {
    const response = await api.get(`/api/job-descriptions/${id}`);
    return response.data;
  },

  async list(): Promise<JobDescription[]> {
    const response = await api.get("/api/job-descriptions");
    return response.data;
  },
};
