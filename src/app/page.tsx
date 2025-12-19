"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FileText, Compass, Sparkles, Globe } from "lucide-react";

// 떠다니는 블록 컴포넌트
function FloatingBlock({ delay, size, x, y, duration }: {
  delay: number;
  size: number;
  x: number;
  y: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/30 backdrop-blur-sm"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.6, 0.4, 0.6, 0],
        scale: [0.5, 1, 0.8, 1, 0.5],
        rotate: [0, 90, 180, 270, 360],
        y: [0, -30, 10, -20, 0],
        x: [0, 10, -10, 5, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-primary-400/50 text-xs font-mono">
        {Math.random() > 0.5 ? "0x" : "{ }"}
      </div>
    </motion.div>
  );
}

// 별 컴포넌트
function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.2, 0.8, 0.2] }}
      transition={{
        duration: 2 + Math.random() * 2,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// 체인 연결선
function ChainLink({ from, to, delay }: { from: { x: number; y: number }; to: { x: number; y: number }; delay: number }) {
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ delay: delay + 1, duration: 1 }}
    >
      <motion.line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke="url(#chainGradient)"
        strokeWidth="1"
        strokeDasharray="5,5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: delay + 1.5 }}
      />
      <defs>
        <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

export default function IntroPage() {
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"ko" | "en" | null>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 블록 위치 데이터
  const blocks = [
    { delay: 0, size: 60, x: 10, y: 20, duration: 8 },
    { delay: 0.5, size: 40, x: 85, y: 15, duration: 10 },
    { delay: 1, size: 50, x: 75, y: 70, duration: 9 },
    { delay: 1.5, size: 35, x: 15, y: 75, duration: 11 },
    { delay: 2, size: 45, x: 50, y: 10, duration: 7 },
    { delay: 2.5, size: 55, x: 90, y: 50, duration: 12 },
    { delay: 3, size: 30, x: 5, y: 45, duration: 8 },
    { delay: 3.5, size: 65, x: 60, y: 80, duration: 10 },
  ];

  // 별 위치 데이터
  const stars = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  // 체인 연결
  const chains = [
    { from: { x: 12, y: 22 }, to: { x: 50, y: 12 }, delay: 0 },
    { from: { x: 50, y: 12 }, to: { x: 87, y: 17 }, delay: 0.5 },
    { from: { x: 87, y: 17 }, to: { x: 92, y: 52 }, delay: 1 },
    { from: { x: 17, y: 77 }, to: { x: 62, y: 82 }, delay: 1.5 },
  ];

  if (!mounted) return null;

  const text = {
    ko: {
      welcome: "포트폴리오에 오신 것을 환영합니다",
      simple: "Simple Resume",
      simpleDesc: "전통적인 이력서 형식으로\n깔끔하게 보기",
      simpleTag: "→ 간결하고 명확하게",
      explorer: "JinhyeokScan",
      explorerDesc: "Etherscan 스타일로\n블록체인처럼 탐험하기",
      explorerTag: "→ 인터랙티브 경험 ✨",
      chooseLang: "언어를 선택하세요",
      choosePath: "어떤 방식으로 보시겠어요?",
    },
    en: {
      welcome: "Welcome to my Portfolio",
      simple: "Simple Resume",
      simpleDesc: "Traditional resume format\nClean and clear",
      simpleTag: "→ Classic & Clean",
      explorer: "JinhyeokScan",
      explorerDesc: "Etherscan-style portfolio\nExplore like blockchain",
      explorerTag: "→ Interactive Experience ✨",
      chooseLang: "Select Language",
      choosePath: "How would you like to view?",
    },
  };

  const t = selectedLang ? text[selectedLang] : text.en;

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden relative">
      {/* 우주 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />

      {/* 별들 */}
      {stars.map((star, i) => (
        <Star key={i} {...star} />
      ))}

      {/* 체인 연결선 */}
      {chains.map((chain, i) => (
        <ChainLink key={i} {...chain} />
      ))}

      {/* 떠다니는 블록들 */}
      {blocks.map((block, i) => (
        <FloatingBlock key={i} {...block} />
      ))}

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {showContent && !selectedLang && (
            <motion.div
              key="lang-select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* 타이틀 */}
              <motion.div
                className="flex items-center justify-center gap-2 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-xs tracking-[0.3em] text-primary-400 uppercase">
                  Welcome to my universe
                </span>
                <Sparkles className="w-4 h-4 text-primary-400" />
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span className="text-white">Jinhyeok Kim</span>
              </motion.h1>

              <motion.div
                className="text-xl md:text-2xl lg:text-3xl font-light text-gray-400 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <span className="text-primary-400">Blockchain</span> Developer
              </motion.div>

              {/* 언어 선택 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  Select Language / 언어 선택
                </p>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={() => setSelectedLang("en")}
                    className="px-8 py-4 rounded-xl border border-gray-600 bg-gray-900/50 backdrop-blur-sm
                               hover:border-primary-500 hover:bg-gray-800/50 transition-all duration-300
                               text-white font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    English
                  </motion.button>

                  <motion.button
                    onClick={() => setSelectedLang("ko")}
                    className="px-8 py-4 rounded-xl border border-gray-600 bg-gray-900/50 backdrop-blur-sm
                               hover:border-primary-500 hover:bg-gray-800/50 transition-all duration-300
                               text-white font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    한국어
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showContent && selectedLang && (
            <motion.div
              key="path-select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* 타이틀 */}
              <motion.div
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-xs tracking-[0.3em] text-primary-400 uppercase">
                  {t.welcome}
                </span>
                <Sparkles className="w-4 h-4 text-primary-400" />
              </motion.div>

              <motion.h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-white">Jinhyeok Kim</span>
              </motion.h1>

              <motion.div
                className="text-lg md:text-xl text-gray-400 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="text-primary-400">Blockchain</span> Developer
              </motion.div>

              <motion.p
                className="text-xs text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Hyperledger · ZKP · Solidity · 3+ Years
              </motion.p>

              {/* 경로 선택 질문 */}
              <motion.p
                className="text-sm text-gray-400 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {t.choosePath}
              </motion.p>

              {/* 두 갈래 길 선택 */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 sm:gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {/* Simple Resume 경로 */}
                <Link href={`/${selectedLang}/simple`} className="group">
                  <motion.div
                    className="relative p-8 rounded-2xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm
                               hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300
                               w-72 text-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-white transition-colors" />

                    <h2 className="text-xl font-bold text-white mb-2">{t.simple}</h2>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors whitespace-pre-line">
                      {t.simpleDesc}
                    </p>

                    <div className="mt-4 text-xs text-gray-600 group-hover:text-gray-400">
                      {t.simpleTag}
                    </div>
                  </motion.div>
                </Link>

                {/* Divider */}
                <div className="hidden sm:flex items-center">
                  <div className="text-gray-600 text-sm">or</div>
                </div>

                {/* Explorer 경로 */}
                <Link href={`/${selectedLang}`} className="group">
                  <motion.div
                    className="relative p-8 rounded-2xl border border-primary-600/50 bg-gray-900/50 backdrop-blur-sm
                               hover:border-primary-500 hover:bg-primary-900/20 transition-all duration-300
                               w-72 text-center overflow-hidden"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* 글로우 이펙트 */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-primary-400/20 to-primary-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />

                    <Compass className="w-12 h-12 mx-auto mb-4 text-primary-400 group-hover:text-primary-300 transition-colors" />

                    <h2 className="text-xl font-bold text-white mb-2">
                      {t.explorer}
                      <span className="text-primary-400 text-xs ml-1">Explorer</span>
                    </h2>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors whitespace-pre-line">
                      {t.explorerDesc}
                    </p>

                    <div className="mt-4 text-xs text-primary-500 group-hover:text-primary-400">
                      {t.explorerTag}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>

              {/* 언어 변경 버튼 */}
              <motion.button
                onClick={() => setSelectedLang(null)}
                className="mt-8 text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1 mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Globe className="w-3 h-3" />
                {selectedLang === "ko" ? "Change Language" : "언어 변경"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
