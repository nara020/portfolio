"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 브라우저 언어 감지
function detectBrowserLanguage(): "en" | "ko" {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang?.toLowerCase().startsWith("ko")) {
    return "ko";
  }
  return "en";
}

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 브라우저 언어 감지 후 바로 리다이렉트
    const locale = detectBrowserLanguage();
    router.replace(`/${locale}/simple`);
  }, [router]);

  // 리다이렉트 중 로딩 표시
  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-bold text-xl">JK</span>
        </div>
        <div className="text-gray-500 text-sm font-mono">
          Loading...
        </div>
      </div>
    </div>
  );
}
