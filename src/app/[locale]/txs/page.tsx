"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, ArrowRight, ExternalLink, CheckCircle } from "lucide-react";
import { projects } from "@/data/resume";
import { generateTxHash, shortenHash } from "@/lib/utils";

export default function TransactionsPage() {
  const t = useTranslations("projects");
  const locale = useLocale() as "ko" | "en";

  // 프로젝트를 트랜잭션처럼 표현
  const transactions = projects.map((project, index) => {
    const hash = generateTxHash(project.id);
    return {
      ...project,
      hash,
      shortHash: shortenHash(hash, 8),
      status: project.period.includes("Present") ? "pending" : "success",
      value: project.highlights[locale].length,
    };
  });

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

      {/* Transactions Table */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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

          {/* Transaction Rows */}
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
          Showing {transactions.length} transactions |{" "}
          {transactions.filter((t) => t.status === "success").length} completed,{" "}
          {transactions.filter((t) => t.status === "pending").length} in progress
        </div>
      </div>
    </div>
  );
}
