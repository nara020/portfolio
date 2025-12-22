/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// TYPES
// ==========================================
type IntroPhase =
  | "waiting"
  | "streaming"
  | "consensus"
  | "finality"
  | "complete";

interface BlockCandidate {
  id: string;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  isCanonical: boolean;
  opacity: number;
  scale: number;
  forkOffset: number;
  shattered: boolean;
  fadeOut: number;
  blockNumber: number;
}

interface FinalizedBlock {
  id: string;
  position: THREE.Vector3;
  blockNumber: number;
}

const FINAL_BLOCK_HASH = "0xc2e8f5a91b3d7c4e6f8a2b1d9e0c3f5a7b8d1e4f";

// ==========================================
// AUDIO HOOKS
// ==========================================
function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playLockIn = useCallback(() => {
    try {
      const ctx = initContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc2.frequency.setValueAtTime(1320, ctx.currentTime);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }, [initContext]);

  const playShatter = useCallback(() => {
    try {
      const ctx = initContext();
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }

      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      source.buffer = buffer;
      filter.type = "highpass";
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(ctx.currentTime);
    } catch (e) {}
  }, [initContext]);

  return { playLockIn, playShatter };
}

// ==========================================
// COMPETING BLOCK
// ==========================================
function CompetingBlock({ candidate }: { candidate: BlockCandidate }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    if (candidate.shattered) {
      // Fade out and shrink
      groupRef.current.scale.multiplyScalar(0.92);
      if (meshRef.current.material) {
        meshRef.current.material.opacity *= 0.9;
      }
    } else {
      // Move towards target
      groupRef.current.position.lerp(candidate.targetPosition, delta * 2);

      // Flickering for non-canonical
      if (!candidate.isCanonical) {
        const flicker = 0.3 + Math.sin(state.clock.elapsedTime * 10 + candidate.forkOffset * 5) * 0.15;
        if (meshRef.current.material) {
          meshRef.current.material.opacity = flicker;
        }
      }

      // Rotation
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const color = candidate.isCanonical ? "#22d3ee" : "#6b7280";
  const emissiveColor = candidate.isCanonical ? "#22d3ee" : "#374151";

  return (
    <group ref={groupRef} position={candidate.position.toArray()}>
      <mesh ref={meshRef} scale={candidate.scale}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={candidate.shattered ? "#ef4444" : color}
          emissive={candidate.shattered ? "#ef4444" : emissiveColor}
          emissiveIntensity={candidate.isCanonical ? 0.5 : 0.2}
          transparent
          opacity={candidate.opacity}
          wireframe={!candidate.isCanonical}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Edge highlight */}
      <lineSegments scale={candidate.scale}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.85, 0.85, 0.85)]} />
        <lineBasicMaterial
          color={candidate.shattered ? "#ef4444" : color}
          transparent
          opacity={candidate.isCanonical ? 0.8 : 0.3}
        />
      </lineSegments>

      {/* Block number */}
      {!candidate.shattered && (
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.12}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          #{candidate.blockNumber}
        </Text>
      )}

      {/* Glow for canonical */}
      {candidate.isCanonical && !candidate.shattered && (
        <pointLight intensity={2} color="#22d3ee" distance={3} />
      )}
    </group>
  );
}

// ==========================================
// FINALIZED BLOCK
// ==========================================
function FinalizedBlockMesh({ block, isLast }: { block: FinalizedBlock; isLast: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + block.blockNumber) * 0.02;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={block.position.toArray()}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={isLast ? 0.6 : 0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.65, 0.65, 0.65)]} />
        <lineBasicMaterial color="#c084fc" transparent opacity={0.6} />
      </lineSegments>

      <Text
        position={[0, -0.5, 0]}
        fontSize={0.1}
        color="#a855f7"
        anchorX="center"
      >
        #{block.blockNumber}
      </Text>

      {isLast && <pointLight intensity={3} color="#a855f7" distance={5} />}
    </group>
  );
}

// ==========================================
// CONSENSUS ZONE
// ==========================================
function ConsensusZone({ active }: { active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current && active) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  if (!active) return null;

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.03, 16, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
      </mesh>

      <Text position={[0, 2.3, 0]} fontSize={0.18} color="#fbbf24" anchorX="center">
        CONSENSUS ZONE
      </Text>
    </group>
  );
}

