/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// TYPES
// ==========================================
type IntroPhase =
  | "chaos"       // Mempool - 혼돈의 바다
  | "aligning"    // 정렬 시작 - 중앙으로 빨려들어감
  | "forming"     // 체인 형성
  | "warping"     // 워프 스피드
  | "arriving"    // 착륙
  | "complete";

const PARTICLE_COUNT = 2500;
const FINAL_BLOCK_HASH = "0xc2e8f5a91b3d7c4e6f8a2b1d9e0c3f5a7b8d1e4f";

// ==========================================
// AUDIO
// ==========================================
function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playWhoosh = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      // Reverse cymbal / sucking sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(100, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.8);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(5000, ctx.currentTime + 0.8);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1);
    } catch (e) {}
  }, []);

  const playWarp = useCallback(() => {
    try {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;

      // Warp speed sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(80, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 2);

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 3);
    } catch (e) {}
  }, []);

  return { playWhoosh, playWarp };
}

// ==========================================
// MEMPOOL PARTICLES - InstancedMesh로 2500개 큐브
// ==========================================
function MempoolParticles({
  phase,
  mousePosition,
}: {
  phase: IntroPhase;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 각 파티클의 초기 위치, 속도, 타겟 위치
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 구형 분포
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 20 + Math.random() * 30;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // 체인 형성 시 타겟 위치 (나선형)
      const chainIndex = i / PARTICLE_COUNT;
      const chainAngle = chainIndex * Math.PI * 8;
      const chainRadius = 0.5 + chainIndex * 0.1;
      const chainZ = chainIndex * 100 - 50;

      data.push({
        position: new THREE.Vector3(x, y, z),
        originalPosition: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        targetPosition: new THREE.Vector3(
          Math.cos(chainAngle) * chainRadius,
          Math.sin(chainAngle) * chainRadius,
          chainZ
        ),
        scale: 0.05 + Math.random() * 0.1,
        speed: 0.5 + Math.random() * 0.5,
        alignDelay: Math.random() * 0.5,
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6),
      });
    }
    return data;
  }, []);

  // 컬러 어트리뷰트
  const colorArray = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    particleData.forEach((p, i) => {
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;
    });
    return colors;
  }, [particleData]);

  const alignStartTime = useRef(0);
  const warpProgress = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const mouse = mousePosition.current;

    particleData.forEach((particle, i) => {
      switch (phase) {
        case "chaos": {
          // 원래 위치 주변에서 부유
          particle.position.x = particle.originalPosition.x + Math.sin(time * particle.speed + i) * 0.5;
          particle.position.y = particle.originalPosition.y + Math.cos(time * particle.speed * 0.7 + i) * 0.5;
          particle.position.z = particle.originalPosition.z + Math.sin(time * particle.speed * 0.5 + i * 0.5) * 0.5;

          // 마우스 리펄전 (3D 공간에서)
          const mouseX = mouse.x * 30;
          const mouseY = mouse.y * 20;
          const dx = particle.position.x - mouseX;
          const dy = particle.position.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 8) {
            const force = (8 - dist) * 0.02;
            particle.position.x += dx * force * 0.1;
            particle.position.y += dy * force * 0.1;
          }
          break;
        }

        case "aligning": {
          // 중앙으로 빨려들어감
          if (alignStartTime.current === 0) alignStartTime.current = time;
          const elapsed = time - alignStartTime.current;
          const delay = particle.alignDelay;

          if (elapsed > delay) {
            const progress = Math.min((elapsed - delay) * 2, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            // 중앙(0,0,0)으로 이동
            particle.position.lerp(new THREE.Vector3(0, 0, 0), eased * 0.1);
          }
          break;
        }

        case "forming": {
          // 체인 형성 (나선형으로 정렬)
          particle.position.lerp(particle.targetPosition, delta * 3);
          break;
        }

        case "warping": {
          // 워프 - Z축으로 빠르게 이동 (카메라와 함께)
          warpProgress.current += delta * 0.3;
          particle.position.z -= delta * 50 * (1 + warpProgress.current);

          // 화면 밖으로 나가면 재배치
          if (particle.position.z < -100) {
            particle.position.z = 100;
          }
          break;
        }

        case "arriving":
        case "complete": {
          // 착륙 - 파티클 서서히 사라짐
          particle.scale *= 0.98;
          break;
        }
      }

      // 매트릭스 업데이트
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.scale);
      dummy.rotation.x = time * particle.speed * 0.5;
      dummy.rotation.y = time * particle.speed * 0.3;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // 워프 시 컬러 변경
  useEffect(() => {
    if (phase === "warping" && meshRef.current) {
      particleData.forEach((p, i) => {
        p.color.setHSL(0.55, 1, 0.7); // 더 밝은 시안
        colorArray[i * 3] = p.color.r;
        colorArray[i * 3 + 1] = p.color.g;
        colorArray[i * 3 + 2] = p.color.b;
      });
      meshRef.current.geometry.attributes.color.needsUpdate = true;
    }
  }, [phase, particleData, colorArray]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </boxGeometry>
      <meshBasicMaterial vertexColors transparent opacity={0.9} />
    </instancedMesh>
  );
}

