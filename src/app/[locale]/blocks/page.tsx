"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Box, Clock, User, Briefcase, Award } from "lucide-react";
import { experiences } from "@/data/resume";
import { generateBlockHash, generateBlockNumber, shortenHash } from "@/lib/utils";

export default function BlocksPage() {
  const t = useTranslations("experience");
  const locale = useLocale() as "ko" | "en";

  // 경력을 블록처럼 표현 - 블록 번호는 입사년도 기반
  const blocks = experiences.map((exp, index) => {
    const blockNumber = generateBlockNumber(exp.period, index);
    const hash = generateBlockHash(exp.id);
    return {
      ...exp,
      blockNumber,
      hash,
      shortHash: shortenHash(hash, 8),
      txCount: exp.achievements[locale].length,
      reward: exp.tech.length,
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
              <Box className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Blocks</h1>
              <p className="text-sm text-gray-400">
                {t("subtitle") || "Career Experience Blocks"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Table */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-800/50 text-xs text-gray-400 font-medium uppercase">
            <div className="col-span-2">Block</div>
            <div className="col-span-2">Age</div>
            <div className="col-span-3">Miner (Company)</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-1 text-center">Txns</div>
            <div className="col-span-1 text-right">Reward</div>
          </div>

          {/* Block Rows */}
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-t border-gray-800 first:border-t-0"
            >
              {/* Desktop View */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-800/30 transition-colors">
                {/* Block Number */}
                <div className="col-span-2">
                  <Link
                    href={`/${locale}/blocks/${block.id}`}
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
                  >
                    <Box className="w-4 h-4" />
                    <span className="font-mono">{block.blockNumber}</span>
                  </Link>
                </div>

                {/* Age */}
                <div className="col-span-2 flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{block.period}</span>
                </div>

                {/* Company */}
                <div className="col-span-3">
                  <Link
                    href={`/${locale}/address/${block.id}`}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {block.company[locale].charAt(0)}
                    </div>
                    <div>
                      <span className="text-white hover:text-primary-400 transition-colors">
                        {block.company[locale]}
                      </span>
                      {block.current && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-green-900/50 text-green-400 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Role */}
                <div className="col-span-3 flex items-center gap-2 text-gray-300">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{block.role[locale]}</span>
                </div>

                {/* Txn Count */}
                <div className="col-span-1 text-center">
                  <Link
                    href={`/${locale}/txs?block=${block.id}`}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    {block.txCount}
                  </Link>
                </div>

                {/* Reward (Tech Stack Count) */}
                <div className="col-span-1 text-right">
                  <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700">
                    {block.reward} Skills
                  </span>
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Link
                    href={`/${locale}/blocks/${block.id}`}
                    className="flex items-center gap-2 text-primary-400"
                  >
                    <Box className="w-4 h-4" />
                    <span className="font-mono">{block.blockNumber}</span>
                  </Link>
                  {block.current && (
                    <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {block.company[locale].charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {block.company[locale]}
                    </div>
                    <div className="text-xs text-gray-400">
                      {block.role[locale]}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>{block.period}</span>
                  <span>{block.txCount} achievements</span>
                </div>
              </div>

              {/* Expanded Details */}
              <div className="px-6 pb-5 hidden md:block">
                <div className="mt-2 pt-3 border-t border-gray-800/50">
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Block Data (Achievements):
                  </div>
                  <ul className="space-y-1">
                    {block.achievements[locale].map((achievement, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-primary-500 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {block.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded border border-gray-700"
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

        {/* Summary */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {blocks.length} blocks |{" "}
          {blocks.reduce((sum, b) => sum + b.txCount, 0)} total achievements
        </div>
      </div>
    </div>
  );
}
