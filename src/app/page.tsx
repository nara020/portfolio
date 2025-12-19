"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { FileText, Compass, Globe, Code, Database, Shield, Cpu, Box, Hexagon, CircuitBoard } from "lucide-react";

// 시드 기반 랜덤
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 블록체인 아이콘들
const blockIcons = [Code, Database, Shield, Cpu, Box, Hexagon, CircuitBoard];

export default function IntroPage() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"loading" | "reveal" | "content">("loading");
  const [selectedLang, setSelectedLang] = useState<"ko" | "en" | null>(null);

  // 마우스 추적
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  // 3D 회전 변환
  const rotateX = useTransform(smoothY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);

  // 네뷸러 패럴랙스 (hooks must be at top level)
  const nebulaX = useTransform(smoothX, [0, 1], [-20, 20]);
  const nebulaY = useTransform(smoothY, [0, 1], [-20, 20]);

  // 별 레이어 패럴랙스
  const starLayer0X = useTransform(smoothX, [0, 1], [-30, 30]);
  const starLayer0Y = useTransform(smoothY, [0, 1], [-30, 30]);
  const starLayer1X = useTransform(smoothX, [0, 1], [-60, 60]);
  const starLayer1Y = useTransform(smoothY, [0, 1], [-60, 60]);
  const starLayer2X = useTransform(smoothX, [0, 1], [-90, 90]);
  const starLayer2Y = useTransform(smoothY, [0, 1], [-90, 90]);
  const starLayerTransforms = [
    { x: starLayer0X, y: starLayer0Y },
    { x: starLayer1X, y: starLayer1Y },
    { x: starLayer2X, y: starLayer2Y },
  ];

  // 행성 패럴랙스 (size 기반: 80, 120, 50)
  const planet0X = useTransform(smoothX, [0, 1], [-20, 20]);
  const planet0Y = useTransform(smoothY, [0, 1], [-20, 20]);
  const planet1X = useTransform(smoothX, [0, 1], [-30, 30]);
  const planet1Y = useTransform(smoothY, [0, 1], [-30, 30]);
  const planet2X = useTransform(smoothX, [0, 1], [-12.5, 12.5]);
  const planet2Y = useTransform(smoothY, [0, 1], [-12.5, 12.5]);
  const planetTransforms = [
    { x: planet0X, y: planet0Y },
    { x: planet1X, y: planet1Y },
    { x: planet2X, y: planet2Y },
  ];

  useEffect(() => {
    setMounted(true);
    // 로딩 → 리빌 → 콘텐츠
    const t1 = setTimeout(() => setPhase("reveal"), 500);
    const t2 = setTimeout(() => setPhase("content"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // 별 데이터
  const stars = useMemo(() =>
    Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 1.1) * 100,
      y: seededRandom(i * 2.2) * 100,
      size: seededRandom(i * 3.3) * 2 + 0.5,
      opacity: seededRandom(i * 4.4) * 0.7 + 0.3,
      duration: seededRandom(i * 5.5) * 4 + 2,
      layer: i % 3,
    })), []
  );

  // 블록체인 큐브들 (여러 체인)
  const blockchainChains = useMemo(() => [
    // 메인 체인 (중앙 상단에서 하단으로)
    { id: "main", blocks: 6, startX: 15, startY: 20, angle: 25, speed: 20, delay: 0, scale: 1 },
    // 두번째 체인 (오른쪽)
    { id: "right", blocks: 5, startX: 70, startY: 15, angle: -15, speed: 25, delay: 0.5, scale: 0.8 },
    // 세번째 체인 (왼쪽 하단)
    { id: "left", blocks: 4, startX: 5, startY: 60, angle: 10, speed: 22, delay: 1, scale: 0.7 },
    // 네번째 체인 (오른쪽 하단)
    { id: "bottom", blocks: 5, startX: 55, startY: 70, angle: -20, speed: 18, delay: 1.5, scale: 0.6 },
  ], []);

  // 행성들
  const planets = useMemo(() => [
    { id: 0, x: 85, y: 25, size: 80, color: "from-blue-400/30 to-cyan-500/20", blur: 20 },
    { id: 1, x: 10, y: 70, size: 120, color: "from-purple-500/20 to-pink-500/10", blur: 30 },
    { id: 2, x: 75, y: 75, size: 50, color: "from-indigo-400/25 to-blue-500/15", blur: 15 },
  ], []);

  const text = {
    ko: {
      welcome: "포트폴리오에 오신 것을 환영합니다",
      simple: "Simple Resume",
      simpleDesc: "전통적인 이력서 형식으로\n깔끔하게 보기",
      explorer: "JinhyeokScan",
      explorerDesc: "Etherscan 스타일로\n블록체인처럼 탐험하기",
      choosePath: "어떤 방식으로 보시겠어요?",
    },
    en: {
      welcome: "Welcome to my Portfolio",
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
      {/* 우주 네뷸러 배경 */}
      <div className="absolute inset-0">
        {/* 기본 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

        {/* 보라/파랑 네뷸러 */}
        <motion.div
          className="absolute inset-0"
          style={{ x: nebulaX, y: nebulaY }}
        >
          <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
          <div className="absolute top-1/4 right-0 w-[600px] h-[500px] bg-blue-600/25 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />
        </motion.div>

        {/* 은하수 느낌 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
      </div>

      {/* 행성들 */}
      {planets.map((planet, index) => (
        <motion.div
          key={planet.id}
          className={`absolute rounded-full bg-gradient-to-br ${planet.color}`}
          style={{
            width: planet.size,
            height: planet.size,
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            filter: `blur(${planet.blur}px)`,
            x: planetTransforms[index]?.x,
            y: planetTransforms[index]?.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: planet.id * 0.3 }}
        />
      ))}

      {/* 별들 - 3개 레이어 패럴랙스 */}
      {[0, 1, 2].map((layer) => (
        <motion.div
          key={layer}
          className="absolute inset-0 pointer-events-none"
          style={{
            x: starLayerTransforms[layer]?.x,
            y: starLayerTransforms[layer]?.y,
          }}
        >
          {stars.filter((s) => s.layer === layer).map((star) => (
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
                opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
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

      {/* 블록체인 체인들 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
      >
        {blockchainChains.map((chain) => (
          <motion.div
            key={chain.id}
            className="absolute"
            style={{
              left: `${chain.startX}%`,
              top: `${chain.startY}%`,
              transform: `rotate(${chain.angle}deg)`,
            }}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: chain.delay }}
          >
            {Array.from({ length: chain.blocks }).map((_, blockIndex) => {
              const IconComponent = blockIcons[blockIndex % blockIcons.length];
              return (
                <motion.div
                  key={blockIndex}
                  className="absolute"
                  style={{
                    left: blockIndex * 80 * chain.scale,
                    top: blockIndex * 30 * chain.scale,
                  }}
                >
                  {/* 체인 연결선 */}
                  {blockIndex > 0 && (
                    <motion.div
                      className="absolute bg-gradient-to-r from-cyan-500/50 to-blue-500/50"
                      style={{
                        width: 70 * chain.scale,
                        height: 2,
                        left: -65 * chain.scale,
                        top: 25 * chain.scale,
                        transformOrigin: "left center",
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: chain.delay + blockIndex * 0.2 }}
                    />
                  )}

                  {/* 블록 큐브 */}
                  <motion.div
                    className="relative"
                    style={{ width: 50 * chain.scale, height: 50 * chain.scale }}
                    initial={{ opacity: 0, scale: 0, rotateY: -90 }}
                    animate={{
                      opacity: [0.6, 0.9, 0.6],
                      scale: 1,
                      rotateY: 0,
                      y: [0, -10, 0],
                    }}
                    transition={{
                      opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 0.5, delay: chain.delay + blockIndex * 0.2 },
                      rotateY: { duration: 0.5, delay: chain.delay + blockIndex * 0.2 },
                      y: { duration: 4 + blockIndex, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    {/* 큐브 면 - 위 */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-blue-500/30 border border-cyan-400/50 rounded-lg backdrop-blur-sm"
                      style={{
                        transform: "rotateX(45deg) translateY(-5px)",
                        boxShadow: "0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.1)",
                      }}
                    />
                    {/* 큐브 면 - 앞 */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-indigo-600/40 border border-blue-400/60 rounded-lg backdrop-blur-sm flex items-center justify-center"
                      style={{
                        boxShadow: "0 0 30px rgba(59, 130, 246, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      <IconComponent
                        className="text-cyan-300/80"
                        style={{ width: 20 * chain.scale, height: 20 * chain.scale }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </motion.div>

      {/* 글로우 파티클 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${seededRandom(i * 10) * 100}%`,
            top: `${seededRandom(i * 20) * 100}%`,
            boxShadow: "0 0 10px 2px rgba(34, 211, 238, 0.6)",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -50, -100],
          }}
          transition={{
            duration: 3 + seededRandom(i * 30) * 2,
            repeat: Infinity,
            delay: seededRandom(i * 40) * 3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {/* 로딩/리빌 페이즈 */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              className="flex flex-col items-center"
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                ⟨ JK /⟩
              </motion.div>
            </motion.div>
          )}

          {/* 콘텐츠 페이즈 */}
          {phase === "content" && !selectedLang && (
            <motion.div
              key="lang-select"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* 글로우 타이틀 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
                    style={{
                      textShadow: "0 0 60px rgba(34, 211, 238, 0.5), 0 0 120px rgba(59, 130, 246, 0.3)",
                      filter: "drop-shadow(0 0 30px rgba(34, 211, 238, 0.4))"
                    }}
                  >
                    Jinhyeok Kim
                  </span>
                </h1>
              </motion.div>

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

              {/* 언어 선택 */}
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
                      className="group relative px-10 py-5 rounded-xl overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* 배경 글로우 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 border border-cyan-500/30 group-hover:border-cyan-400/60 rounded-xl transition-colors duration-300" />
                      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md rounded-xl" />

                      {/* 글로우 효과 */}
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

          {/* 경로 선택 */}
          {phase === "content" && selectedLang && (
            <motion.div
              key="path-select"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ filter: "drop-shadow(0 0 20px rgba(34, 211, 238, 0.4))" }}
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
                {/* Simple Resume */}
                <Link href={`/${selectedLang}/simple`} className="group">
                  <motion.div
                    className="relative p-8 rounded-2xl w-72 text-center overflow-hidden"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md border border-gray-700 group-hover:border-gray-500 rounded-2xl transition-colors" />
                    <div className="relative z-10">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-white transition-colors" />
                      <h2 className="text-xl font-bold text-white mb-2">{t.simple}</h2>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.simpleDesc}</p>
                    </div>
                  </motion.div>
                </Link>

                <div className="hidden sm:flex items-center text-gray-600">or</div>

                {/* Explorer */}
                <Link href={`/${selectedLang}`} className="group">
                  <motion.div
                    className="relative p-8 rounded-2xl w-72 text-center overflow-hidden"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* 글로우 배경 */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 group-hover:border-cyan-400/60 rounded-2xl transition-colors" />
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
      </div>

      {/* 하단 힌트 */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
        Move your mouse to explore
      </motion.div>
    </div>
  );
}
