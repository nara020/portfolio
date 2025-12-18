"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { experiences } from "@/data/resume";
import { dateToBlock } from "@/lib/utils";
import type { Locale } from "@/data/types";

// 가상의 Txn Hash 생성
function generateTxHash(id: string): string {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `0x${hash.toString(16).padStart(8, "0")}...${(hash * 7).toString(16).slice(0, 4)}`;
}

export default function Experience() {
  const t = useTranslations("sections.experience");
  const locale = useLocale() as Locale;

  return (
    <section className="py-16 px-4" id="experience">
      <div className="max-w-6xl mx-auto">
        {/* 이더스캔 스타일 섹션 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-gray-400" />
          <h2 className="text-base font-medium text-white">{t("title")}</h2>
          <span className="text-sm text-gray-500">({t("subtitle")})</span>
        </div>

        {/* 이더스캔 테이블 스타일 */}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-gray-900/80 border-b border-gray-800 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <div className="col-span-2">Txn Hash</div>
            <div className="col-span-1">Block</div>
            <div className="col-span-2">Age</div>
            <div className="col-span-3">From (Company)</div>
            <div className="col-span-4">To (Role)</div>
          </div>

          {/* 테이블 바디 */}
          <div className="divide-y divide-gray-800">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                {/* 메인 행 - 테이블 형식 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-4 hover:bg-gray-900/50 transition-colors">
                  {/* Txn Hash */}
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="md:hidden text-xs text-gray-500">Txn:</span>
                    <span className="font-mono text-sm text-primary-400 hover:text-primary-300 cursor-pointer">
                      {generateTxHash(exp.id)}
                    </span>
                  </div>

                  {/* Block */}
                  <div className="col-span-1 flex items-center">
                    <span className="md:hidden text-xs text-gray-500 mr-2">Block:</span>
                    <span className="font-mono text-sm text-primary-400">
                      {dateToBlock(exp.period.split(" ~ ")[0])}
                    </span>
                  </div>

                  {/* Age (Period) */}
                  <div className="col-span-2 flex items-center">
                    <span className="md:hidden text-xs text-gray-500 mr-2">Age:</span>
                    <span className="text-sm text-gray-400">{exp.period}</span>
                    {exp.current && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800">
                        IN
                      </span>
                    )}
                  </div>

                  {/* From (Company) */}
                  <div className="col-span-3 flex items-center gap-1">
                    <span className="md:hidden text-xs text-gray-500 mr-2">From:</span>
                    <span className="text-sm text-white font-medium truncate">
                      {exp.company[locale]}
                    </span>
                  </div>

                  {/* To (Role) */}
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="md:hidden text-xs text-gray-500 mr-2">To:</span>
                    <ArrowRight className="w-3 h-3 text-gray-600 hidden md:block" />
                    <span className="text-sm text-gray-300 truncate">
                      {exp.role[locale]}
                    </span>
                  </div>
                </div>

                {/* 확장 상세 정보 (호버 시 표시 또는 항상 표시) */}
                <div className="px-4 pb-4 pt-0 bg-gray-900/30">
                  <div className="ml-0 md:ml-4 pl-4 border-l-2 border-gray-800">
                    {/* 설명 */}
                    <p className="text-xs text-gray-500 mb-3">
                      {exp.description[locale]}
                    </p>

                    {/* 성과 - Input Data 스타일 */}
                    <div className="mb-3">
                      <span className="text-xs text-gray-600 uppercase tracking-wider">
                        Input Data (Achievements):
                      </span>
                      <div className="mt-1.5 space-y-1">
                        {exp.achievements[locale].map((achievement, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs font-mono"
                          >
                            <span className="text-green-500">[{i}]</span>
                            <span className="text-gray-400">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 기술 스택 - Method 스타일 */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-gray-600 uppercase tracking-wider mr-2">
                        Methods:
                      </span>
                      {exp.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs font-mono bg-gray-800 text-gray-300 rounded border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 테이블 푸터 */}
          <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-800 text-xs text-gray-500">
            <span>Showing {experiences.length} transactions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
