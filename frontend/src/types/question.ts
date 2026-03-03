export type QuestionType =
  | "behavioral"
  | "technical"
  | "situational"
  | "competency";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category: string;
  expected_star_components?: string[];
}

export interface QuestionGenerateRequest {
  background_id?: string;
  job_description_id?: string;
  question_types: QuestionType[];
  count: number;
}
