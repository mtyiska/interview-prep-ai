export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  created_at: string;
}

export interface STARStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
  created_at: string;
}

export interface Background {
  id: string;
  name: string;
  resume_text?: string;
  skills: string[];
  experiences: Experience[];
  star_stories: STARStory[];
  created_at: string;
  updated_at: string;
}

export interface BackgroundCreate {
  name: string;
  resume_text?: string;
  skills: string[];
}

export interface STARStoryCreate {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
}

export interface ExperienceCreate {
  company: string;
  role: string;
  duration: string;
  description: string;
}

// Resume parsing types
export interface ParsedExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ParsedSTARStory {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
}

export interface ResumeParseResponse {
  name: string;
  skills: string[];
  experiences: ParsedExperience[];
  star_stories: ParsedSTARStory[];
}
