/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// TYPES
// ==========================================
type IntroPhase =
  | "waiting"      // 클릭 대기
  | "genesis"      // 제네시스 블록 등장
  | "slowTps"      // 25 TPS - 느린 파티클
  | "optimizing"   // 최적화 중
  | "fastTps"      // 650 TPS - 빠른 파티클
  | "forming"      // 체인 형성
  | "finality"     // JINHYEOK 블록 확정
  | "entering";    // 진입 트랜지션

// 최종 블록 해시 (Etherscan UI로 전달)
const FINAL_BLOCK_HASH = "0xc2e8f5a91b3d7c4e6f8a2b1d9e0c3f5a7b8d1e4f";

// ==========================================
// AUDIO MANAGER
// ==========================================
function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playImpact = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      // Low bass impact
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(60, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio not supported
    }
  }, []);

  const playConfirmation = useCallback(() => {
    try {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;

      // Rising confirmation tone
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio not supported
    }
  }, []);

  return { playImpact, playConfirmation };
}

// ==========================================
// GENESIS BLOCK - 고급 금색 블록
// ==========================================
function GenesisBlock({
  visible,
  vibrating,
  exploding,
}: {
  visible: boolean;
  vibrating: boolean;
  exploding: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    const t = state.clock.elapsedTime;

    // 기본 회전
    groupRef.current.rotation.y = t * 0.3;

    // 진동 효과
    if (vibrating && !exploding) {
      groupRef.current.position.x = Math.sin(t * 50) * 0.02;
      groupRef.current.position.y = Math.cos(t * 40) * 0.02;

      // 코어 펄스
      if (coreRef.current) {
        const pulse = 1 + Math.sin(t * 10) * 0.15;
        coreRef.current.scale.setScalar(0.15 * pulse);
      }
    }

    // 폭발 시 스케일 다운
    if (exploding) {
      setScale(s => Math.max(s - 0.05, 0));
    }
  });

  if (!visible || scale <= 0) return null;

  return (
    <Float speed={vibrating ? 0 : 2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={scale}>
        {/* 외부 유리 큐브 */}
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.5}
            chromaticAberration={0.2}
            anisotropy={0.3}
            distortion={0.15}
            distortionScale={0.2}
            temporalDistortion={0.1}
            metalness={0.1}
            roughness={0}
            ior={2.5}
            color="#1a1a2e"
          />
        </mesh>

        {/* 엣지 글로우 */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.62, 0.62, 0.62)]} />
          <lineBasicMaterial color="#ffd700" transparent opacity={0.8} />
        </lineSegments>

        {/* 내부 빛나는 코어 */}
        <mesh ref={coreRef} scale={0.15}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>

        {/* 회전 링 */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.01, 16, 64]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
        </mesh>

        {/* 라이트 */}
        <pointLight position={[0, 0, 0]} intensity={3} color="#ffd700" distance={5} />
      </group>
    </Float>
  );
}

