/**
 * Portfolio Domain Types
 */

export type Locale = "ko" | "en";

export interface Localized<T> {
  ko: T;
  en: T;
}

export interface Experience {
  id: string;
  company: Localized<string>;
  role: Localized<string>;
  period: string;
  duration?: Localized<string>;
  current?: boolean;
  description: Localized<string>;
  achievements: Localized<string[]>;
  tech: string[];
  type: "work" | "research" | "military" | "other"; // work: IT경력, research: 연구, military: 병역, other: 기타
}

// STAR 방법론 기반 문제해결 과정
export interface ProblemSolving {
  situation: Localized<string>;  // 상황: 어떤 문제/배경이 있었는가
  task: Localized<string>;       // 과제: 해결해야 할 구체적 목표
  action: Localized<string[]>;   // 행동: 문제 해결을 위해 취한 구체적 조치들
  result: Localized<string[]>;   // 결과: 정량적/정성적 성과
  metrics?: {                    // 핵심 성과 지표 (선택)
    before?: string;
    after?: string;
    improvement?: string;
  };
}

export interface Project {
  id: string;
  experienceId: string; // 어느 블록(경력)에 속하는지
  name: Localized<string>;
  description: Localized<string>;
  period: string;
  team?: Localized<string>;
  role?: Localized<string>; // 프로젝트에서의 역할
  highlights: Localized<string[]>;
  tech: string[];
  status?: "completed" | "in_progress"; // 프로젝트 상태
  featured?: boolean; // 핵심 프로젝트 여부
  problemSolving?: ProblemSolving; // STAR 방법론 기반 문제해결 과정
  links?: {
    github?: string;
    demo?: string;
    paper?: string;
  };
}

export interface Skill {
  category: string;
  items: {
    name: string;
    level: number;
  }[];
}

export interface Contact {
  email: string;
  phone: string;
  github: string;
  linkedin?: string;
  location: Localized<string>;
}

export interface Award {
  id: string;
  name: Localized<string>;
  issuer: Localized<string>;
  date: string;
  type: "award" | "certification" | "paper";
  description?: Localized<string>;
}

export interface Education {
  id: string;
  school: Localized<string>;
  major: Localized<string>;
  period: string;
  status: Localized<string>;
  gpa?: string;
  majorGpa?: string;
  credits?: Localized<string>;
  thesis?: Localized<string>;
}

export interface Paper {
  id: string;
  title: Localized<string>;
  authors?: string; // e.g., "Jinhyeok Kim, et al."
  venue: Localized<string>; // Journal/Conference name
  publisher?: string; // Springer, IEEE, KCI, etc.
  date: string;
  abstract: Localized<string>;
  type: "journal" | "conference";
  isFirstAuthor?: boolean;
  award?: Localized<string>; // e.g., "Best Paper Award"
  links?: {
    doi?: string;
    pdf?: string;
    linkedin?: string;
  };
}
