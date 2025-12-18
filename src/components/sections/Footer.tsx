"use client";

import { useTranslations } from "next-intl";
import { Github, Mail, Linkedin } from "lucide-react";
import { contact } from "@/data/resume";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="py-8 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 카피라이트 */}
          <p className="text-sm text-gray-500">{t("copyright")}</p>

          {/* 소셜 링크 */}
          <div className="flex items-center gap-4">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* 블록 정보 (이더스캔 느낌) */}
          <div className="text-xs text-gray-600 font-mono">
            Built with Next.js • Deployed on Vercel
          </div>
        </div>
      </div>
    </footer>
  );
}