// ==========================================
// DESTINATION BLOCK
// ==========================================
function DestinationBlock({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (visible && scaleRef.current < 1) {
      scaleRef.current = Math.min(scaleRef.current + delta * 0.8, 1);
    }

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    groupRef.current.scale.setScalar(scaleRef.current * pulse);
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[-6, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.25, 1.25, 1.25)]} />
        <lineBasicMaterial color="#c084fc" />
      </lineSegments>

      <Text position={[0, -1, 0]} fontSize={0.2} color="#a855f7" anchorX="center">
        JINHYEOK
      </Text>

      <pointLight intensity={5} color="#a855f7" distance={10} />
    </group>
  );
}

// ==========================================
// MAIN SCENE
// ==========================================
function ChainScene({
  phase,
  candidates,
  finalizedBlocks,
}: {
  phase: IntroPhase;
  candidates: BlockCandidate[];
  finalizedBlocks: FinalizedBlock[];
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (phase === "streaming" || phase === "consensus") {
      camera.position.lerp(new THREE.Vector3(0, 2, 8), delta * 2);
      camera.lookAt(0, 0, 0);
    } else if (phase === "finality") {
      camera.position.lerp(new THREE.Vector3(-3, 1, 6), delta * 2);
      camera.lookAt(-4, 0, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#a855f7" />

      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={0.5} />

      {/* Zone labels */}
      <Text position={[4.5, 2.5, 0]} fontSize={0.12} color="#4b5563">
        UNFINALIZED
      </Text>
      <Text position={[-4.5, 2.5, 0]} fontSize={0.12} color="#a855f7">
        FINALIZED
      </Text>

      <ConsensusZone active={phase === "consensus"} />

      {/* Competing blocks */}
      {candidates.map((c) => (
        <CompetingBlock key={c.id} candidate={c} />
      ))}

      {/* Finalized chain */}
      {finalizedBlocks.map((b, i) => (
        <FinalizedBlockMesh
          key={b.id}
          block={b}
          isLast={i === finalizedBlocks.length - 1}
        />
      ))}

      <DestinationBlock visible={phase === "finality" || phase === "complete"} />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// HUD
// ==========================================
function StatusHUD({
  phase,
  confirmedCount,
  orphanedCount,
}: {
  phase: IntroPhase;
  confirmedCount: number;
  orphanedCount: number;
}) {
  return (
    <motion.div
      className="absolute top-8 left-8 z-20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-black/70 backdrop-blur-md border border-gray-700 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            phase === "streaming" ? "bg-yellow-400 animate-pulse" :
            phase === "consensus" ? "bg-cyan-400 animate-pulse" :
            phase === "finality" ? "bg-green-400" : "bg-gray-500"
          }`} />
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            {phase === "streaming" ? "Streaming Blocks..." :
             phase === "consensus" ? "Consensus in Progress" :
             phase === "finality" ? "Chain Finalized" : "Ready"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs">Confirmed</div>
            <div className="text-green-400 font-mono">{confirmedCount}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Orphaned</div>
            <div className="text-red-400 font-mono">{orphanedCount}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConsensusLog({ logs }: { logs: string[] }) {
  return (
    <motion.div
      className="absolute bottom-24 left-8 right-8 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg p-3 max-h-28 overflow-y-auto font-mono text-xs">
        {logs.slice(-5).map((log, i) => (
          <div
            key={i}
            className={`${
              log.includes("CONFIRMED") ? "text-green-400" :
              log.includes("ORPHANED") ? "text-red-400" :
              log.includes("FORK") ? "text-yellow-400" :
              "text-gray-400"
            }`}
          >
            {log}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ConnectButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[100]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <motion.button
        onClick={onClick}
        className="group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg blur-2xl" />
        <div className="relative bg-black/80 border border-cyan-500/50 group-hover:border-cyan-400 rounded-lg px-10 py-5 transition-all">
          <span className="text-cyan-400 group-hover:text-cyan-300 font-mono text-sm tracking-widest uppercase">
            [ OBSERVE CONSENSUS ]
          </span>
        </div>
        <motion.div
          className="absolute inset-0 border border-cyan-500/30 rounded-lg"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.button>
      <p className="text-center text-gray-600 text-xs mt-4 font-mono">
        Watch the chain selection process
      </p>
    </motion.div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ChainSelection({
  onComplete,
}: {
  onComplete: (blockHash: string) => void;
}) {
  const [phase, setPhase] = useState<IntroPhase>("waiting");
  const [candidates, setCandidates] = useState<BlockCandidate[]>([]);
  const [finalizedBlocks, setFinalizedBlocks] = useState<FinalizedBlock[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [orphanedCount, setOrphanedCount] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const { playLockIn, playShatter } = useAudio();
  const blockNumberRef = useRef(1000);
  const roundRef = useRef(0);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  // Spawn competing blocks
  const spawnBlockRound = useCallback(() => {
    const baseBlockNumber = blockNumberRef.current++;
    const forkCount = Math.floor(Math.random() * 2) + 1;
    const canonicalIndex = Math.floor(Math.random() * (forkCount + 1));

    const newCandidates: BlockCandidate[] = [];

    for (let i = 0; i <= forkCount; i++) {
      const isCanonical = i === canonicalIndex;
      const forkOffset = (i - forkCount / 2) * 1.8;

      newCandidates.push({
        id: `block-${baseBlockNumber}-${i}`,
        position: new THREE.Vector3(5, forkOffset, 0),
        targetPosition: new THREE.Vector3(2, forkOffset * 0.6, 0),
        isCanonical,
        opacity: isCanonical ? 0.9 : 0.4,
        scale: isCanonical ? 1 : 0.8,
        forkOffset,
        shattered: false,
        fadeOut: 1,
        blockNumber: baseBlockNumber,
      });
    }

    setCandidates((prev) => [...prev, ...newCandidates]);
    addLog(`FORK DETECTED: Block #${baseBlockNumber} has ${forkCount + 1} competing candidates`);

    return baseBlockNumber;
  }, [addLog]);

  // Process consensus
  const processConsensus = useCallback((blockNumber: number) => {
    setCandidates((prev) => {
      const updated = prev.map((c) => {
        if (c.blockNumber === blockNumber && !c.shattered) {
          if (c.isCanonical) {
            playLockIn();
            addLog(`CONFIRMED: Block #${blockNumber} selected by consensus`);
            setConfirmedCount((cnt) => cnt + 1);

            setFinalizedBlocks((prevBlocks) => [
              ...prevBlocks,
              {
                id: c.id,
                position: new THREE.Vector3(-2 - prevBlocks.length * 1.1, 0, 0),
                blockNumber: c.blockNumber,
              },
            ]);

            return { ...c, shattered: true };
          } else {
            playShatter();
            addLog(`ORPHANED: Block #${blockNumber} candidate rejected`);
            setOrphanedCount((cnt) => cnt + 1);
            return { ...c, shattered: true };
          }
        }
        return c;
      });

      // Clean up shattered blocks after delay
      setTimeout(() => {
        setCandidates((curr) =>
          curr.filter((c) => c.blockNumber !== blockNumber || !c.shattered)
        );
      }, 1500);

      return updated;
    });
  }, [addLog, playLockIn, playShatter]);

  // Start
  const handleStart = useCallback(() => {
    setPhase("streaming");
    addLog("NETWORK: Connecting to blockchain...");

    let round = 0;
    const maxRounds = 4;

    const runRound = () => {
      if (round >= maxRounds) {
        setTimeout(() => {
          addLog("FINALITY: Chain selection complete!");
          addLog("DESTINATION: JINHYEOK block reached");
          setPhase("finality");
          playLockIn();

          setTimeout(() => {
            setTransitioning(true);
            setTimeout(() => onComplete(FINAL_BLOCK_HASH), 800);
          }, 2500);
        }, 1000);
        return;
      }

      const blockNum = spawnBlockRound();
      round++;

      setTimeout(() => {
        setPhase("consensus");
        processConsensus(blockNum);

        setTimeout(() => {
          setPhase("streaming");
          setTimeout(runRound, 1500);
        }, 1200);
      }, 1800);
    };

    setTimeout(runRound, 500);
  }, [addLog, spawnBlockRound, processConsensus, playLockIn, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Canvas
        camera={{ position: [0, 3, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#030308"]} />
        <fog attach="fog" args={["#030308", 15, 50]} />
        <ChainScene
          phase={phase}
          candidates={candidates}
          finalizedBlocks={finalizedBlocks}
        />
      </Canvas>

      <AnimatePresence>
        {phase === "waiting" && <ConnectButton onClick={handleStart} />}
      </AnimatePresence>

      {phase !== "waiting" && (
        <StatusHUD
          phase={phase}
          confirmedCount={confirmedCount}
          orphanedCount={orphanedCount}
        />
      )}

      {phase !== "waiting" && <ConsensusLog logs={logs} />}

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

      {phase !== "waiting" && !transitioning && (
        <motion.button
          className="absolute bottom-8 right-8 text-gray-600 hover:text-gray-400 text-xs uppercase tracking-widest z-20 font-mono"
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
