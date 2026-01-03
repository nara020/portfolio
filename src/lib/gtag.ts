// Google Analytics 이벤트 추적 유틸리티

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && GA_ID) {
    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }
};

// 이벤트 추적
type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 자주 쓰는 이벤트들
export const trackResumeDownload = (language: "ko" | "en") => {
  event({
    action: "download",
    category: "resume",
    label: language,
  });
};

export const trackContactClick = (type: "email" | "github" | "linkedin") => {
  event({
    action: "click",
    category: "contact",
    label: type,
  });
};

export const trackProjectClick = (projectName: string) => {
  event({
    action: "click",
    category: "project",
    label: projectName,
  });
};

export const trackExternalLink = (url: string) => {
  event({
    action: "click",
    category: "external_link",
    label: url,
  });
};

// TypeScript 타입 선언
declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
