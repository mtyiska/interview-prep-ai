import { Question } from "./question";

export type SessionMode = "flashcard" | "mock";
export type SessionStatus = "active" | "completed";

export interface STARBreakdown {
  situation: number;
  task: number;
  action: number;
  result: number;
}

export interface Feedback {
  overall_score: number;
  star_breakdown: STARBreakdown;
  strengths: string[];
  improvements: string[];
  suggested_revision?: string;
  follow_up_question?: string;
}

export interface AnswerRecord {
  id: string;
  question_id: string;
  question_text: string;
  answer_text: string;
  overall_score?: number;
  feedback?: Feedback;
  created_at: string;
}

export interface InterviewSession {
  id: string;
  mode: SessionMode;
  background_id: string;
  job_description_id?: string;
  questions: Question[];
  current_question_index: number;
  status: SessionStatus;
  created_at: string;
}

export interface StartSessionRequest {
  mode: SessionMode;
  background_id: string;
  job_description_id?: string;
  question_count: number;
}

export interface SessionSummary {
  session_id: string;
  total_questions: number;
  questions_answered: number;
  average_score?: number;
  answers: AnswerRecord[];
}
