"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Download,
} from "lucide-react";
import { experiences, projects, skills, contact, keyMetrics, awards, personalInfo } from "@/data/resume";
import { Header, Footer } from "@/components/sections";
import SearchModal from "@/components/SearchModal";
import BackgroundParticles from "@/components/ui/BackgroundParticles";
import BlockToast from "@/components/ui/BlockToast";
import EmailCopy from "@/components/ui/EmailCopy";

export default function Home() {
  const t = useTranslations("hero");
  const locale = useLocale() as "ko" | "en";
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [blockHash, setBlockHash] = useState("");
  const [fromIntro, setFromIntro] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [blockIndex, setBlockIndex] = useState(0);
  const [txIndex, setTxIndex] = useState(0);

  // Check if coming from intro
  useEffect(() => {
    setMounted(true);
    const isFromIntro = searchParams.get("fromIntro") === "true";
    const shouldShowToast = sessionStorage.getItem("show_intro_toast") === "true";
    const hash = sessionStorage.getItem("intro_block_hash") || "";

    if (isFromIntro && shouldShowToast) {
      setFromIntro(true);
      setBlockHash(hash);
      setShowToast(true);
      // Clear the flag
      sessionStorage.removeItem("show_intro_toast");
    }
  }, [searchParams]);

  // Rotation animation for Latest Blocks & Transactions
  useEffect(() => {
    const blockInterval = setInterval(() => {
      setBlockIndex((prev) => (prev + 1) % experiences.length);
    }, 4000);
    const txInterval = setInterval(() => {
      setTxIndex((prev) => (prev + 1) % projects.length);
    }, 3500);
    return () => {
      clearInterval(blockInterval);
      clearInterval(txInterval);
    };
  }, []);

  // Stats 계산
  const totalExperience = "3+";
  const totalProjects = projects.length;
  const totalSkills = skills.reduce((sum, cat) => sum + cat.items.length, 0);
  const totalAchievements = experiences.reduce(
    (sum, exp) => sum + exp.achievements[locale].length,
    0
  );

  // Latest blocks (experiences) - rotating display
  const getVisibleBlocks = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const idx = (blockIndex + i) % experiences.length;
      result.push({
        ...experiences[idx],
        blockNumber: parseInt(experiences[idx].period.split(".")[0]) * 1000 + idx,
        txCount: experiences[idx].achievements[locale].length,
      });
    }
    return result;
  };
  const latestBlocks = getVisibleBlocks();

  // Latest transactions (projects) - rotating display (featured only)
  const featuredProjects = projects.filter((p) => p.featured);
  const getVisibleTxs = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const idx = (txIndex + i) % featuredProjects.length;
      result.push({
        ...featuredProjects[idx],
        hash: `0x${featuredProjects[idx].id.replace(/-/g, "").padEnd(16, "0").slice(0, 16)}...`,
        status: featuredProjects[idx].period.includes("Present") ? "pending" : "success",
      });
    }
    return result;
  };
  const latestTxs = getVisibleTxs();

  // Boot-up animation variants
  const bootUpVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: fromIntro ? delay : 0,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <>
      {/* Background Particles - Visual continuity from intro */}
      {mounted && <BackgroundParticles intensity={fromIntro ? "normal" : "low"} />}

      {/* Block Confirmation Toast */}
      <BlockToast
        show={showToast}
        blockHash={blockHash}
        onClose={() => setShowToast(false)}
      />

      {/* Header with boot-up animation */}
      <motion.div
        initial={fromIntro ? "hidden" : "visible"}
        animate="visible"
        custom={0.1}
        variants={bootUpVariants}
      >
        <Header />
      </motion.div>

      <main className="min-h-screen bg-gray-950 relative z-10">
        {/* Hero Section - 이더스캔 스타일 */}
        <motion.section
          className="bg-gradient-to-b from-gray-900 to-gray-950 pt-32 pb-20"
          initial={fromIntro ? "hidden" : "visible"}
          animate="visible"
          custom={0.2}
          variants={bootUpVariants}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h1
                  className="text-2xl md:text-3xl font-bold text-white mb-4"
                  initial={fromIntro ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: fromIntro ? 0.3 : 0, duration: 0.8 }}
                >
                  The Blockchain Developer
                  <br />
                  <span className="text-primary-400">Explorer</span>
                </motion.h1>
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
                    <EmailCopy email={contact.email} />
                  </div>
                </div>
                <p className="text-sm text-primary-400 font-medium mb-2">{t("role")}</p>
                <p className="text-xs text-gray-400 mb-4">
                  {keyMetrics.papers.value} Papers (IEEE, KCI) · {keyMetrics.awards.value} Awards · {keyMetrics.tpsImprovement.value} TPS · {keyMetrics.projects.value} {locale === "ko" ? "프로젝트" : "Projects"}
                </p>
                <div className="flex gap-2 mb-3">
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
                {/* Resume Download */}
                <a
                  href={locale === "ko" ? "/resume/JinhyeokKim_Resume_KR.pdf" : "/resume/JinhyeokKim_Resume_EN.pdf"}
                  download
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg shadow-primary-500/25"
                >
                  <Download className="w-4 h-4" />
                  {locale === "ko" ? "이력서 다운로드 (PDF)" : "Download Resume (PDF)"}
                </a>
              </motion.div>
            </div>

            {/* Featured Project - Consensus Lab (Compact) */}
            <motion.a
              href="https://consensus-lab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/10 group cursor-pointer"
            >
              {/* Animated Mini Blocks */}
              <div className="relative w-16 h-12 flex items-center justify-center gap-1 flex-shrink-0">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: i === 0 ? '#f7931a' : i === 1 ? '#627eea' : i === 2 ? '#2c9ed4' : '#3c3c3d',
                    }}
                    animate={{
                      scale: [0.8, 1, 0.8],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    Consensus Lab
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-cyan-500/20 text-cyan-300 rounded font-medium">
                    NEW
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {locale === "ko" ? "PoW · PoS · RAFT · IBFT 3D 시각화" : "PoW · PoS · RAFT · IBFT 3D Visualizer"}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-cyan-400 text-sm flex-shrink-0">
                <span className="hidden sm:inline">{locale === "ko" ? "체험하기" : "Try it"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          </div>
        </motion.section>

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
              {/* Impact-first opening */}
              <p className="text-base font-medium text-white">
                {locale === "ko"
                  ? "블록체인 네트워크 성능을 27배 향상시킨 백엔드/블록체인 개발자입니다."
                  : "Backend/Blockchain Developer who achieved 27x performance improvement on blockchain networks."}
              </p>

              {/* Key achievement with context */}
              <p>
                {locale === "ko"
                  ? "Hyperledger Besu 기반 B2B 플랫폼에서 25TPS→678TPS 최적화를 주도했습니다. Java 21 Virtual Threads, Transaction Isolation Pattern, PM2 Cluster Mode를 적용한 3-Layer 최적화 방법론을 설계하여 서비스 레이어 병목을 해결했으며, 이 연구 결과를 국제학술대회(ICBTA 2025, Springer LNNS)에 1저자로 게재했습니다."
                  : "Led optimization of B2B platform from 25TPS to 678TPS on Hyperledger Besu. Designed 3-Layer optimization methodology using Java 21 Virtual Threads, Transaction Isolation Pattern, and PM2 Cluster Mode. Published as first author at ICBTA 2025 (Springer LNNS)."}
              </p>

              {/* Technical depth */}
              <p>
                {locale === "ko"
                  ? "CES Best Innovation Award 수상 기업(ZKP 전문)과 협업하며 영지식증명 기술을 습득했고, 이를 바탕으로 Groth16/snarkjs/circom 기반 개인 프로젝트를 설계·개발하고 있습니다. Rust 서킷 분석을 통한 복호화 성능 35초→1초 개선 경험이 있습니다."
                  : "Acquired ZKP expertise through collaboration with a CES Best Innovation Award-winning company, now designing and developing personal projects using Groth16/snarkjs/circom. Achieved 35s→1s decryption optimization through Rust circuit analysis."}
              </p>

              {/* Business impact */}
              <p className="text-gray-400">
                {locale === "ko"
                  ? "현재 글로벌 제조업체 대상 B2B 공급망 플랫폼의 핵심 블록체인 인프라를 개발하고 있습니다. EU DPP 규제 대응을 위한 ZKP 시스템 아키텍처 설계를 담당했습니다."
                  : "Currently building core blockchain infrastructure for B2B supply chain platform serving global manufacturers. Designed ZKP system architecture for EU DPP regulatory compliance."}
              </p>

              {/* Key metrics highlight */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-primary-950/50 to-purple-950/50 border border-primary-500/20 rounded-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary-400">27x</div>
                  <div className="text-[10px] text-gray-500">{locale === "ko" ? "TPS 향상" : "TPS Boost"}</div>
                  <div className="text-[9px] text-gray-600">25→678</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">35x</div>
                  <div className="text-[10px] text-gray-500">{locale === "ko" ? "ZKP 최적화" : "ZKP Speed"}</div>
                  <div className="text-[9px] text-gray-600">35s→1s</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">5+</div>
                  <div className="text-[10px] text-gray-500">{locale === "ko" ? "논문 게재" : "Papers"}</div>
                  <div className="text-[9px] text-gray-600">Springer · IEEE · KCI</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">🏆</div>
                  <div className="text-[10px] text-gray-500">CES 2025</div>
                  <div className="text-[9px] text-gray-600">Best Innovation</div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded border border-primary-500/30">
                  Hyperledger Besu/Fabric
                </span>
                <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                  ZKP (Groth16/snarkjs)
                </span>
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30">
                  {locale === "ko" ? "고성능 최적화" : "Performance Optimization"}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                  {locale === "ko" ? "1저자 논문 게재" : "First Author Publications"}
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
                  Springer · IEEE · KCI
                </span>
              </div>

              <div className="hidden md:block w-px h-4 bg-gray-700" />

              {/* Performance */}
              <div className="flex items-center gap-2 text-gray-400">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">27x</span>
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
                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-green-900/50 text-green-400 rounded border border-green-800">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                </h2>
                <span className="text-xs text-gray-500">Experience</span>
              </div>

              <div className="divide-y divide-gray-800">
                <AnimatePresence mode="popLayout">
                {latestBlocks.map((block, i) => (
                  <motion.div
                    key={`${block.id}-${blockIndex}`}
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                    className="p-4 hover:bg-gray-800/30 transition-colors"
                  >
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
                          <span className="text-white">
                            {block.company[locale]}
                          </span>
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
                  </motion.div>
                ))}
                </AnimatePresence>
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
                  <FileText className="w-5 h-5 text-yellow-400" />
                  Featured Transactions
                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-yellow-900/50 text-yellow-400 rounded border border-yellow-800">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                    Top {featuredProjects.length}
                  </span>
                </h2>
                <span className="text-xs text-gray-500">Key Projects</span>
              </div>

              <div className="divide-y divide-gray-800">
                <AnimatePresence mode="popLayout">
                {latestTxs.map((tx, i) => (
                  <motion.div
                    key={`${tx.id}-${txIndex}`}
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                    className="p-4 hover:bg-yellow-900/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex w-12 h-12 bg-yellow-900/30 rounded-lg items-center justify-center">
                        <FileText className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/${locale}/txs`}
                            className="text-yellow-400 hover:text-yellow-300 font-mono text-sm"
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
                              className="px-1.5 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-300 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
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

          </motion.div>
        </section>
      </main>
      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