// ==========================================
// CHAIN CORE - 중앙의 빛나는 코어
// ==========================================
function ChainCore({ visible, intensity }: { visible: boolean; intensity: number }) {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current && visible) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
      coreRef.current.scale.setScalar(pulse * intensity);
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={coreRef}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
      <pointLight position={[0, 0, 0]} intensity={intensity * 10} color="#22d3ee" distance={30} />
    </mesh>
  );
}

// ==========================================
// WARP TUNNEL - 워프 터널 효과
// ==========================================
function WarpTunnel({ active }: { active: boolean }) {
  const linesRef = useRef<THREE.Group>(null);
  const lineCount = 100;

  const lineData = useMemo(() => {
    return Array.from({ length: lineCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 8,
      z: Math.random() * 200 - 100,
      speed: 50 + Math.random() * 50,
      length: 5 + Math.random() * 15,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!linesRef.current || !active) return;

    linesRef.current.children.forEach((line, i) => {
      const data = lineData[i];
      data.z -= delta * data.speed;

      if (data.z < -100) {
        data.z = 100;
      }

      line.position.x = Math.cos(data.angle) * data.radius;
      line.position.y = Math.sin(data.angle) * data.radius;
      line.position.z = data.z;
    });
  });

  if (!active) return null;

  return (
    <group ref={linesRef}>
      {lineData.map((data, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(data.angle) * data.radius,
            Math.sin(data.angle) * data.radius,
            data.z,
          ]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, data.length, 4]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// DESTINATION BLOCK - 착륙 지점
// ==========================================
function DestinationBlock({ visible, approaching }: { visible: boolean; approaching: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setScale(s => Math.min(s + 0.02, 1));
      }, 16);
      return () => clearInterval(interval);
    }
  }, [visible]);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;

    if (approaching) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      groupRef.current.scale.setScalar(scale * pulse);
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0, 50]} scale={scale}>
      {/* 메인 블록 */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* 엣지 글로우 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.05, 2.05, 2.05)]} />
        <lineBasicMaterial color="#a855f7" transparent opacity={0.8} />
      </lineSegments>

      {/* 라벨 */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#a855f7"
        anchorX="center"
        anchorY="middle"
      >
        JINHYEOK
      </Text>

      <pointLight position={[0, 0, 0]} intensity={5} color="#a855f7" distance={20} />
    </group>
  );
}

// ==========================================
// CAMERA CONTROLLER
// ==========================================
function CameraController({
  phase,
  onArrival,
}: {
  phase: IntroPhase;
  onArrival: () => void;
}) {
  const { camera } = useThree();
  const arrived = useRef(false);

  useFrame((_, delta) => {
    switch (phase) {
      case "chaos":
        // 천천히 회전하며 관찰
        camera.position.x = Math.sin(Date.now() * 0.0001) * 2;
        camera.position.y = Math.cos(Date.now() * 0.00015) * 1;
        camera.position.z = 40 + Math.sin(Date.now() * 0.00005) * 5;
        camera.lookAt(0, 0, 0);
        break;

      case "aligning":
        // 살짝 뒤로 물러나며 관찰
        camera.position.lerp(new THREE.Vector3(0, 0, 35), delta * 2);
        camera.lookAt(0, 0, 0);
        break;

      case "forming":
        // 정렬된 체인을 바라봄
        camera.position.lerp(new THREE.Vector3(5, 2, 20), delta * 2);
        camera.lookAt(0, 0, 10);
        break;

      case "warping":
        // 워프 스피드 - 앞으로 돌진
        camera.position.z -= delta * 30;
        camera.lookAt(0, 0, camera.position.z - 10);
        break;

      case "arriving":
        // 착륙 - 목적지 블록으로 이동
        camera.position.lerp(new THREE.Vector3(0, 0, 55), delta * 2);
        camera.lookAt(0, 0, 50);

        if (camera.position.z > 53 && !arrived.current) {
          arrived.current = true;
          onArrival();
        }
        break;
    }
  });

  return null;
}

