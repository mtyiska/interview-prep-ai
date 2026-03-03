export interface ExtractedRequirements {
  must_have_skills: string[];
  nice_to_have_skills: string[];
  responsibilities: string[];
  suggested_question_topics: string[];
}

export interface JobDescription {
  id: string;
  title: string;
  company?: string;
  raw_text: string;
  extracted_requirements: ExtractedRequirements;
  created_at: string;
}

export interface JobDescriptionCreate {
  title: string;
  company?: string;
  raw_text: string;
}
