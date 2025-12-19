"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { FileText, Compass, Sparkles, Globe } from "lucide-react";

// 시드 기반 랜덤 (일관된 값)
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function IntroPage() {
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"ko" | "en" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 마우스 위치 추적
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 부드러운 움직임
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // 마우스 이동 핸들러
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // -1 ~ 1 범위로 정규화
      mouseX.set((clientX / innerWidth - 0.5) * 2);
      mouseY.set((clientY / innerHeight - 0.5) * 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // 일관된 별 데이터 (시드 기반)
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 1.1) * 100,
      y: seededRandom(i * 2.2) * 100,
      size: seededRandom(i * 3.3) * 2 + 1,
      opacity: seededRandom(i * 4.4) * 0.5 + 0.3,
      duration: seededRandom(i * 5.5) * 3 + 2,
      layer: i % 3, // 0, 1, 2 레이어로 분류 (패럴랙스용)
    })), []
  );

  // 블록 데이터
  const blocks = useMemo(() => [
    { id: 0, delay: 0, size: 60, x: 10, y: 20, duration: 8 },
    { id: 1, delay: 0.5, size: 40, x: 85, y: 15, duration: 10 },
    { id: 2, delay: 1, size: 50, x: 75, y: 70, duration: 9 },
    { id: 3, delay: 1.5, size: 35, x: 15, y: 75, duration: 11 },
    { id: 4, delay: 2, size: 45, x: 50, y: 10, duration: 7 },
    { id: 5, delay: 2.5, size: 55, x: 90, y: 50, duration: 12 },
    { id: 6, delay: 3, size: 30, x: 5, y: 45, duration: 8 },
  ], []);

  const text = {
    ko: {
      welcome: "포트폴리오에 오신 것을 환영합니다",
      simple: "Simple Resume",
      simpleDesc: "전통적인 이력서 형식으로\n깔끔하게 보기",
      simpleTag: "→ 간결하고 명확하게",
      explorer: "JinhyeokScan",
      explorerDesc: "Etherscan 스타일로\n블록체인처럼 탐험하기",
      explorerTag: "→ 인터랙티브 경험 ✨",
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
      choosePath: "How would you like to view?",
    },
  };

  const t = selectedLang ? text[selectedLang] : text.en;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-950 overflow-hidden relative cursor-crosshair"
    >
      {/* 우주 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/30 via-transparent to-transparent" />

      {/* 별들 - 3개 레이어로 패럴랙스 */}
      {[0, 1, 2].map((layer) => (
        <motion.div
          key={layer}
          className="absolute inset-0"
          style={{
            x: smoothX.get() * (layer + 1) * -15,
            y: smoothY.get() * (layer + 1) * -15,
          }}
        >
          {stars
            .filter((star) => star.layer === layer)
            .map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  width: star.size,
                  height: star.size,
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                }}
                animate={{
                  opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
        </motion.div>
      ))}

      {/* 떠다니는 블록들 */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: smoothX.get() * -30,
          y: smoothY.get() * -30,
        }}
      >
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            className="absolute rounded-lg bg-gradient-to-br from-primary-500/30 to-primary-600/10 border border-primary-500/40 backdrop-blur-sm shadow-lg shadow-primary-500/10"
            style={{
              width: block.size,
              height: block.size,
              left: `${block.x}%`,
              top: `${block.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.7, 0.4, 0.6, 0.3],
              scale: [0.8, 1, 0.9, 1.1, 0.8],
              rotate: [0, 90, 180, 270, 360],
              y: [0, -20, 10, -15, 0],
            }}
            transition={{
              duration: block.duration,
              delay: block.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-primary-400/60 text-xs font-mono font-bold">
              {block.id % 2 === 0 ? "0x" : "{ }"}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 체인 연결선 (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <linearGradient id="chainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1="10%" y1="25%" x2="50%" y2="15%"
          stroke="url(#chainGrad)" strokeWidth="1" strokeDasharray="8,8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 1 }}
        />
        <motion.line
          x1="50%" y1="15%" x2="88%" y2="20%"
          stroke="url(#chainGrad)" strokeWidth="1" strokeDasharray="8,8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 1.5 }}
        />
        <motion.line
          x1="15%" y1="78%" x2="65%" y2="82%"
          stroke="url(#chainGrad)" strokeWidth="1" strokeDasharray="8,8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 2 }}
        />
      </svg>

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
                transition={{ duration: 0.5, delay: 0.2 }}
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
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="text-white drop-shadow-[0_0_30px_rgba(96,165,250,0.3)]">
                  Jinhyeok Kim
                </span>
              </motion.h1>

              <motion.div
                className="text-xl md:text-2xl lg:text-3xl font-light text-gray-400 mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <span className="text-primary-400">Blockchain</span> Developer
              </motion.div>

              {/* 언어 선택 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  Select Language / 언어 선택
                </p>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={() => setSelectedLang("en")}
                    className="px-8 py-4 rounded-xl border border-gray-600 bg-gray-900/70 backdrop-blur-md
                               hover:border-primary-500 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-primary-500/20
                               transition-all duration-300 text-white font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    English
                  </motion.button>

                  <motion.button
                    onClick={() => setSelectedLang("ko")}
                    className="px-8 py-4 rounded-xl border border-gray-600 bg-gray-900/70 backdrop-blur-md
                               hover:border-primary-500 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-primary-500/20
                               transition-all duration-300 text-white font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
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
                <span className="text-white drop-shadow-[0_0_30px_rgba(96,165,250,0.3)]">
                  Jinhyeok Kim
                </span>
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
                {/* Simple Resume */}
                <Link href={`/${selectedLang}/simple`} className="group">
                  <motion.div
                    className="relative p-8 rounded-2xl border border-gray-700 bg-gray-900/70 backdrop-blur-md
                               hover:border-gray-500 hover:bg-gray-800/70 transition-all duration-300
                               w-72 text-center shadow-xl"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
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

                <div className="hidden sm:flex items-center">
                  <div className="text-gray-600 text-sm">or</div>
                </div>

                {/* Explorer */}
                <Link href={`/${selectedLang}`} className="group">
                  <motion.div
                    className="relative p-8 rounded-2xl border border-primary-600/50 bg-gray-900/70 backdrop-blur-md
                               hover:border-primary-500 hover:bg-primary-900/30 transition-all duration-300
                               w-72 text-center overflow-hidden shadow-xl shadow-primary-500/10"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-primary-400/20 to-primary-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <Compass className="w-12 h-12 mx-auto mb-4 text-primary-400 group-hover:text-primary-300 transition-colors relative z-10" />
                    <h2 className="text-xl font-bold text-white mb-2 relative z-10">
                      {t.explorer}
                      <span className="text-primary-400 text-xs ml-1">Explorer</span>
                    </h2>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors whitespace-pre-line relative z-10">
                      {t.explorerDesc}
                    </p>
                    <div className="mt-4 text-xs text-primary-500 group-hover:text-primary-400 relative z-10">
                      {t.explorerTag}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>

              {/* 언어 변경 */}
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

      {/* 하단 힌트 */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-700 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="w-1 h-1 bg-primary-500 rounded-full animate-pulse" />
        Move your mouse to explore the universe
      </motion.div>
    </div>
  );
}
