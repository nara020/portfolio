"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Clock,
  Users,
  Copy,
  CheckCircle,
  ExternalLink,
  Github,
  Play,
  BookOpen,
  ChevronRight,
  Box,
  Zap,
} from "lucide-react";
import { projects, experiences } from "@/data/resume";
import {
  generateTxHash,
  generateBlockHash,
  shortenHash,
} from "@/lib/utils";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function TxDetailPage() {
  const params = useParams();
  const locale = useLocale() as "ko" | "en";
  const [copied, setCopied] = useState(false);

  const txId = params.id as string;
  const tx = projects.find((proj) => proj.id === txId);

  if (!tx) {
    notFound();
  }

  const txHash = generateTxHash(tx.id);
  const isOngoing = tx.period.includes("Present");

  // Find related block using experienceId
  const relatedBlock = experiences.find((exp) => exp.id === tx.experienceId);
  const blockHash = relatedBlock ? generateBlockHash(relatedBlock.id) : null;

  const copyHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}/txs`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {locale === "ko" ? "트랜잭션 목록으로" : "Back to Transactions"}
          </Link>
        </div>
      </header>

      {/* Tx Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">
                  Transaction Details
                </h1>
                {isOngoing ? (
                  <span className="px-2 py-0.5 text-xs bg-yellow-900/50 text-yellow-400 rounded border border-yellow-800 flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Success
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{tx.name[locale]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tx Details */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {locale === "ko" ? "트랜잭션 정보" : "Transaction Information"}
              </h2>
            </div>

            <div className="divide-y divide-gray-800">
              {/* Tx Hash */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Transaction Hash:
                </span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <code className="text-blue-400 font-mono text-sm truncate">
                    {txHash}
                  </code>
                  <button
                    onClick={copyHash}
                    className="p-1 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Status:
                </span>
                <div className="flex items-center gap-2">
                  {isOngoing ? (
                    <>
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-yellow-400">Pending</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-green-400">Success</span>
                    </>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Timestamp:
                </span>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {tx.period}
                </div>
              </div>

              {/* Team */}
              {tx.team && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-gray-400 sm:w-40 flex-shrink-0">
                    Team Size:
                  </span>
                  <div className="flex items-center gap-2 text-white">
                    <Users className="w-4 h-4 text-gray-500" />
                    {tx.team[locale]}
                  </div>
                </div>
              )}

              {/* Role */}
              {tx.role && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-gray-400 sm:w-40 flex-shrink-0">
                    Role:
                  </span>
                  <span className="text-white font-medium">{tx.role[locale]}</span>
                </div>
              )}

              {/* Block */}
              {relatedBlock && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-gray-400 sm:w-40 flex-shrink-0">
                    Block:
                  </span>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/${locale}/blocks/${relatedBlock.id}`}
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
                    >
                      <Box className="w-4 h-4" />
                      {relatedBlock.company[locale]}
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                    {blockHash && (
                      <code className="text-xs text-gray-500 font-mono">
                        {shortenHash(blockHash, 10)}
                      </code>
                    )}
                  </div>
                </div>
              )}

              {/* Value (Tech Stack) */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Value:
                </span>
                <div className="flex flex-wrap gap-2">
                  {tx.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Description Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                {locale === "ko" ? "설명" : "Description"}
              </h3>
              <p className="text-white">{tx.description[locale]}</p>
            </div>

            {/* Links */}
            {tx.links && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400">
                    {locale === "ko" ? "외부 링크" : "External Links"}
                  </h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {tx.links.demo && (
                    <a
                      href={tx.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                        <Play className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white">Demo / Live</div>
                        <div className="text-xs text-gray-500 truncate">
                          {tx.links.demo}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {tx.links.github && (
                    <a
                      href={tx.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                        <Github className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white">GitHub</div>
                        <div className="text-xs text-gray-500 truncate">
                          {tx.links.github}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {tx.links.paper && (
                    <a
                      href={tx.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white">Paper</div>
                        <div className="text-xs text-gray-500 truncate">
                          {tx.links.paper}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Input Data (Highlights) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              {locale === "ko" ? "Input Data (하이라이트)" : "Input Data (Highlights)"}
            </h2>
            <span className="text-sm text-gray-500">
              {tx.highlights[locale].length}{" "}
              {locale === "ko" ? "건" : "items"}
            </span>
          </div>

          <div className="divide-y divide-gray-800">
            {tx.highlights[locale].map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="px-6 py-4 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">{highlight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
