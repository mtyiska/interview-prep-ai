import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Background } from "@/types/background";
import { JobDescription } from "@/types/job";
import { InterviewSession } from "@/types/interview";

interface AppState {
  currentBackground: Background | null;
  currentJob: JobDescription | null;
  currentSession: InterviewSession | null;
  setCurrentBackground: (background: Background | null) => void;
  setCurrentJob: (job: JobDescription | null) => void;
  setCurrentSession: (session: InterviewSession | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentBackground: null,
      currentJob: null,
      currentSession: null,
      setCurrentBackground: (background) =>
        set({ currentBackground: background }),
      setCurrentJob: (job) => set({ currentJob: job }),
      setCurrentSession: (session) => set({ currentSession: session }),
    }),
    {
      name: "interview-prep-storage",
    },
  ),
);
