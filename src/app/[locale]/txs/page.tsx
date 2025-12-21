"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, ArrowRight, ExternalLink, CheckCircle, Star, FolderOpen } from "lucide-react";
import { projects } from "@/data/resume";
import { generateTxHash, shortenHash } from "@/lib/utils";

export default function TransactionsPage() {
  const t = useTranslations("projects");
  const locale = useLocale() as "ko" | "en";

  // 프로젝트를 트랜잭션처럼 표현 (날짜순 정렬)
  const allTransactions = projects
    .map((project) => {
      const hash = generateTxHash(project.id);
      // period에서 시작 년도 추출 (예: "2024.01 ~ 2024.06" -> 2024)
      const startYear = parseInt(project.period.split(".")[0]) || 0;
      const startMonth = parseInt(project.period.split(".")[1]?.split(" ")[0]) || 0;
      return {
        ...project,
        hash,
        shortHash: shortenHash(hash, 8),
        status: project.period.includes("Present") ? "pending" : "success",
        value: project.highlights[locale].length,
        sortKey: startYear * 100 + startMonth, // 정렬용 키
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey); // 최신순 정렬

  // 핵심 프로젝트와 기타 프로젝트 분리
  const featuredTransactions = allTransactions.filter((tx) => tx.featured);
  const otherTransactions = allTransactions.filter((tx) => !tx.featured);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explorer
          </Link>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Transactions</h1>
              <p className="text-sm text-gray-400">
                {t("subtitle") || "Project Transactions"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Transactions */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section Header - Featured */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {locale === "ko" ? "핵심 프로젝트" : "Featured Projects"}
            </h2>
            <p className="text-xs text-gray-500">
              {locale === "ko" ? "주요 성과 및 핵심 기술 프로젝트" : "Key achievements and core technology projects"}
            </p>
          </div>
          <span className="ml-auto px-2 py-1 text-xs bg-yellow-900/30 text-yellow-400 rounded border border-yellow-800/50">
            {featuredTransactions.length} {locale === "ko" ? "건" : "projects"}
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-yellow-900/20 text-xs text-gray-400 font-medium uppercase border-b border-yellow-800/30">
            <div className="col-span-3">Txn Hash</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Age</div>
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Tech Stack</div>
            <div className="col-span-1 text-right">Value</div>
          </div>

          {/* Featured Transaction Rows */}
          {featuredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-t border-gray-800 first:border-t-0"
            >
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-yellow-900/10 transition-colors">
                {/* Txn Hash */}
                <div className="col-span-3">
                  <Link
                    href={`/${locale}/txs/${tx.id}`}
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <Star className="w-4 h-4" />
                    <span className="font-mono text-sm">{tx.shortHash}</span>
                  </Link>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  {tx.status === "success" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800">
                      <CheckCircle className="w-3 h-3" />
                      Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-900/50 text-yellow-400 rounded border border-yellow-800 animate-pulse">
                      Pending
                    </span>
                  )}
                </div>

                {/* Age */}
                <div className="col-span-2 flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{tx.period}</span>
                </div>

                {/* Project Name */}
                <div className="col-span-3">
                  <div className="text-white font-medium">{tx.name[locale]}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {tx.description[locale]}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {tx.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-300 rounded"
                      >
                        {t}
                      </span>
                    ))}
                    {tx.tech.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gray-800 text-gray-500 rounded">
                        +{tx.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Value */}
                <div className="col-span-1 text-right">
                  <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded border border-yellow-800/50">
                    {tx.value} Highlights
                  </span>
                </div>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Link
                    href={`/${locale}/txs/${tx.id}`}
                    className="flex items-center gap-2 text-yellow-400"
                  >
                    <Star className="w-4 h-4" />
                    <span className="font-mono text-sm">{tx.shortHash}</span>
                  </Link>
                  {tx.status === "success" ? (
                    <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded">
                      Success
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs bg-yellow-900/50 text-yellow-400 rounded animate-pulse">
                      Pending
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-white font-medium">{tx.name[locale]}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {tx.description[locale]}
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>{tx.period}</span>
                  <span>{tx.value} highlights</span>
                </div>
              </div>

              {/* Expanded Details */}
              <div className="px-6 pb-5">
                <div className="pt-3 border-t border-gray-800/50">
                  <div className="text-xs text-gray-500 mb-2">
                    Transaction Data (Highlights):
                  </div>
                  <ul className="space-y-1">
                    {tx.highlights[locale].map((highlight, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 mt-1 text-yellow-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {tx.links && (
                    <div className="mt-3 flex gap-2">
                      {tx.links.demo && (
                        <a
                          href={tx.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Demo
                        </a>
                      )}
                      {tx.links.github && (
                        <a
                          href={tx.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Header - Other */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {locale === "ko" ? "기타 프로젝트" : "Other Projects"}
            </h2>
            <p className="text-xs text-gray-500">
              {locale === "ko" ? "추가 경험 및 학습 프로젝트" : "Additional experience and learning projects"}
            </p>
          </div>
          <span className="ml-auto px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded border border-gray-700">
            {otherTransactions.length} {locale === "ko" ? "건" : "projects"}
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-800/50 text-xs text-gray-400 font-medium uppercase">
            <div className="col-span-3">Txn Hash</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Age</div>
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Tech Stack</div>
            <div className="col-span-1 text-right">Value</div>
          </div>

          {/* Other Transaction Rows */}
          {otherTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-t border-gray-800 first:border-t-0"
            >
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-800/30 transition-colors">
                {/* Txn Hash */}
                <div className="col-span-3">
                  <Link
                    href={`/${locale}/txs/${tx.id}`}
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="font-mono text-sm">{tx.shortHash}</span>
                  </Link>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  {tx.status === "success" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800">
                      <CheckCircle className="w-3 h-3" />
                      Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-900/50 text-yellow-400 rounded border border-yellow-800 animate-pulse">
                      Pending
                    </span>
                  )}
                </div>

                {/* Age */}
                <div className="col-span-2 flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{tx.period}</span>
                </div>

                {/* Project Name */}
                <div className="col-span-3">
                  <div className="text-white font-medium">{tx.name[locale]}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {tx.description[locale]}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {tx.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded"
                      >
                        {t}
                      </span>
                    ))}
                    {tx.tech.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gray-800 text-gray-500 rounded">
                        +{tx.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Value */}
                <div className="col-span-1 text-right">
                  <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700">
                    {tx.value} Highlights
                  </span>
                </div>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Link
                    href={`/${locale}/txs/${tx.id}`}
                    className="flex items-center gap-2 text-primary-400"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="font-mono text-sm">{tx.shortHash}</span>
                  </Link>
                  {tx.status === "success" ? (
                    <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded">
                      Success
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs bg-yellow-900/50 text-yellow-400 rounded animate-pulse">
                      Pending
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-white font-medium">{tx.name[locale]}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {tx.description[locale]}
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>{tx.period}</span>
                  <span>{tx.value} highlights</span>
                </div>
              </div>

              {/* Expanded Details */}
              <div className="px-6 pb-5">
                <div className="pt-3 border-t border-gray-800/50">
                  <div className="text-xs text-gray-500 mb-2">
                    Transaction Data (Highlights):
                  </div>
                  <ul className="space-y-1">
                    {tx.highlights[locale].map((highlight, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 mt-1 text-primary-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {tx.links && (
                    <div className="mt-3 flex gap-2">
                      {tx.links.demo && (
                        <a
                          href={tx.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Demo
                        </a>
                      )}
                      {tx.links.github && (
                        <a
                          href={tx.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {allTransactions.length} transactions |{" "}
          <span className="text-yellow-400">{featuredTransactions.length} featured</span>,{" "}
          {otherTransactions.length} other |{" "}
          {allTransactions.filter((t) => t.status === "success").length} completed,{" "}
          {allTransactions.filter((t) => t.status === "pending").length} in progress
        </div>
      </div>
    </div>
  );
}
