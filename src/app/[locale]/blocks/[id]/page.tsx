"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Box,
  Clock,
  User,
  Briefcase,
  Award,
  Copy,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { experiences, projects } from "@/data/resume";
import {
  generateBlockHash,
  generateBlockNumber,
  shortenHash,
  calculateGas,
} from "@/lib/utils";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function BlockDetailPage() {
  const params = useParams();
  const locale = useLocale() as "ko" | "en";
  const [copied, setCopied] = useState(false);

  const blockId = params.id as string;
  const block = experiences.find((exp) => exp.id === blockId);

  if (!block) {
    notFound();
  }

  const blockHash = generateBlockHash(block.id);
  const blockNumber = generateBlockNumber(block.period, 0);
  const gasUsed = calculateGas(block.period);

  // Find related projects using experienceId
  const relatedProjects = projects.filter((proj) => proj.experienceId === block.id);

  const copyHash = () => {
    navigator.clipboard.writeText(blockHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}/blocks`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {locale === "ko" ? "블록 목록으로" : "Back to Blocks"}
          </Link>
        </div>
      </header>

      {/* Block Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Box className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">
                  Block #{blockNumber}
                </h1>
                {block.current && (
                  <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{block.company[locale]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Block Details */}
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
                {locale === "ko" ? "블록 정보" : "Block Information"}
              </h2>
            </div>

            <div className="divide-y divide-gray-800">
              {/* Block Hash */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Block Hash:
                </span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <code className="text-primary-400 font-mono text-sm truncate">
                    {blockHash}
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

              {/* Timestamp */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Timestamp:
                </span>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {block.period}
                  {block.duration && (
                    <span className="text-gray-500">
                      ({block.duration[locale]})
                    </span>
                  )}
                </div>
              </div>

              {/* Miner */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Miner:
                </span>
                <Link
                  href={`/${locale}/address`}
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
                >
                  <User className="w-4 h-4" />
                  {block.company[locale]}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Role */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Role:
                </span>
                <div className="flex items-center gap-2 text-white">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  {block.role[locale]}
                </div>
              </div>

              {/* Gas Used */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Gas Used:
                </span>
                <span className="text-white">{gasUsed}</span>
              </div>

              {/* Transactions (Achievements) */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Transactions:
                </span>
                <span className="text-white">
                  {block.achievements[locale].length}{" "}
                  {locale === "ko" ? "개 성과" : "achievements"}
                </span>
              </div>

              {/* Block Reward (Tech Stack) */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2">
                <span className="text-gray-400 sm:w-40 flex-shrink-0">
                  Block Reward:
                </span>
                <div className="flex flex-wrap gap-2">
                  {block.tech.map((tech) => (
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
              <p className="text-white">{block.description[locale]}</p>
            </div>

            {/* Related Transactions */}
            {relatedProjects.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400">
                    {locale === "ko" ? "관련 트랜잭션" : "Related Transactions"}
                  </h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {relatedProjects.slice(0, 3).map((proj) => (
                    <Link
                      key={proj.id}
                      href={`/${locale}/txs/${proj.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                        <Award className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">
                          {proj.name[locale]}
                        </div>
                        <div className="text-xs text-gray-500">{proj.period}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Block Data (Achievements) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-400" />
              {locale === "ko" ? "블록 데이터 (성과)" : "Block Data (Achievements)"}
            </h2>
            <span className="text-sm text-gray-500">
              {block.achievements[locale].length}{" "}
              {locale === "ko" ? "건" : "items"}
            </span>
          </div>

          <div className="divide-y divide-gray-800">
            {block.achievements[locale].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="px-6 py-4 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-sm text-gray-400 font-mono">
                  {String(index).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">{achievement}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