// ==========================================
// TPS PARTICLES - TPS 시각화 파티클
// ==========================================
function TpsParticles({
  tps,
  active,
  forming,
}: {
  tps: number;
  active: boolean;
  forming: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  const targetPositions = useRef<Float32Array>(new Float32Array(count * 3));

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 0.3 + Math.random() * 0.2;

      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(theta);

      vel[i * 3] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    return [pos, vel];
  }, []);

  useEffect(() => {
    if (forming) {
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 4;
        const radius = 0.8 + t * 0.3;
        const height = t * 3 - 1.5;

        targetPositions.current[i * 3] = Math.cos(angle) * radius;
        targetPositions.current[i * 3 + 1] = height;
        targetPositions.current[i * 3 + 2] = Math.sin(angle) * radius;
      }
    }
  }, [forming]);

  useFrame((state, delta) => {
    if (!particlesRef.current || !active) return;

    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const speed = tps / 100;

    for (let i = 0; i < count; i++) {
      if (forming) {
        posArray[i * 3] += (targetPositions.current[i * 3] - posArray[i * 3]) * delta * 2;
        posArray[i * 3 + 1] += (targetPositions.current[i * 3 + 1] - posArray[i * 3 + 1]) * delta * 2;
        posArray[i * 3 + 2] += (targetPositions.current[i * 3 + 2] - posArray[i * 3 + 2]) * delta * 2;
      } else {
        posArray[i * 3] += velocities[i * 3] * delta * speed;
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * speed;
        posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * speed;

        const dist = Math.sqrt(
          posArray[i * 3] ** 2 +
          posArray[i * 3 + 1] ** 2 +
          posArray[i * 3 + 2] ** 2
        );

        if (dist > 3) {
          velocities[i * 3] *= -0.8;
          velocities[i * 3 + 1] *= -0.8;
          velocities[i * 3 + 2] *= -0.8;
        }
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    if (!forming) {
      particlesRef.current.rotation.y += delta * 0.2 * (tps / 100);
    }
  });

  if (!active) return null;

  const color = tps < 100 ? "#ff4444" : tps < 300 ? "#ffaa00" : "#22d3ee";

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

// ==========================================
// FINAL CHAIN with JINHYEOK block
// ==========================================
function FinalChain({
  visible,
  entering,
}: {
  visible: boolean;
  entering: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const jinhyeokRef = useRef<THREE.Group>(null);
  const [blockScale, setBlockScale] = useState(0);

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setBlockScale(s => Math.min(s + 0.05, 1));
      }, 16);
      return () => clearInterval(interval);
    }
  }, [visible]);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;

    if (!entering) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }

    // JINHYEOK 블록 글로우 효과
    if (jinhyeokRef.current && entering) {
      const t = state.clock.elapsedTime;
      const pulse = 1 + Math.sin(t * 5) * 0.1;
      jinhyeokRef.current.scale.setScalar(0.35 * pulse * blockScale);
    }
  });

  if (!visible) return null;

  const blocks = [
    { id: 0, name: "GENESIS", y: -1.2, color: "#ffd700", scale: 0.25 },
    { id: 1, name: "#1", y: -0.6, color: "#22d3ee", scale: 0.2 },
    { id: 2, name: "#2", y: 0, color: "#22d3ee", scale: 0.2 },
    { id: 3, name: "JINHYEOK", y: 0.6, color: "#a855f7", scale: 0.35, special: true },
    { id: 4, name: "#4", y: 1.2, color: "#22d3ee", scale: 0.2 },
  ];

  return (
    <group ref={groupRef}>
      {blocks.map((block, i) => (
        <group
          key={block.id}
          ref={block.special ? jinhyeokRef : undefined}
          position={[0, block.y, 0]}
          scale={blockScale}
        >
          <mesh>
            <boxGeometry args={[block.scale, block.scale, block.scale]} />
            <meshStandardMaterial
              color={block.color}
              emissive={block.color}
              emissiveIntensity={block.special ? (entering ? 1.5 : 0.8) : 0.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(block.scale + 0.01, block.scale + 0.01, block.scale + 0.01)]} />
            <lineBasicMaterial color={block.color} transparent opacity={0.8} />
          </lineSegments>

          {i > 0 && (
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
              <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
            </mesh>
          )}

          {!entering && (
            <Text
              position={[block.scale / 2 + 0.15, 0, 0]}
              fontSize={block.special ? 0.08 : 0.04}
              color={block.color}
              anchorX="left"
              anchorY="middle"
            >
              {block.name}
            </Text>
          )}

          {block.special && (
            <pointLight
              position={[0, 0, 0]}
              intensity={entering ? 8 : 4}
              color="#a855f7"
              distance={entering ? 10 : 3}
            />
          )}
        </group>
      ))}
    </group>
  );
}