// ==========================================
// MAIN 3D SCENE
// ==========================================
function UniverseScene({
  phase,
  mousePosition,
  onArrival,
}: {
  phase: IntroPhase;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  onArrival: () => void;
}) {
  const showCore = ["aligning", "forming"].includes(phase);
  const coreIntensity = phase === "aligning" ? 0.5 : phase === "forming" ? 1.5 : 0;
  const showWarp = phase === "warping";
  const showDestination = ["warping", "arriving", "complete"].includes(phase);
  const isApproaching = phase === "arriving";

  return (
    <>
      <ambientLight intensity={0.1} />

      {/* 별 배경 */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* Mempool 파티클 */}
      <MempoolParticles phase={phase} mousePosition={mousePosition} />

      {/* 중앙 코어 */}
      <ChainCore visible={showCore} intensity={coreIntensity} />

      {/* 워프 터널 */}
      <WarpTunnel active={showWarp} />

      {/* 목적지 블록 */}
      <DestinationBlock visible={showDestination} approaching={isApproaching} />

      {/* 카메라 */}
      <CameraController phase={phase} onArrival={onArrival} />

      {/* 포스트 프로세싱 */}
      <EffectComposer>
        <Bloom
          intensity={phase === "warping" ? 2.5 : 1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(
            phase === "warping" ? 0.005 : 0.001,
            phase === "warping" ? 0.005 : 0.001
          )}
        />
        <Vignette eskil={false} offset={0.1} darkness={phase === "warping" ? 0.9 : 0.5} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// HUD - TPS 카운터
// ==========================================
function TpsHud({ phase, tps }: { phase: IntroPhase; tps: number }) {
  const showHud = ["forming", "warping"].includes(phase);

  if (!showHud) return null;

  return (
    <motion.div
      className="absolute top-8 right-8 z-20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-3">
        <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">
          Network Speed
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-3xl font-mono font-bold text-cyan-400"
            key={tps}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {tps.toLocaleString()}
          </motion.span>
          <span className="text-gray-500 text-sm">TPS</span>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// PHASE STATUS
// ==========================================
function PhaseStatus({ phase }: { phase: IntroPhase }) {
  const messages: Record<IntroPhase, string> = {
    chaos: "",
    aligning: "Consensus Protocol Initiated...",
    forming: "Chain Formation in Progress...",
    warping: "WARP SPEED ENGAGED",
    arriving: "Approaching Destination...",
    complete: "",
  };

  if (!messages[phase]) return null;

  return (
    <motion.div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={phase}
    >
      <motion.p
        className={`text-sm tracking-widest uppercase font-mono ${
          phase === "warping" ? "text-cyan-400" : "text-gray-400"
        }`}
        animate={phase === "warping" ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {messages[phase]}
      </motion.p>
    </motion.div>
  );
}

// ==========================================
// CONNECT BUTTON
// ==========================================
function ConnectButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <motion.button
        onClick={onClick}
        className="group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 글로우 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg blur-2xl group-hover:blur-3xl transition-all" />

        {/* 버튼 */}
        <div className="relative bg-black/80 border border-cyan-500/50 group-hover:border-cyan-400 rounded-lg px-10 py-5 transition-all">
          <span className="text-cyan-400 group-hover:text-cyan-300 font-mono text-sm tracking-widest uppercase">
            [ CONNECT TO NETWORK ]
          </span>
        </div>

        {/* 펄스 링 */}
        <motion.div
          className="absolute inset-0 border border-cyan-500/30 rounded-lg"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.button>

      <motion.p
        className="text-center text-gray-600 text-xs mt-4 font-mono"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Enter the blockchain universe
      </motion.p>
    </motion.div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function BlockchainUniverse({
  onComplete,
}: {
  onComplete: (blockHash: string) => void;
}) {
  const [phase, setPhase] = useState<IntroPhase>("chaos");
  const [tps, setTps] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const { playWhoosh, playWarp } = useAudio();

  // 마우스 트래킹
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // CONNECT 버튼 클릭
  const handleConnect = useCallback(() => {
    playWhoosh();
    setPhase("aligning");

    const sequence = async () => {
      // Aligning: 2초
      await new Promise(r => setTimeout(r, 2000));
      setPhase("forming");

      // TPS 카운트 시작
      const startTime = Date.now();
      const duration = 2000;
      const animateTps = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setTps(Math.round(eased * 650));

        if (progress < 1) {
          requestAnimationFrame(animateTps);
        }
      };
      animateTps();

      // Forming: 2초
      await new Promise(r => setTimeout(r, 2000));
      playWarp();
      setPhase("warping");

      // TPS 미친듯이 증가
      let currentTps = 650;
      const warpTps = setInterval(() => {
        currentTps += Math.floor(Math.random() * 500) + 100;
        setTps(currentTps);
      }, 100);

      // Warping: 3초
      await new Promise(r => setTimeout(r, 3000));
      clearInterval(warpTps);
      setPhase("arriving");
    };

    sequence();
  }, [playWhoosh, playWarp]);

  // 착륙 완료
  const handleArrival = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      onComplete(FINAL_BLOCK_HASH);
    }, 800);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 40], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#000005"]} />
        <fog attach="fog" args={["#000005", 30, 150]} />
        <UniverseScene
          phase={phase}
          mousePosition={mousePosition}
          onArrival={handleArrival}
        />
      </Canvas>

      {/* Connect Button (chaos phase only) */}
      <AnimatePresence>
        {phase === "chaos" && <ConnectButton onClick={handleConnect} />}
      </AnimatePresence>

      {/* TPS HUD */}
      <AnimatePresence>
        <TpsHud phase={phase} tps={tps} />
      </AnimatePresence>

      {/* Phase Status */}
      <AnimatePresence mode="wait">
        <PhaseStatus phase={phase} />
      </AnimatePresence>

      {/* Transition Overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="absolute inset-0 z-30 bg-purple-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Skip Button */}
      {phase !== "chaos" && !transitioning && (
        <motion.button
          className="absolute bottom-8 right-8 text-gray-600 hover:text-gray-400 text-xs uppercase tracking-widest z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onComplete(FINAL_BLOCK_HASH)}
        >
          Skip →
        </motion.button>
      )}
    </div>
  );
}
