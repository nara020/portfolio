"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FileText, Compass, Globe } from "lucide-react";

// 동적 import로 3D 씬 로드 (SSR 비활성화)
const Scene3D = dynamic(() => import("@/components/intro/Scene3D"), {
  ssr: false,
  loading: () => null,
});

export default function IntroPage() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"singularity" | "bigbang" | "wormhole" | "universe">("singularity");
  const [showUI, setShowUI] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"ko" | "en" | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSingularityClick = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    setPhase("bigbang");
    setTimeout(() => setPhase("wormhole"), 1500);
  };

  const handleWormholeComplete = () => {
    setPhase("universe");
    setTimeout(() => setShowUI(true), 500);
  };

  const text = {
    ko: {
      simple: "Simple Resume",
      simpleDesc: "전통적인 이력서 형식으로\n깔끔하게 보기",
      explorer: "JinhyeokScan",
      explorerDesc: "Etherscan 스타일로\n블록체인처럼 탐험하기",
      choosePath: "어떤 방식으로 보시겠어요?",
    },
    en: {
      simple: "Simple Resume",
      simpleDesc: "Traditional resume format\nClean and clear",
      explorer: "JinhyeokScan",
      explorerDesc: "Etherscan-style portfolio\nExplore like blockchain",
      choosePath: "How would you like to view?",
    },
  };

  const t = selectedLang ? text[selectedLang] : text.en;

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative cursor-crosshair">
      {/* 플래시 효과 */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="absolute inset-0 bg-white z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Scene3D
          phase={phase}
          onSingularityClick={handleSingularityClick}
          onWormholeComplete={handleWormholeComplete}
        />
      </div>

      {/* Phase 1: 특이점 힌트 */}
      {phase === "singularity" && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.p
            className="text-gray-600 text-sm tracking-wider"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click the singularity to begin
          </motion.p>
          <motion.div
            className="mt-4 text-cyan-500/50 text-xs"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↑
          </motion.div>
        </motion.div>
      )}

      {/* 그라데이션 오버레이 */}
      {phase === "universe" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%)]" />
        </div>
      )}

      {/* UI 콘텐츠 */}
      <AnimatePresence mode="wait">
        {showUI && !selectedLang && (
          <motion.div
            key="lang-select"
            className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
                style={{ filter: "drop-shadow(0 0 40px rgba(34, 211, 238, 0.6))" }}
              >
                Jinhyeok Kim
              </span>
            </motion.h1>

            <motion.div
              className="text-xl md:text-3xl font-light mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-cyan-400">Blockchain</span>
              <span className="text-gray-400"> Developer</span>
            </motion.div>

            <motion.p
              className="text-sm text-gray-500 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Hyperledger · ZKP · Solidity · 3+ Years
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Select Language / 언어 선택
              </p>

              <div className="flex gap-6 justify-center">
                {["en", "ko"].map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => setSelectedLang(lang as "en" | "ko")}
                    className="group relative px-12 py-6 rounded-xl overflow-hidden backdrop-blur-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 group-hover:from-cyan-600/20 group-hover:to-purple-600/20 transition-all duration-300" />
                    <div className="absolute inset-0 border border-cyan-500/20 group-hover:border-cyan-400/50 rounded-xl transition-colors duration-300" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative text-white font-medium text-lg">
                      {lang === "en" ? "English" : "한국어"}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showUI && selectedLang && (
          <motion.div
            key="path-select"
            className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ filter: "drop-shadow(0 0 30px rgba(34, 211, 238, 0.5))" }}
              >
                Jinhyeok Kim
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-400 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t.choosePath}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 sm:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href={`/${selectedLang}/simple`} className="group">
                <motion.div
                  className="relative p-8 rounded-2xl w-72 text-center overflow-hidden backdrop-blur-md"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gray-900/60 border border-gray-700 group-hover:border-gray-500 rounded-2xl transition-colors" />
                  <div className="relative z-10">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-white transition-colors" />
                    <h2 className="text-xl font-bold text-white mb-2">{t.simple}</h2>
                    <p className="text-sm text-gray-500 whitespace-pre-line">{t.simpleDesc}</p>
                  </div>
                </motion.div>
              </Link>

              <div className="hidden sm:flex items-center text-gray-600">or</div>

              <Link href={`/${selectedLang}`} className="group">
                <motion.div
                  className="relative p-8 rounded-2xl w-72 text-center overflow-hidden backdrop-blur-md"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gray-900/60 border border-cyan-500/30 group-hover:border-cyan-400/60 rounded-2xl transition-colors" />
                  <div className="relative z-10">
                    <Compass className="w-12 h-12 mx-auto mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    <h2 className="text-xl font-bold text-white mb-2">
                      {t.explorer}
                      <span className="text-cyan-400 text-xs ml-1">Explorer</span>
                    </h2>
                    <p className="text-sm text-gray-500 whitespace-pre-line">{t.explorerDesc}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.button
              onClick={() => setSelectedLang(null)}
              className="mt-8 text-xs text-gray-600 hover:text-cyan-400 transition-colors flex items-center gap-1 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Globe className="w-3 h-3" />
              {selectedLang === "ko" ? "Change Language" : "언어 변경"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 하단 힌트 */}
      {phase === "universe" && showUI && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
          Move your mouse to explore the universe
        </motion.div>
      )}
    </div>
  );
}