// ==========================================
// CAMERA CONTROLLER - Enhanced zoom
// ==========================================
function CameraController({
  phase,
  onZoomComplete,
}: {
  phase: IntroPhase;
  onZoomComplete: () => void;
}) {
  const { camera } = useThree();
  const zoomTriggered = useRef(false);
  const transitionProgress = useRef(0);

  useFrame((_, delta) => {
    let targetPos = { x: 0, y: 0, z: 4 };
    let targetLook = { x: 0, y: 0 };
    let speed = 0.02;

    switch (phase) {
      case "waiting":
        targetPos = { x: 0, y: 0, z: 3 };
        break;
      case "genesis":
        targetPos = { x: 0, y: 0, z: 2.5 };
        break;
      case "slowTps":
      case "optimizing":
        targetPos = { x: 1.5, y: 0.5, z: 3.5 };
        break;
      case "fastTps":
        targetPos = { x: -1, y: 0.3, z: 3 };
        break;
      case "forming":
        targetPos = { x: 2, y: 1, z: 4 };
        targetLook = { x: 0, y: 0.5 };
        break;
      case "finality":
        targetPos = { x: 0.5, y: 0.6, z: 2.5 };
        targetLook = { x: 0, y: 0.6 };
        break;
      case "entering":
        // 가속하며 JINHYEOK 블록으로 줌
        transitionProgress.current += delta * 0.5;
        speed = 0.02 + transitionProgress.current * 0.1;

        targetPos = { x: 0, y: 0.6, z: -0.5 };
        targetLook = { x: 0, y: 0.6 };

        if (camera.position.z < 0.3 && !zoomTriggered.current) {
          zoomTriggered.current = true;
          onZoomComplete();
        }
        break;
    }

    camera.position.x += (targetPos.x - camera.position.x) * speed;
    camera.position.y += (targetPos.y - camera.position.y) * speed;
    camera.position.z += (targetPos.z - camera.position.z) * speed;

    camera.lookAt(targetLook.x, targetLook.y, 0);
  });

  return null;
}

