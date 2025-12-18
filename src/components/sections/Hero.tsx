"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Github, Mail, FileText, Search, ArrowRight } from "lucide-react";
import { contact } from "@/data/resume";
import { cn } from "@/lib/utils";

const buttonStyles = {
  base: "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm px-4 py-2 rounded-lg",
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "border border-gray-700 text-gray-300 hover:bg-gray-800",
  ghost: "text-gray-400 hover:text-white hover:bg-gray-800",
};

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 pt-28 lg:pt-32 pb-16">
      <div className="max-w-4xl mx-auto w-full">
        {/* 이더스캔 메인 스타일 - 검색 중심 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            The Blockchain Developer
            <br />
            <span className="text-primary-400">Explorer</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            {t("tagline")}
          </p>
        </motion.div>

        {/* 이더스캔 스타일 검색창 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-gray-900 border border-gray-700 rounded-xl overflow-hidden focus-within:border-primary-500 transition-colors">
              <div className="flex items-center pl-4">
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  All Filters
                </span>
              </div>
              <input
                type="text"
                placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
                className="flex-1 px-4 py-4 bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none text-sm"
                readOnly
              />
              <button className="px-6 py-4 bg-primary-600 hover:bg-primary-700 transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">
              Sponsored: Hire me for your next blockchain project!
            </p>
          </div>
        </motion.div>

        {/* 지갑 주소 스타일 프로필 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 max-w-2xl mx-auto mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* 프로필 아이콘 */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              JK
            </div>

            <div className="flex-1 min-w-0">
              {/* 이름과 역할 */}
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{t("name")}</h2>
                <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800">
                  Verified
                </span>
              </div>

              {/* 지갑 주소 형식 */}
              <code className="text-xs text-gray-500 font-mono block truncate mb-2">
                0x
                {contact.email
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .slice(0, 40)
                  .padEnd(40, "0")}
              </code>

              {/* 역할 */}
              <p className="text-sm text-primary-400 font-medium">
                {t("role")}
              </p>
            </div>

            {/* 상태 표시 */}
            <div className="flex md:flex-col items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Active</span>
              </div>
              <span className="hidden md:block">Since 2022</span>
            </div>
          </div>
        </motion.div>

        {/* CTA 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <a
            href={`mailto:${contact.email}`}
            className={cn(buttonStyles.base, buttonStyles.primary)}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t("cta.contact")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonStyles.base, buttonStyles.secondary)}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </a>
          <button className={cn(buttonStyles.base, buttonStyles.ghost)}>
            <FileText className="w-4 h-4 mr-2" />
            {t("cta.resume")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
