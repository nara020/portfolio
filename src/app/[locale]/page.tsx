"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Box,
  FileText,
  TrendingUp,
  Clock,
  Server,
  Gauge,
  ArrowRight,
  Search,
  User,
  Github,
  Zap,
  Shield,
  Trophy,
  Award,
  Linkedin,
  BookOpen,
} from "lucide-react";
import { experiences, projects, skills, contact, keyMetrics, awards, personalInfo } from "@/data/resume";
import { Header, Footer } from "@/components/sections";
import SearchModal from "@/components/SearchModal";

export default function Home() {
  const t = useTranslations("hero");
  const locale = useLocale() as "ko" | "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Stats 계산
  const totalExperience = "3+";
  const totalProjects = projects.length;
  const totalSkills = skills.reduce((sum, cat) => sum + cat.items.length, 0);
  const totalAchievements = experiences.reduce(
    (sum, exp) => sum + exp.achievements[locale].length,
    0
  );

  // Latest blocks (experiences)
  const latestBlocks = experiences.slice(0, 3).map((exp, index) => ({
    ...exp,
    blockNumber: parseInt(exp.period.split(".")[0]) * 1000 + index,
    txCount: exp.achievements[locale].length,
  }));

  // Latest transactions (projects)
  const latestTxs = projects.slice(0, 3).map((project) => ({
    ...project,
    hash: `0x${project.id.replace(/-/g, "").padEnd(16, "0").slice(0, 16)}...`,
    status: project.period.includes("Present") ? "pending" : "success",
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950">
        {/* Hero Section - 이더스캔 스타일 */}
        <section className="bg-gradient-to-b from-gray-900 to-gray-950 pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  The Blockchain Developer
                  <br />
                  <span className="text-primary-400">Explorer</span>
                </h1>
                <p className="text-gray-400 mb-6">{t("tagline")}</p>

                {/* Search Bar - 이더스캔 스타일 (클릭하면 검색 모달 열림) */}
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500 transition-colors mb-4 cursor-pointer group"
                >
                  <div className="flex items-center pl-4">
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded group-hover:bg-gray-700 transition-colors">
                      All Filters
                    </span>
                  </div>
                  <div className="flex-1 px-4 py-4 text-gray-500 text-sm">
                    {locale === "ko"
                      ? "경력 / 프로젝트 / 스킬 / 해시로 검색..."
                      : "Search by Experience / Project / Skill / Hash..."}
                  </div>
                  <div className="px-6 py-4 bg-primary-600 group-hover:bg-primary-700 transition-colors">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Sponsored: Hire me for your next blockchain project!
                </p>

                {/* Etherscan 스타일 설명 */}
                <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-400">
                  <span className="text-primary-400 font-medium">Navigation Guide: </span>
                  {locale === "ko"
                    ? "Blocks = 경력 | Transactions = 프로젝트 | Contract Calls = 성과"
                    : "Blocks = Career | Transactions = Projects | Contract Calls = Achievements"}
                </div>
              </div>

              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    JK
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-white">{personalInfo.name[locale]}</h2>
                      <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800">
                        Verified
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-yellow-900/50 text-yellow-400 rounded border border-yellow-800">
                        OPIC IH
                      </span>
                    </div>
                    <code className="text-xs text-gray-500 font-mono">
                      0x{contact.email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}...
                    </code>
                  </div>
                </div>
                <p className="text-sm text-primary-400 font-medium mb-2">{t("role")}</p>
                <p className="text-xs text-gray-400 mb-4">
                  {keyMetrics.papers.value} Papers (IEEE, KCI) · {keyMetrics.awards.value} Awards · {keyMetrics.tpsImprovement.value} TPS · {keyMetrics.projects.value} {locale === "ko" ? "프로젝트" : "Projects"}
                </p>
                <div className="flex gap-2">
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section - LinkedIn Style Story */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-400" />
              {locale === "ko" ? "About" : "About"}
            </h2>
            <div className="text-gray-300 text-sm leading-relaxed space-y-3">
              <p>
                {locale === "ko"
                  ? "12살 때 처음 프로그래밍을 시작했습니다. 게임을 만들고 싶었고, 그 호기심이 저를 여기까지 이끌었습니다."
                  : "I started programming at age 12. I wanted to make games, and that curiosity led me here."}
              </p>
              <p>
                {locale === "ko"
                  ? "저는 블록체인을 만들기 위해 커리어를 시작하지 않았습니다."
                  : "I didn't start my career wanting to build blockchain."}
              </p>
              <p className="text-gray-400">
                {locale === "ko"
                  ? "더 근본적인 문제를 해결하려고 했습니다: \"복잡한 공급망에서 기업이 재료의 출처, 품질, 일관성을 어떻게 신뢰할 수 있을까?\""
                  : '"How can companies trust the origin, quality, and consistency of materials across complex supply chains?"'}
              </p>
              <p>
                {locale === "ko"
                  ? "오늘날 저는 글로벌 제조업체가 재활용 원료를 안전하게 조달하기 위해 의존하는 신뢰 인프라를 구축합니다. 수집부터 펠릿화, 선적까지 모든 단계가 검증 가능하고, 변조 불가능하며, 일관된 데이터로 지원됩니다."
                  : "Today, I build the trust infrastructure that global manufacturers rely on to source recycled materials safely. Every step—from collection to pelletizing to shipment—is supported by verifiable, tamper-proof, and consistent data."}
              </p>
              <div className="pt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded border border-primary-500/30">
                  {locale === "ko" ? "공급망 검증" : "Supply Chain Verification"}
                </span>
                <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                  {locale === "ko" ? "영지식증명" : "Zero-Knowledge Proofs"}
                </span>
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30">
                  {locale === "ko" ? "고성능 원장" : "High-Performance Ledger"}
                </span>
                <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                  CES Best Innovation Award
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Bar - 이더스캔 스타일 (심플하게) */}
        <section className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 text-sm">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium">Available for Hire</span>
              </div>

              <div className="hidden md:block w-px h-4 bg-gray-700" />

              {/* Papers - 강조 */}
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">5+</span>
                <span className="text-gray-400">Papers</span>
                <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                  IEEE · KCI
                </span>
              </div>

              <div className="hidden md:block w-px h-4 bg-gray-700" />

              {/* Performance */}
              <div className="flex items-center gap-2 text-gray-400">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">26x</span>
                <span>TPS {locale === "ko" ? "최적화" : "Optimization"}</span>
              </div>

              <div className="hidden md:block w-px h-4 bg-gray-700" />

              {/* TTA */}
              <div className="flex items-center gap-2 text-gray-400">
                <span className="px-2 py-0.5 text-xs bg-primary-500/20 text-primary-400 rounded border border-primary-500/30">
                  TTA {locale === "ko" ? "인증" : "Certified"}
                </span>
              </div>

              <div className="hidden md:block w-px h-4 bg-gray-700" />

              {/* Stats */}
              <div className="flex items-center gap-4 text-gray-400">
                <span>{personalInfo.totalExperience[locale]}</span>
                <span>•</span>
                <span>{totalProjects} {locale === "ko" ? "프로젝트" : "Projects"}</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Latest Blocks & Transactions - 이더스캔 메인 페이지 스타일 */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Latest Blocks (Experiences) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-primary-400" />
                  Latest Blocks
                </h2>
                <span className="text-xs text-gray-500">Experience</span>
              </div>

              <div className="divide-y divide-gray-800">
                {latestBlocks.map((block) => (
                  <div key={block.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex w-12 h-12 bg-gray-800 rounded-lg items-center justify-center">
                        <Box className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/${locale}/blocks`}
                            className="text-primary-400 hover:text-primary-300 font-mono"
                          >
                            {block.blockNumber}
                          </Link>
                          {block.current && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-green-900/50 text-green-400 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          Miner:{" "}
                          <Link
                            href={`/${locale}/address`}
                            className="text-white hover:text-primary-400"
                          >
                            {block.company[locale]}
                          </Link>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {block.period}
                        </div>
                        <div className="text-xs text-gray-500">
                          {block.txCount} achievements
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={`/${locale}/blocks`}
                className="block px-6 py-3 bg-gray-800/50 text-center text-sm text-gray-400 hover:text-white transition-colors uppercase font-medium"
              >
                View all blocks
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </Link>
            </motion.div>

            {/* Latest Transactions (Projects) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-400" />
                  Latest Transactions
                </h2>
                <span className="text-xs text-gray-500">Projects</span>
              </div>

              <div className="divide-y divide-gray-800">
                {latestTxs.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex w-12 h-12 bg-gray-800 rounded-lg items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/${locale}/txs`}
                            className="text-primary-400 hover:text-primary-300 font-mono text-sm"
                          >
                            {tx.hash}
                          </Link>
                          {tx.status === "success" ? (
                            <span className="px-1.5 py-0.5 text-[10px] bg-green-900/50 text-green-400 rounded">
                              Success
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] bg-yellow-900/50 text-yellow-400 rounded animate-pulse">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-white">{tx.name[locale]}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tx.period}
                        </div>
                        <div className="flex gap-1 justify-end mt-1">
                          {tx.tech.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={`/${locale}/txs`}
                className="block px-6 py-3 bg-gray-800/50 text-center text-sm text-gray-400 hover:text-white transition-colors uppercase font-medium"
              >
                View all transactions
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Skills Section - Token Holdings Style */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Token Holdings</h2>
              <span className="text-xs text-gray-500">Skills & Technologies</span>
            </div>

            <div className="p-6 grid md:grid-cols-3 gap-6">
              {skills.map((category) => (
                <div key={category.category}>
                  <div className="text-xs text-gray-500 uppercase mb-3">
                    {category.category}
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                      >
                        <span className="text-sm text-white">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${item.level}%` }}
                            />
                          </div>
                          <span className="text-xs text-primary-400 w-8">
                            {item.level}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/address`}
              className="block px-6 py-3 bg-gray-800/50 text-center text-sm text-gray-400 hover:text-white transition-colors uppercase font-medium"
            >
              View Full Profile
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
