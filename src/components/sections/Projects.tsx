"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, Code2, Clock, Loader2 } from "lucide-react";
import { projects } from "@/data/resume";
import type { Locale, Project } from "@/data/types";

// 가상의 Contract Address 생성
function generateContractAddress(id: string): string {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `0x${(hash * 123).toString(16).padStart(10, "0").slice(0, 10)}...${(hash * 456).toString(16).slice(0, 4)}`;
}

export default function Projects() {
  const t = useTranslations("sections.projects");
  const locale = useLocale() as Locale;

  const verifiedCount = projects.filter(p => p.status !== "in_progress").length;
  const pendingCount = projects.filter(p => p.status === "in_progress").length;

  return (
    <section className="py-16 px-4 bg-gray-900/30" id="projects">
      <div className="max-w-6xl mx-auto">
        {/* 이더스캔 Verified Contracts 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-5 h-5 text-gray-400" />
          <h2 className="text-base font-medium text-white">{t("title")}</h2>
          <span className="text-sm text-gray-500">({t("subtitle")})</span>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{verifiedCount} Verified</span>
            </span>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{pendingCount} Pending</span>
              </span>
            )}
          </div>
        </div>

        {/* 이더스캔 테이블 스타일 */}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-gray-900/80 border-b border-gray-800 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <div className="col-span-3">Address</div>
            <div className="col-span-3">Contract Name</div>
            <div className="col-span-2">Deployed</div>
            <div className="col-span-3">Compiler</div>
            <div className="col-span-1">Status</div>
          </div>

          {/* 테이블 바디 */}
          <div className="divide-y divide-gray-800">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* 메인 행 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-4 hover:bg-gray-900/50 transition-colors">
                  {/* Address */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="md:hidden text-xs text-gray-500">Address:</span>
                    <span className="font-mono text-sm text-primary-400">
                      {generateContractAddress(project.id)}
                    </span>
                    {project.links?.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary-400"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Contract Name */}
                  <div className="col-span-3 flex items-center">
                    <span className="md:hidden text-xs text-gray-500 mr-2">Name:</span>
                    <span className="text-sm text-white font-medium">
                      {project.name[locale]}
                    </span>
                  </div>

                  {/* Deployed (Period) */}
                  <div className="col-span-2 flex items-center">
                    <span className="md:hidden text-xs text-gray-500 mr-2">Deployed:</span>
                    <span className="text-sm text-gray-400 font-mono">
                      {project.period.split(" ~ ")[0]}
                    </span>
                  </div>

                  {/* Compiler (Tech Stack) */}
                  <div className="col-span-3 flex items-center gap-1.5 flex-wrap">
                    <span className="md:hidden text-xs text-gray-500 mr-2">Tech:</span>
                    {project.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-1.5 py-0.5 text-xs font-mono bg-gray-800 text-gray-400 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <span className="md:hidden text-xs text-gray-500 mr-2">Status:</span>
                    {project.status === "in_progress" ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-900/30 text-yellow-400 rounded border border-yellow-800/50 animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span className="hidden lg:inline">Pending</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-green-900/30 text-green-400 rounded border border-green-800/50">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Verified</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 확장 상세 - Contract Source */}
                <div className="px-4 pb-4 pt-0 bg-gray-900/30">
                  <div className="ml-0 md:ml-4 pl-4 border-l-2 border-gray-800">
                    {/* Description */}
                    <p className="text-xs text-gray-500 mb-3">
                      {project.description[locale]}
                    </p>

                    {/* Contract ABI (Highlights) */}
                    <div className="mb-3">
                      <span className="text-xs text-gray-600 uppercase tracking-wider">
                        Contract ABI (Highlights):
                      </span>
                      <div className="mt-1.5 space-y-1 font-mono text-xs">
                        {project.highlights[locale].map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-purple-400">function</span>
                            <span className="text-yellow-400">achievement_{i}</span>
                            <span className="text-gray-600">{"() =>"}</span>
                            <span className="text-gray-400">{`"${highlight}"`}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full Tech Stack */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-gray-600 uppercase tracking-wider mr-2">
                        Dependencies:
                      </span>
                      {project.tech.map((tech) => (
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
          <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-800 text-xs text-gray-500 flex items-center justify-between">
            <span>Showing {projects.length} contracts ({verifiedCount} verified, {pendingCount} pending)</span>
            <div className="flex items-center gap-3">
              {pendingCount > 0 && (
                <span className="text-yellow-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 animate-pulse" />
                  {pendingCount} awaiting confirmation
                </span>
              )}
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {Math.round((verifiedCount / projects.length) * 100)}% verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