// ==========================================
// MAIN 3D SCENE
// ==========================================
function IntroScene({
  phase,
  tps,
  onZoomComplete,
}: {
  phase: IntroPhase;
  tps: number;
  onZoomComplete: () => void;
}) {
  const showGenesis = phase === "waiting" || phase === "genesis";
  const showParticles = ["slowTps", "optimizing", "fastTps", "forming"].includes(phase);
  const showChain = ["finality", "entering"].includes(phase);
  const isForming = phase === "forming";
  const isVibrating = phase === "genesis";
  const isExploding = phase === "slowTps";
  const isEntering = phase === "entering";

  return (
    <>
      <ambientLight intensity={0.1} />
      <spotLight position={[10, 10, 5]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" />
      <pointLight position={[-8, 3, -5]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[0, -5, 8]} intensity={0.5} color="#22d3ee" />

      <GenesisBlock visible={showGenesis} vibrating={isVibrating} exploding={isExploding} />
      <TpsParticles tps={tps} active={showParticles} forming={isForming} />
      <FinalChain visible={showChain} entering={isEntering} />

      <CameraController phase={phase} onZoomComplete={onZoomComplete} />

      <EffectComposer>
        <Bloom
          intensity={isEntering ? 2 : 1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(isEntering ? 0.003 : 0.001, isEntering ? 0.003 : 0.001)}
        />
        <Vignette eskil={false} offset={0.1} darkness={isEntering ? 0.9 : 0.6} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// TPS HUD
// ==========================================
function TpsHud({ tps, phase }: { tps: number; phase: IntroPhase }) {
  const showHud = ["slowTps", "optimizing", "fastTps"].includes(phase);
  const isOptimizing = phase === "optimizing";

  if (!showHud) return null;

  return (
    <motion.div
      className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-lg px-6 py-4 text-center">
        <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">
          {isOptimizing ? "Optimizing Algorithm..." : "Transaction Speed"}
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <motion.span
            className={`text-4xl font-mono font-bold ${
              tps < 100 ? "text-red-500" : tps < 300 ? "text-yellow-500" : "text-cyan-400"
            }`}
            key={tps}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            {tps}
          </motion.span>
          <span className="text-gray-500 text-sm">TPS</span>
        </div>

        {isOptimizing && (
          <motion.div
            className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ==========================================
// PHASE STATUS
// ==========================================
function PhaseStatus({ phase }: { phase: IntroPhase }) {
  if (phase === "waiting") return null;

  const messages: Record<IntroPhase, string> = {
    waiting: "",
    genesis: "Initializing Genesis Block...",
    slowTps: "Legacy System: 25 TPS",
    optimizing: "Applying Optimization Algorithm...",
    fastTps: "Optimized: 650 TPS",
    forming: "Building Blockchain...",
    finality: "Block Confirmed",
    entering: "Entering JinhyeokScan...",
  };

  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={phase}
    >
      <motion.p
        className="text-gray-400 text-sm tracking-widest uppercase font-mono"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {messages[phase]}
      </motion.p>
    </motion.div>
  );
}

// ==========================================
// INITIALIZE BUTTON
// ==========================================
function InitializeButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.button
        onClick={onClick}
        className="group relative px-8 py-4 font-mono text-sm tracking-widest uppercase"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 글로우 배경 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />

        {/* 메인 버튼 */}
        <div className="relative bg-gray-900/80 border border-cyan-500/50 group-hover:border-cyan-400 rounded-lg px-8 py-4 transition-all">
          <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
            [ INITIALIZE_SYSTEM ]
          </span>
        </div>

        {/* 펄스 링 */}
        <motion.div
          className="absolute inset-0 border border-cyan-500/30 rounded-lg"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      <motion.p
        className="text-center text-gray-600 text-xs mt-4 font-mono"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Click to begin proof-of-work
      </motion.p>
    </motion.div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function BlockchainIntro({
  onComplete,
}: {
  onComplete: (blockHash: string) => void;
}) {
  const [phase, setPhase] = useState<IntroPhase>("waiting");
  const [tps, setTps] = useState(25);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionColor, setTransitionColor] = useState("#a855f7"); // 보라색 (JINHYEOK 블록)
  const { playImpact, playConfirmation } = useAudio();

  // Initialize 버튼 클릭
  const handleInitialize = useCallback(() => {
    playImpact();
    setPhase("genesis");

    // 시퀀스 시작
    const sequence = async () => {
      // Genesis: 2초
      await new Promise(r => setTimeout(r, 2000));
      setPhase("slowTps");

      // Slow TPS: 2초
      await new Promise(r => setTimeout(r, 2000));
      setPhase("optimizing");

      // Optimizing: TPS 증가 애니메이션 (2초)
      const startTime = Date.now();
      const duration = 2000;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentTps = Math.round(25 + (650 - 25) * eased);
        setTps(currentTps);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          playConfirmation();
          setPhase("fastTps");
        }
      };
      animate();

      // Fast TPS: 1.5초
      await new Promise(r => setTimeout(r, 3500));
      setPhase("forming");

      // Forming: 2.5초
      await new Promise(r => setTimeout(r, 2500));
      playConfirmation();
      setPhase("finality");

      // Finality: 2초
      await new Promise(r => setTimeout(r, 2000));
      setPhase("entering");
    };

    sequence();
  }, [playImpact, playConfirmation]);

  // 줌 완료 핸들러
  const handleZoomComplete = useCallback(() => {
    setTransitioning(true);
    // 보라색 → 다크 배경으로 전환
    setTimeout(() => {
      setTransitionColor("#030308");
    }, 300);
    // 완료 콜백 (블록 해시 전달)
    setTimeout(() => {
      onComplete(FINAL_BLOCK_HASH);
    }, 800);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#030308] z-50">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#030308"]} />
        <fog attach="fog" args={["#030308", 3, 15]} />
        <IntroScene phase={phase} tps={tps} onZoomComplete={handleZoomComplete} />
      </Canvas>

      {/* Initialize Button (waiting phase only) */}
      <AnimatePresence>
        {phase === "waiting" && (
          <InitializeButton onClick={handleInitialize} />
        )}
      </AnimatePresence>

      {/* TPS HUD */}
      <AnimatePresence>
        <TpsHud tps={tps} phase={phase} />
      </AnimatePresence>

      {/* Phase Status */}
      <AnimatePresence mode="wait">
        <PhaseStatus phase={phase} />
      </AnimatePresence>

      {/* Transition Overlay - 보라색에서 시작 */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="absolute inset-0 z-30"
            style={{ backgroundColor: transitionColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Skip Button */}
      {phase !== "waiting" && (
        <motion.button
          className="absolute bottom-8 right-8 text-gray-600 hover:text-gray-400 text-xs uppercase tracking-widest z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => onComplete(FINAL_BLOCK_HASH)}
        >
          Skip Intro →
        </motion.button>
      )}
    </div>
  );
}
