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
  type: "award" | "certification";
}

export interface Education {
  id: string;
  school: Localized<string>;
  major: Localized<string>;
  period: string;
  status: Localized<string>;
  gpa?: string;
  thesis?: Localized<string>;
}
