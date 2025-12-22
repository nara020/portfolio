/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// TYPES
// ==========================================
type ConsensusMode = "pow" | "pos" | "raft" | "qbft";
type Phase = "idle" | "running" | "complete";

interface ChainBlock {
  id: string;
  position: THREE.Vector3;
  status: "mining" | "mined" | "confirmed" | "finalized" | "orphaned" | "proposed" | "justified" | "committed";
  blockNumber: number;
  branch: number;
  txCount?: number;
}

interface Validator {
  id: number;
  position: THREE.Vector3;
  role: "leader" | "follower" | "proposer" | "validator" | "miner";
  vote: "none" | "prepare" | "commit" | "attest";
  active: boolean;
  name?: string;
}

interface Transaction {
  id: string;
  position: THREE.Vector3;
  status: "pending" | "processing" | "included";
  target?: THREE.Vector3;
}

const FINAL_BLOCK_HASH = "0xc2e8f5a91b3d7c4e6f8a2b1d9e0c3f5a7b8d1e4f";

// ==========================================
// CONSENSUS INFO - Updated with real chain names
// ==========================================
const CONSENSUS_INFO: Record<ConsensusMode, {
  name: string;
  chain: string;
  icon: string;
  subtitle: string;
  description: string[];
  color: string;
}> = {
  pow: {
    name: "Proof of Work",
    chain: "Bitcoin",
    icon: "₿",
    subtitle: "Nakamoto Consensus",
    color: "#f7931a",
    description: [
      "⛏️ SHA-256 해시 → Target 이하 찾기",
      "🌐 네트워크 지연(~10s)으로 Fork 발생",
      "⚡ Most Accumulated Work 체인 = Main",
      "💀 Orphan Block → Coinbase TX 무효",
      "📊 6 confirmations ≈ 0.02% reorg 확률",
    ],
  },
  pos: {
    name: "Proof of Stake",
    chain: "Ethereum",
    icon: "◆",
    subtitle: "Casper FFG + LMD GHOST",
    color: "#627eea",
    description: [
      "🎰 Stake 비례 확률로 Proposer 선정",
      "⏱️ 1 Slot = 12s, 1 Epoch = 32 slots",
      "🗳️ Committee가 Attestation 투표",
      "✅ 2/3+ 투표 → Justified → Finalized",
      "🔒 Revert 시 1/3 stake Slashing ($26B+)",
    ],
  },
  raft: {
    name: "RAFT Consensus",
    chain: "Hyperledger Fabric",
    icon: "🔷",
    subtitle: "CFT (Crash Fault Tolerant)",
    color: "#2c9ed4",
    description: [
      "👑 Leader Election (Term 기반)",
      "📝 Log Entry Append → Follower 복제",
      "✅ 과반수(>50%) ACK → Committed",
      "💓 Heartbeat 150ms로 Leader 확인",
      "⚠️ Byzantine(악의적) 노드 불허",
    ],
  },
  qbft: {
    name: "IBFT 2.0",
    chain: "Hyperledger Besu",
    icon: "🛡️",
    subtitle: "BFT (Byzantine Fault Tolerant)",
    color: "#3c3c3d",
    description: [
      "🔄 PRE-PREPARE → PREPARE → COMMIT",
      "📐 N ≥ 3f+1, Quorum = 2f+1",
      "🛡️ 33% Byzantine 노드까지 허용",
      "⚡ Commit 즉시 Finality (No Fork)",
      "🔁 Round-Robin Proposer 로테이션",
    ],
  },
};

// ==========================================
// AUDIO
// ==========================================
function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const init = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const playSound = useCallback((freq: number, duration: number, type: OscillatorType = "sine", volume = 0.1) => {
    try {
      const ctx = init();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }, [init]);

  return {
    playTx: () => playSound(400, 0.1, "sine", 0.08),
    playMine: () => playSound(200, 0.15, "square", 0.05),
    playConfirm: () => playSound(880, 0.2, "sine", 0.12),
    playOrphan: () => playSound(150, 0.3, "sawtooth", 0.06),
    playVote: () => playSound(600, 0.08, "triangle", 0.06),
    playFinalize: () => {
      playSound(880, 0.15, "sine", 0.1);
      setTimeout(() => playSound(1100, 0.2, "sine", 0.1), 100);
    },
  };
}

// ==========================================
// TRANSACTION COMPONENT
// ==========================================
function TransactionParticle({ tx }: { tx: Transaction }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current || !tx.target) return;
    meshRef.current.position.lerp(tx.target, 0.05);
  });

  if (tx.status === "included") return null;

  return (
    <mesh ref={meshRef} position={tx.position.toArray()}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
    </mesh>
  );
}

// ==========================================
// BLOCK COMPONENT
// ==========================================
function Block({ block, showLabel = true }: { block: ChainBlock; showLabel?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    setScale(0);
    const timer = setTimeout(() => setScale(1), 50);
    return () => clearTimeout(timer);
  }, [block.id]);

  const colors: Record<string, string> = {
    mining: "#fbbf24",
    mined: "#6b7280",
    confirmed: "#22d3ee",
    finalized: "#a855f7",
    orphaned: "#ef4444",
    proposed: "#3b82f6",
    justified: "#8b5cf6",
    committed: "#22c55e",
  };

  useFrame((state) => {
    if (!meshRef.current) return;

    const currentScale = meshRef.current.scale.x;
    const targetScale = block.status === "orphaned" ? 0.3 : scale;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.1));

    if (block.status === "mining") {
      meshRef.current.rotation.y += 0.05;
    }
    if (["finalized", "committed", "confirmed"].includes(block.status)) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      meshRef.current.scale.multiplyScalar(pulse);
    }
  });

  const color = colors[block.status] || "#6b7280";
  const isActive = block.status !== "orphaned";

  return (
    <group position={block.position.toArray()}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={["finalized", "committed", "confirmed"].includes(block.status) ? 0.6 : 0.2}
          transparent
          opacity={isActive ? 0.9 : 0.2}
          wireframe={block.status === "mining" || block.status === "proposed"}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.55, 0.55, 0.55)]} />
        <lineBasicMaterial color={color} transparent opacity={isActive ? 0.8 : 0.1} />
      </lineSegments>
      {showLabel && isActive && (
        <Text position={[0, -0.45, 0]} fontSize={0.12} color={color} anchorX="center">
          #{block.blockNumber}
        </Text>
      )}
      {block.txCount !== undefined && isActive && (
        <Text position={[0, 0.45, 0]} fontSize={0.08} color="#fbbf24" anchorX="center">
          {block.txCount} tx
        </Text>
      )}
      {["finalized", "committed", "confirmed"].includes(block.status) && (
        <pointLight intensity={1} color={color} distance={2} />
      )}
    </group>
  );
}

// ==========================================
// VALIDATOR/MINER NODE COMPONENT
// ==========================================
function Node({ validator }: { validator: Validator }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState(1);

  const roleColors: Record<string, string> = {
    leader: "#f7931a",
    proposer: "#627eea",
    follower: "#2c9ed4",
    validator: "#8b5cf6",
    miner: "#f7931a",
  };

  const voteColors: Record<string, string | null> = {
    none: null,
    prepare: "#3b82f6",
    commit: "#22c55e",
    attest: "#8b5cf6",
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    if (validator.role === "leader" || validator.role === "proposer") {
      const p = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(p);
    }
    if (validator.vote !== "none") {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const baseColor = roleColors[validator.role] || "#6b7280";
  const voteColor = voteColors[validator.vote];

  return (
    <group position={validator.position.toArray()}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={validator.active ? 0.4 : 0.1}
          transparent
          opacity={validator.active ? 0.9 : 0.3}
        />
      </mesh>

      {voteColor && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.04, 8, 16]} />
          <meshBasicMaterial color={voteColor} transparent opacity={0.8} />
        </mesh>
      )}

      <Text position={[0, -0.45, 0]} fontSize={0.1} color={baseColor} anchorX="center">
        {validator.name || (validator.role === "miner" ? `Miner ${validator.id}` : `V${validator.id}`)}
      </Text>

      {(validator.role === "leader" || validator.role === "proposer") && (
        <>
          <Text position={[0, 0.55, 0]} fontSize={0.08} color={baseColor} anchorX="center">
            {validator.role === "leader" ? "👑 LEADER" : "📢 PROPOSER"}
          </Text>
          <pointLight intensity={0.8} color={baseColor} distance={2.5} />
        </>
      )}
    </group>
  );
}

// ==========================================
// CHAIN LINE
// ==========================================
function ChainLine({ from, to, color, opacity = 0.5, dashed = false }: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
  opacity?: number;
  dashed?: boolean;
}) {
  return (
    <Line
      points={[from.toArray(), to.toArray()]}
      color={color}
      lineWidth={dashed ? 1 : 2}
      transparent
      opacity={opacity}
      dashed={dashed}
      dashSize={0.1}
      dashScale={2}
    />
  );
}

// ==========================================
// STEP INDICATOR
// ==========================================
function StepIndicator({ step, totalSteps, description }: { step: number; totalSteps: number; description: string }) {
  return (
    <motion.div
      className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={step}
    >
      <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-xl px-6 py-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < step ? "bg-cyan-400" : i === step ? "bg-cyan-400 animate-pulse scale-125" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
        <p className="text-cyan-400 text-sm font-mono">{description}</p>
      </div>
    </motion.div>
  );
}

// ==========================================
// POW SCENE (Bitcoin) - Regional Mining Competition
// ==========================================
const REGIONS = [
  { name: "🌎 North America", color: "#22c55e", yOffset: 1.8 },
  { name: "🌍 Europe", color: "#3b82f6", yOffset: 0 },
  { name: "🌏 Asia", color: "#f59e0b", yOffset: -1.8 },
];

function PoWScene({
  blocks,
  miners,
  transactions,
  forkLengths,
  winningBranch,
  miningData,
}: {
  blocks: ChainBlock[];
  miners: Validator[];
  transactions: Transaction[];
  forkLengths: number[];
  winningBranch: number;
  miningData: { nonce: number[]; hash: string[]; mining: boolean[]; found: number };
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(3, 2, 16), 0.02);
    camera.lookAt(3, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[0, 4, 0]} fontSize={0.28} color="#f7931a" anchorX="center">
        ₿ BITCOIN - Proof of Work
      </Text>

      {/* Region labels with fork info */}
      {REGIONS.map((region, i) => (
        <group key={region.name}>
          {/* Region name */}
          <Text
            position={[-6.5, region.yOffset, 0]}
            fontSize={0.18}
            color={winningBranch === i ? "#22c55e" : region.color}
            anchorX="left"
          >
            {region.name}
          </Text>
          {/* Block count */}
          <Text
            position={[9, region.yOffset, 0]}
            fontSize={0.18}
            color={winningBranch === i ? "#22c55e" : "#6b7280"}
            anchorX="left"
          >
            {forkLengths[i]} blocks {winningBranch === i ? "✓ MAIN" : winningBranch >= 0 ? "✗ ORPHAN" : ""}
          </Text>
          {/* Divider line */}
          {i < 2 && (
            <Line
              points={[[-6, region.yOffset - 0.9, 0], [9, region.yOffset - 0.9, 0]]}
              color="#333"
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          )}
        </group>
      ))}

      {/* Genesis block */}
      <group position={[-5, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#f7931a" emissive="#f7931a" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0, -0.7, 0]} fontSize={0.1} color="#f7931a" anchorX="center">
          Genesis
        </Text>
      </group>

      {/* Transactions */}
      {transactions.map(tx => <TransactionParticle key={tx.id} tx={tx} />)}

      {/* Miners */}
      {miners.map(m => <Node key={m.id} validator={m} />)}

      {/* Mining Status Display */}
      {miningData.mining.some(m => m) && (
        <group>
          {/* Difficulty Target */}
          <Text position={[-6.5, 3.2, 0]} fontSize={0.14} color="#f7931a" anchorX="left">
            Target: hash must start with "0000..."
          </Text>
          {/* Mining info for each region */}
          {REGIONS.map((region, i) => (
            <group key={`mining-${i}`}>
              {miningData.mining[i] && (
                <>
                  <Text
                    position={[4.5, region.yOffset + 0.3, 0]}
                    fontSize={0.12}
                    color={miningData.found === i ? "#22c55e" : "#94a3b8"}
                    anchorX="left"
                  >
                    Nonce: {miningData.nonce[i].toLocaleString()}
                  </Text>
                  <Text
                    position={[4.5, region.yOffset - 0.15, 0]}
                    fontSize={0.1}
                    color={miningData.found === i ? "#22c55e" : miningData.hash[i].startsWith("0000") ? "#22c55e" : "#ef4444"}
                    anchorX="left"
                    fontFamily="monospace"
                  >
                    {miningData.hash[i] ? `${miningData.hash[i].slice(0, 14)}...` : "computing..."}
                  </Text>
                  {miningData.found === i && (
                    <Text
                      position={[4.5, region.yOffset - 0.5, 0]}
                      fontSize={0.13}
                      color="#22c55e"
                      anchorX="left"
                    >
                      ✓ FOUND!
                    </Text>
                  )}
                </>
              )}
            </group>
          ))}
        </group>
      )}

      {/* Blocks */}
      {blocks.map(block => <Block key={block.id} block={block} />)}

      {/* Chain lines */}
      {blocks.map((block, i) => {
        const sameBranch = blocks.filter(b => b.branch === block.branch);
        const idx = sameBranch.indexOf(block);
        const regionColor = REGIONS[block.branch]?.color || "#f7931a";
        const lineColor = block.status === "orphaned" ? "#ef4444" : regionColor;

        if (idx === 0) {
          return <ChainLine key={`line-${block.id}`} from={new THREE.Vector3(-5, 0, 0)} to={block.position} color={lineColor} opacity={block.status === "orphaned" ? 0.15 : 0.6} />;
        } else {
          return <ChainLine key={`line-${block.id}`} from={sameBranch[idx-1].position} to={block.position} color={lineColor} opacity={block.status === "orphaned" ? 0.15 : 0.6} />;
        }
      })}

      {/* Info Panel - 왼쪽 하단 통합 */}
      <group position={[-6.5, -3.2, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.14} color="#f7931a" anchorX="left">
          💰 Block Reward: 3.125 BTC ≈ $310K
        </Text>
        <Text position={[0, -0.32, 0]} fontSize={0.11} color="#94a3b8" anchorX="left">
          TPS: ~7 | Block: 10min | Finality: 60min
        </Text>
        <Text position={[0, -0.58, 0]} fontSize={0.1} color="#6b7280" anchorX="left">
          Network delay ~10s causes forks
        </Text>
      </group>

      {/* Warning about orphan blocks - 동적으로 계산 */}
      {winningBranch >= 0 && (
        <group>
          <Text position={[3, -3.0, 0]} fontSize={0.15} color="#ef4444" anchorX="center">
            ⚠️ ORPHANED BLOCKS
          </Text>
          {REGIONS.map((region, i) => {
            if (i === winningBranch) return null;
            const lostBlocks = forkLengths[i];
            const lostAmount = lostBlocks * 310000;
            return (
              <Text
                key={`orphan-${i}`}
                position={[3, -3.3 - (i > winningBranch ? i - 1 : i) * 0.25, 0]}
                fontSize={0.11}
                color="#ef4444"
                anchorX="center"
              >
                {region.name}: -${(lostAmount / 1000).toFixed(0)}K ({lostBlocks} blocks)
              </Text>
            );
          })}
          <Text position={[3, -3.85, 0]} fontSize={0.1} color="#6b7280" anchorX="center">
            All rewards + electricity cost LOST
          </Text>
        </group>
      )}

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// POS SCENE (Ethereum)
// ==========================================
function PoSScene({
  blocks,
  validators,
  transactions,
  currentSlot,
  currentEpoch,
  attestations,
  stakeData,
}: {
  blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];
  currentSlot: number;
  currentEpoch: number;
  attestations: number;
  stakeData: { stakes: number[]; totalStake: number; selectedProposer: number };
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 2, 12), 0.02);
    camera.lookAt(0, 0, 0);
  });

  const proposer = validators.find(v => v.role === "proposer");

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      <Text position={[0, 3.5, 0]} fontSize={0.28} color="#627eea" anchorX="center">
        ◆ ETHEREUM - Proof of Stake
      </Text>

      {/* Epoch/Slot info */}
      <Text position={[-5, 2.5, 0]} fontSize={0.18} color="#8b5cf6" anchorX="left">
        Epoch {currentEpoch} | Slot {currentSlot}
      </Text>
      <Text position={[-5, 2.1, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
        Attestations: {attestations}/{validators.length}
      </Text>

      {/* Stake info for each validator */}
      {stakeData.selectedProposer >= 0 && validators.map((v, i) => (
        <group key={`stake-${i}`}>
          <Text
            position={[v.position.x, v.position.y + 0.9, 0]}
            fontSize={0.11}
            color={stakeData.selectedProposer === i ? "#22c55e" : "#94a3b8"}
            anchorX="center"
          >
            {stakeData.stakes[i]} ETH
          </Text>
          <Text
            position={[v.position.x, v.position.y + 0.7, 0]}
            fontSize={0.09}
            color={stakeData.selectedProposer === i ? "#22c55e" : "#6b7280"}
            anchorX="center"
          >
            ({((stakeData.stakes[i] / stakeData.totalStake) * 100).toFixed(0)}%)
          </Text>
          {stakeData.selectedProposer === i && (
            <Text
              position={[v.position.x, v.position.y - 0.7, 0]}
              fontSize={0.1}
              color="#22c55e"
              anchorX="center"
            >
              ✓ Selected!
            </Text>
          )}
        </group>
      ))}

      {/* Status legend */}
      <group position={[5, 2, 0]}>
        <Text position={[0, 0.5, 0]} fontSize={0.12} color="#a855f7" anchorX="left">● Finalized</Text>
        <Text position={[0, 0.25, 0]} fontSize={0.12} color="#8b5cf6" anchorX="left">● Justified</Text>
        <Text position={[0, 0, 0]} fontSize={0.12} color="#3b82f6" anchorX="left">● Proposed</Text>
        <Text position={[0, -0.25, 0]} fontSize={0.12} color="#6b7280" anchorX="left">● Pending</Text>
      </group>

      {/* Transactions */}
      {transactions.map(tx => <TransactionParticle key={tx.id} tx={tx} />)}

      {/* Validators in a row at top */}
      {validators.map(v => <Node key={v.id} validator={v} />)}

      {/* Blocks in a chain */}
      {blocks.map(block => <Block key={block.id} block={block} />)}

      {/* Chain lines */}
      {blocks.map((block, i) => {
        if (i === 0) return null;
        const color = block.status === "finalized" ? "#a855f7" :
                      block.status === "justified" ? "#8b5cf6" :
                      block.status === "proposed" ? "#3b82f6" : "#6b7280";
        return <ChainLine key={`line-${block.id}`} from={blocks[i-1].position} to={block.position} color={color} />;
      })}

      {/* Attestation lines from validators to current block */}
      {proposer && blocks.length > 0 && validators.filter(v => v.vote === "attest").map(v => (
        <ChainLine
          key={`attest-${v.id}`}
          from={v.position}
          to={blocks[blocks.length - 1].position}
          color="#8b5cf6"
          opacity={0.3}
          dashed
        />
      ))}

      {/* Left Info Panel - Performance & Economics */}
      <group position={[-5.5, -1.8, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.13} color="#627eea" anchorX="left">
          📊 Network Stats
        </Text>
        <Text position={[0, -0.22, 0]} fontSize={0.1} color="#94a3b8" anchorX="left">
          TPS: ~30 | Block: 12s | Finality: 13min
        </Text>
        <Text position={[0, -0.44, 0]} fontSize={0.1} color="#22c55e" anchorX="left">
          APR: ~4.5% | 900K validators | $80B staked
        </Text>
        <Text position={[0, -0.68, 0]} fontSize={0.1} color="#ef4444" anchorX="left">
          ⚠️ Slashing: Double/Surround Vote → 1-32 ETH
        </Text>
      </group>

      {/* Finality Guarantee */}
      {blocks.some(b => b.status === "finalized") && (
        <group position={[-5.5, -2.8, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.13} color="#22c55e" anchorX="left">
            ✓ FINALIZED = IRREVERSIBLE
          </Text>
          <Text position={[0, -0.22, 0]} fontSize={0.09} color="#94a3b8" anchorX="left">
            Revert requires 1/3 stake slashing ($26B+)
          </Text>
        </group>
      )}

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// RAFT SCENE (Hyperledger Fabric)
// ==========================================
function RaftScene({
  validators,
  blocks,
  transactions,
  logEntries,
  replicatedCount,
}: {
  validators: Validator[];
  blocks: ChainBlock[];
  transactions: Transaction[];
  logEntries: number;
  replicatedCount: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 2, 11), 0.02);
    camera.lookAt(0, 0, 0);
  });

  const leader = validators.find(v => v.role === "leader");
  const followers = validators.filter(v => v.role === "follower");

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      <Text position={[0, 3.5, 0]} fontSize={0.28} color="#2c9ed4" anchorX="center">
        🔷 HYPERLEDGER FABRIC - RAFT
      </Text>

      {/* Log info */}
      <Text position={[-5, 2.5, 0]} fontSize={0.16} color="#2c9ed4" anchorX="left">
        Log Entries: {logEntries}
      </Text>
      <Text position={[-5, 2.15, 0]} fontSize={0.14} color="#22c55e" anchorX="left">
        Replicated: {replicatedCount}/{followers.length} nodes
      </Text>

      {/* Transactions */}
      {transactions.map(tx => <TransactionParticle key={tx.id} tx={tx} />)}

      {/* Validators */}
      {validators.map(v => <Node key={v.id} validator={v} />)}

      {/* Connection lines from leader to followers */}
      {leader && followers.map(f => (
        <ChainLine
          key={`conn-${f.id}`}
          from={leader.position}
          to={f.position}
          color={f.vote === "commit" ? "#22c55e" : "#2c9ed4"}
          opacity={f.vote === "commit" ? 0.6 : 0.2}
          dashed={f.vote !== "commit"}
        />
      ))}

      {/* Committed blocks */}
      {blocks.map(b => <Block key={b.id} block={b} />)}
      {blocks.map((b, i) => {
        if (i === 0) return null;
        return <ChainLine key={`bline-${b.id}`} from={blocks[i-1].position} to={b.position} color="#22c55e" opacity={0.6} />;
      })}

      {/* Right Info Panel - CFT & Heartbeat */}
      <group position={[4, 0.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.13} color="#f59e0b" anchorX="left">
          ⚙️ CFT (Crash Fault Tolerant)
        </Text>
        <Text position={[0, -0.24, 0]} fontSize={0.1} color="#94a3b8" anchorX="left">
          ✓ Node crashes, Network delays
        </Text>
        <Text position={[0, -0.46, 0]} fontSize={0.1} color="#ef4444" anchorX="left">
          ✗ Malicious nodes (Byzantine)
        </Text>
        <Text position={[0, -0.7, 0]} fontSize={0.09} color="#6b7280" anchorX="left">
          Max fail: (N-1)/2 | Heartbeat: 150ms
        </Text>
      </group>

      {/* Left Info Panel - Performance */}
      <group position={[-5, -1.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.12} color="#2c9ed4" anchorX="left">
          📊 Performance
        </Text>
        <Text position={[0, -0.22, 0]} fontSize={0.1} color="#22c55e" anchorX="left">
          TPS: 3,000-20,000 | Block: ~1s
        </Text>
        <Text position={[0, -0.44, 0]} fontSize={0.1} color="#94a3b8" anchorX="left">
          Finality: Instant | Private network
        </Text>
      </group>

      {/* Instant Finality - 블록 오른쪽에 배치 */}
      {blocks.length > 0 && (
        <group position={[4, -3.3, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.13} color="#22c55e" anchorX="left">
            ✓ INSTANT FINALITY
          </Text>
          <Text position={[0, -0.22, 0]} fontSize={0.09} color="#94a3b8" anchorX="left">
            Committed = Never reverted
          </Text>
        </group>
      )}

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// QBFT SCENE (Hyperledger Besu)
// ==========================================
function QbftScene({
  validators,
  currentBlock,
  transactions,
  prepareCount,
  commitCount,
  blocks,
}: {
  validators: Validator[];
  currentBlock: ChainBlock | null;
  transactions: Transaction[];
  prepareCount: number;
  commitCount: number;
  blocks: ChainBlock[];
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 2, 11), 0.02);
    camera.lookAt(0, 0, 0);
  });

  const proposer = validators.find(v => v.role === "proposer");
  const required = Math.ceil(validators.length * 2 / 3);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      <Text position={[0, 3.5, 0]} fontSize={0.28} color="#3c3c3d" anchorX="center">
        🛡️ HYPERLEDGER BESU - IBFT 2.0
      </Text>

      {/* Vote counts */}
      <group position={[-5.5, 2.2, 0]}>
        <Text position={[0, 0.35, 0]} fontSize={0.16} color="#3b82f6" anchorX="left">
          PREPARE: {prepareCount}/{validators.length} (need {required})
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.16} color="#22c55e" anchorX="left">
          COMMIT: {commitCount}/{validators.length} (need {required})
        </Text>
      </group>

      {/* Transactions */}
      {transactions.map(tx => <TransactionParticle key={tx.id} tx={tx} />)}

      {/* Validators in a circle */}
      {validators.map(v => <Node key={v.id} validator={v} />)}

      {/* Current proposed block in center */}
      {currentBlock && (
        <group position={[0, 0, 0]}>
          <Block block={currentBlock} showLabel={false} />
          <Text position={[0, 0.5, 0]} fontSize={0.1} color="#fbbf24" anchorX="center">
            Proposed Block
          </Text>
        </group>
      )}

      {/* Vote lines from validators to center */}
      {validators.filter(v => v.vote !== "none").map(v => (
        <ChainLine
          key={`vote-${v.id}`}
          from={v.position}
          to={new THREE.Vector3(0, 0, 0)}
          color={v.vote === "commit" ? "#22c55e" : "#3b82f6"}
          opacity={0.4}
        />
      ))}

      {/* Finalized blocks chain */}
      {blocks.map(b => <Block key={b.id} block={b} />)}
      {blocks.map((b, i) => {
        if (i === 0) return null;
        return <ChainLine key={`bline-${b.id}`} from={blocks[i-1].position} to={b.position} color="#22c55e" opacity={0.6} />;
      })}

      {/* Right Info Panel - BFT & Performance */}
      <group position={[4.2, 0.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.13} color="#ef4444" anchorX="left">
          🛡️ BFT (Byzantine Fault Tolerant)
        </Text>
        <Text position={[0, -0.24, 0]} fontSize={0.1} color="#22c55e" anchorX="left">
          ✓ Malicious nodes, Crashes, Delays
        </Text>
        <Text position={[0, -0.46, 0]} fontSize={0.09} color="#6b7280" anchorX="left">
          N ≥ 3f+1 | Quorum: 2f+1 = 3/4
        </Text>
        <Text position={[0, -0.7, 0]} fontSize={0.1} color="#94a3b8" anchorX="left">
          TPS: 100-1K | Block: 2-5s | Instant
        </Text>
      </group>

      {/* Left Info Panel - Comparison */}
      <group position={[-5, -1.8, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.12} color="#f59e0b" anchorX="left">
          ⚡ BFT vs CFT
        </Text>
        <Text position={[0, -0.22, 0]} fontSize={0.1} color="#22c55e" anchorX="left">
          IBFT: 33% Byzantine tolerance
        </Text>
        <Text position={[0, -0.44, 0]} fontSize={0.1} color="#94a3b8" anchorX="left">
          RAFT: 0% Byzantine (crashes only)
        </Text>
      </group>

      {/* Instant Finality */}
      {blocks.length > 0 && (
        <group position={[-5, -2.6, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.13} color="#22c55e" anchorX="left">
            ✓ INSTANT FINALITY
          </Text>
          <Text position={[0, -0.22, 0]} fontSize={0.09} color="#94a3b8" anchorX="left">
            No forks possible (deterministic BFT)
          </Text>
        </group>
      )}

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// MODE SELECTOR
// ==========================================
function ModeSelector({ mode, onModeChange, disabled }: {
  mode: ConsensusMode;
  onModeChange: (m: ConsensusMode) => void;
  disabled: boolean;
}) {
  const modes: ConsensusMode[] = ["pow", "pos", "raft", "qbft"];

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100]">
      <div className="flex gap-1 bg-black/90 backdrop-blur-md border border-gray-700 rounded-xl p-1.5">
        {modes.map(m => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            disabled={disabled}
            className={`px-4 py-2.5 rounded-lg font-mono text-xs transition-all ${
              mode === m
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                : "border border-transparent hover:bg-gray-800/50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ color: mode === m ? CONSENSUS_INFO[m].color : "#9ca3af" }}
          >
            <span className="text-lg block">{CONSENSUS_INFO[m].icon}</span>
            <span className="block mt-1 font-semibold">{CONSENSUS_INFO[m].chain}</span>
            <span className="block text-[10px] text-gray-500">{m === "qbft" ? "BFT" : CONSENSUS_INFO[m].name.split(" ").slice(-1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// INFO PANEL
// ==========================================
function InfoPanel({ mode }: { mode: ConsensusMode }) {
  const info = CONSENSUS_INFO[mode];
  return (
    <motion.div
      className="absolute top-32 right-4 z-20 max-w-[240px]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      key={mode}
    >
      <div className="bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg p-4">
        <div className="font-semibold mb-1 text-sm flex items-center gap-2" style={{ color: info.color }}>
          {info.icon} {info.chain}
        </div>
        <div className="text-xs text-gray-400 mb-3">{info.subtitle}</div>
        <div className="text-[11px] text-gray-300 space-y-1.5">
          {info.description.map((line, i) => (
            <p key={i} className="leading-relaxed">{line}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// START BUTTON
// ==========================================
function StartButton({ onClick, mode }: { onClick: () => void; mode: ConsensusMode }) {
  const info = CONSENSUS_INFO[mode];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 클라이언트 마운트 후 바로 표시
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.button
        onClick={onClick}
        className="group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="absolute inset-0 rounded-xl blur-xl opacity-50"
          style={{ backgroundColor: info.color }}
        />
        <div
          className="relative bg-black/90 border-2 rounded-xl px-8 py-4 transition-all hover:bg-black/80"
          style={{ borderColor: info.color }}
        >
          <span className="font-mono text-sm tracking-wider uppercase" style={{ color: info.color }}>
            {info.icon} Start {info.chain} Simulation
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ConsensusVisualization({ onComplete }: { onComplete: (blockHash: string) => void }) {
  const [mode, setMode] = useState<ConsensusMode>("pow");
  const [phase, setPhase] = useState<Phase>("idle");
  const [transitioning, setTransitioning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepDescription, setStepDescription] = useState("");

  // State for all modes
  const [blocks, setBlocks] = useState<ChainBlock[]>([]);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // PoW specific
  const [forkLengths, setForkLengths] = useState<number[]>([0, 0, 0]);
  const [winningBranch, setWinningBranch] = useState(-1);

  // PoS specific
  const [currentSlot, setCurrentSlot] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [attestations, setAttestations] = useState(0);

  // RAFT specific
  const [logEntries, setLogEntries] = useState(0);
  const [replicatedCount, setReplicatedCount] = useState(0);

  // QBFT specific
  const [currentBlock, setCurrentBlock] = useState<ChainBlock | null>(null);
  const [prepareCount, setPrepareCount] = useState(0);
  const [commitCount, setCommitCount] = useState(0);

  // PoW Mining visualization
  const [miningData, setMiningData] = useState<{
    nonce: number[];
    hash: string[];
    mining: boolean[];
    found: number; // which miner found it (-1 = none)
  }>({ nonce: [0, 0, 0], hash: ["", "", ""], mining: [false, false, false], found: -1 });

  // PoS Stake visualization
  const [stakeData, setStakeData] = useState<{
    stakes: number[];
    totalStake: number;
    selectedProposer: number;
  }>({ stakes: [32, 64, 48, 96], totalStake: 240, selectedProposer: -1 });

  const audio = useAudio();

  // Reset state for mode
  const resetState = useCallback(() => {
    setBlocks([]);
    setValidators([]);
    setTransactions([]);
    setForkLengths([0, 0, 0]);
    setWinningBranch(-1);
    setCurrentSlot(0);
    setCurrentEpoch(0);
    setAttestations(0);
    setLogEntries(0);
    setReplicatedCount(0);
    setCurrentBlock(null);
    setPrepareCount(0);
    setCommitCount(0);
    setCurrentStep(0);
    setStepDescription("");
    setMiningData({ nonce: [0, 0, 0], hash: ["", "", ""], mining: [false, false, false], found: -1 });
    setStakeData({ stakes: [32, 64, 48, 96], totalStake: 240, selectedProposer: -1 });
  }, []);

  // ==========================================
  // POW SIMULATION - Regional Mining Competition
  // ==========================================
  const runPoW = useCallback(() => {
    resetState();

    // Create regional miners
    const miners: Validator[] = [
      { id: 0, position: new THREE.Vector3(8, 1.8, 0), role: "miner", vote: "none", active: true, name: "🌎 N.America Pool" },
      { id: 1, position: new THREE.Vector3(8, 0, 0), role: "miner", vote: "none", active: true, name: "🌍 Europe Pool" },
      { id: 2, position: new THREE.Vector3(8, -1.8, 0), role: "miner", vote: "none", active: true, name: "🌏 Asia Pool" },
    ];
    setValidators(miners);

    let step = 0;
    const branchBlocks: ChainBlock[][] = [[], [], []];

    // 랜덤하게 승자 결정! (매번 다른 지역이 이길 수 있음)
    const winnerIndex = Math.floor(Math.random() * 3);
    const blockCounts = [2, 4, 6]; // possible block counts
    // Shuffle and assign - winner gets 6, others get 2 or 4
    const shuffled = [...blockCounts].sort(() => Math.random() - 0.5);
    // Make sure winner has the highest
    const targetLengths = [0, 0, 0];
    targetLengths[winnerIndex] = 6;
    const losers = [0, 1, 2].filter(i => i !== winnerIndex);
    targetLengths[losers[0]] = Math.random() > 0.5 ? 2 : 4;
    targetLengths[losers[1]] = targetLengths[losers[0]] === 2 ? 4 : 2;

    const regionYOffsets = [1.8, 0, -1.8];
    const regionNames = ["North America", "Europe", "Asia"];
    const regionEmojis = ["🌎", "🌍", "🌏"];

    const interval = setInterval(() => {
      step++;

      if (step === 1) {
        setCurrentStep(1);
        setStepDescription("트랜잭션들이 전세계 네트워크에 전파됩니다");
        const txs: Transaction[] = Array.from({ length: 6 }, (_, i) => ({
          id: `tx-${i}`,
          position: new THREE.Vector3(-8, (i % 3 - 1) * 1.8, 0),
          status: "pending",
          target: new THREE.Vector3(-5, 0, 0),
        }));
        setTransactions(txs);
        audio.playTx();
      } else if (step === 2) {
        setTransactions([]);
        setCurrentStep(2);
        setStepDescription("각 지역의 채굴풀이 동시에 채굴을 시작합니다");
        // Start mining animation
        setMiningData({
          nonce: [0, 0, 0],
          hash: ["", "", ""],
          mining: [true, true, true],
          found: -1,
        });
      } else if (step >= 3 && step <= 5) {
        // Mining animation - show nonce attempts
        const generateFakeHash = () => {
          const chars = "0123456789abcdef";
          // Most hashes don't start with 0000
          const prefix = Math.random() > 0.1 ? chars[Math.floor(Math.random() * 15) + 1] : "0";
          return prefix + Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * 16)]).join("");
        };

        setMiningData(prev => ({
          ...prev,
          nonce: prev.nonce.map(n => n + Math.floor(Math.random() * 50000) + 10000),
          hash: [generateFakeHash(), generateFakeHash(), generateFakeHash()],
        }));
        setStepDescription("⛏️ 채굴 중... Nonce 값을 변경하며 해시 계산");
      } else if (step === 6) {
        // First miner finds a block (랜덤!)
        const firstFinder = Math.floor(Math.random() * 3);
        const newHashes = ["", "", ""];
        newHashes[firstFinder] = "0000a3f8b2c1d4e5";
        setMiningData(prev => ({
          ...prev,
          hash: prev.hash.map((h, i) => i === firstFinder ? "0000a3f8b2c1d4e5" : h),
          found: firstFinder,
        }));
        setStepDescription(`🎉 ${regionNames[firstFinder]}에서 유효한 해시 발견! (0000으로 시작)`);
        audio.playMine();
      } else if (step >= 7 && step <= 24) {
        // Mining phase - add blocks round-robin but with different max lengths
        const roundInPhase = step - 7;
        const branchIndex = roundInPhase % 3;
        const currentBranchLen = branchBlocks[branchIndex].length;

        // Reset mining display periodically
        if (roundInPhase % 3 === 0) {
          setMiningData({
            nonce: [Math.floor(Math.random() * 100000), Math.floor(Math.random() * 100000), Math.floor(Math.random() * 100000)],
            hash: ["", "", ""],
            mining: [true, true, true],
            found: -1,
          });
        }

        if (currentBranchLen < targetLengths[branchIndex]) {
          audio.playMine();

          // Show found hash for this region
          const generateFakeHash = () => "0000" + Array.from({ length: 12 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
          setMiningData(prev => {
            const newHash = [...prev.hash];
            newHash[branchIndex] = generateFakeHash();
            return { ...prev, hash: newHash, found: branchIndex };
          });

          const newBlock: ChainBlock = {
            id: `block-${step}`,
            position: new THREE.Vector3(-2.5 + currentBranchLen * 1.2, regionYOffsets[branchIndex], 0),
            status: "mined",
            blockNumber: currentBranchLen + 1,
            branch: branchIndex,
            txCount: Math.floor(Math.random() * 200) + 50,
          };

          branchBlocks[branchIndex].push(newBlock);
          setBlocks([...branchBlocks.flat()]);
          setForkLengths([branchBlocks[0].length, branchBlocks[1].length, branchBlocks[2].length]);

          const regionNames = ["North America", "Europe", "Asia"];
          setCurrentStep(3);
          setStepDescription(`${regionNames[branchIndex]}에서 블록 #${currentBranchLen + 1} 채굴 완료!`);
        }
      } else if (step === 25) {
        // Stop mining animation
        setMiningData(prev => ({ ...prev, mining: [false, false, false] }));
        setCurrentStep(4);
        setStepDescription(`⚡ ${regionNames[winnerIndex]} 체인이 가장 길어짐 → 전 노드가 이 체인을 메인으로 인식`);
        setWinningBranch(winnerIndex);
        audio.playFinalize();

        setBlocks(prev => prev.map(b => ({
          ...b,
          status: b.branch === winnerIndex ? "confirmed" : "orphaned",
        })));
      } else if (step === 28) {
        setCurrentStep(5);
        setStepDescription("😭 짧은 체인은 Orphan → 채굴 보상 무효화 (Reorg 발생)");
        audio.playOrphan();
      } else if (step === 32) {
        clearInterval(interval);
        setPhase("complete");
      }
    }, 350);

    return () => clearInterval(interval);
  }, [audio, resetState]);

  // ==========================================
  // POS SIMULATION
  // ==========================================
  const runPoS = useCallback(() => {
    resetState();

    // Create validators in a row at top
    const vals: Validator[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(-3 + i * 2, 2.2, 0),
      role: i === 0 ? "proposer" : "validator",
      vote: "none",
      active: true,
      name: `V${i}`,
    }));
    setValidators(vals);

    let step = 0;
    let slot = 0;
    let epoch = 0;
    const chainBlocks: ChainBlock[] = [];

    // Set stake data for visualization
    const stakes = [32, 64, 48, 96]; // Different stake amounts
    const totalStake = stakes.reduce((a, b) => a + b, 0);
    setStakeData({ stakes, totalStake, selectedProposer: -1 });

    const interval = setInterval(() => {
      step++;

      if (step === 1) {
        setCurrentStep(1);
        setStepDescription("각 Validator의 스테이킹 양 확인...");
        // Show stakes
        setStakeData({ stakes, totalStake, selectedProposer: -1 });
      } else if (step === 2) {
        // Show selection process
        setStepDescription("스테이킹 비율에 따라 Proposer 선정 중...");
        audio.playVote();
      } else if (step === 3) {
        // V3 (96 ETH, 40%) selected as first proposer
        setStakeData({ stakes, totalStake, selectedProposer: 0 });
        setStepDescription("V0 선정! (32 ETH = 13% 확률로 당첨)");
        setValidators(prev => prev.map((v, i) => ({
          ...v,
          role: i === 0 ? "proposer" : "validator",
        })));
        audio.playVote();
      } else if (step === 4) {
        setStepDescription("트랜잭션이 현재 Proposer에게 전달됩니다");
        setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-6, 2.2, 0),
          status: "pending",
          target: new THREE.Vector3(-3, 2.2, 0),
        }]);
        audio.playTx();
      } else if (step === 6) {
        setTransactions([]);
        setCurrentStep(2);
        setStepDescription("Proposer가 새 블록을 제안합니다 (Slot 0)");

        const newBlock: ChainBlock = {
          id: `block-${slot}`,
          position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
          status: "proposed",
          blockNumber: slot,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        setBlocks([...chainBlocks]);
        setCurrentSlot(slot);
        audio.playVote();
      } else if (step >= 7 && step <= 21) {
        const phase = (step - 7) % 5;

        if (phase === 0) {
          // Attestation phase
          setCurrentStep(3);
          setStepDescription(`Validator들이 Attestation 투표 중...`);
          setValidators(prev => prev.map((v, i) =>
            i > 0 ? { ...v, vote: "attest" as const } : v
          ));
          setAttestations(3);
          audio.playVote();
        } else if (phase === 2) {
          // Move to next slot
          slot++;
          setCurrentSlot(slot);
          const newEpoch = Math.floor(slot / 2);

          if (newEpoch > epoch) {
            epoch = newEpoch;
            setCurrentEpoch(epoch);
            setCurrentStep(4 + (epoch > 1 ? 1 : 0));
            setStepDescription(epoch > 1 ? "2 Epochs 완료 → Finalized!" : "1 Epoch 완료 → Justified");
            audio.playFinalize();

            // Update block statuses
            setBlocks(prev => prev.map((b, i) => {
              if (epoch > 1 && i < prev.length - 2) return { ...b, status: "finalized" };
              if (epoch >= 1 && i < prev.length - 1) return { ...b, status: "justified" };
              return b;
            }));
          }

          // Rotate proposer and update stake selection display
          const nextProposer = slot % 4;
          setStakeData(prev => ({ ...prev, selectedProposer: nextProposer }));
          setValidators(prev => prev.map((v, i) => ({
            ...v,
            role: i === nextProposer ? "proposer" : "validator",
            vote: "none",
          })));

          // Add new block
          if (slot < 6) {
            const newBlock: ChainBlock = {
              id: `block-${slot}`,
              position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
              status: "proposed",
              blockNumber: slot,
              branch: 0,
            };
            chainBlocks.push(newBlock);
            setBlocks([...chainBlocks]);
          }
          setAttestations(0);
        }
      } else if (step === 23) {
        clearInterval(interval);
        setPhase("complete");
      }
    }, 350);

    return () => clearInterval(interval);
  }, [audio, resetState]);

  // ==========================================
  // RAFT SIMULATION
  // ==========================================
  const runRaft = useCallback(() => {
    resetState();

    const vals: Validator[] = [
      { id: 0, position: new THREE.Vector3(0, 1.5, 0), role: "leader", vote: "none", active: true, name: "Leader" },
      { id: 1, position: new THREE.Vector3(-2.5, -0.5, 0), role: "follower", vote: "none", active: true, name: "Follower 1" },
      { id: 2, position: new THREE.Vector3(0, -1.5, 0), role: "follower", vote: "none", active: true, name: "Follower 2" },
      { id: 3, position: new THREE.Vector3(2.5, -0.5, 0), role: "follower", vote: "none", active: true, name: "Follower 3" },
    ];
    setValidators(vals);

    let step = 0;
    let log = 0;
    const chainBlocks: ChainBlock[] = [];

    const interval = setInterval(() => {
      step++;

      if (step === 1) {
        setCurrentStep(1);
        setStepDescription("트랜잭션이 Leader에게 도착합니다");
        setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 3) {
        setTransactions([]);
        setCurrentStep(2);
        setStepDescription("Leader가 로그에 Append 합니다");
        log++;
        setLogEntries(log);
        audio.playVote();
      } else if (step === 5) {
        setCurrentStep(3);
        setStepDescription("Follower들에게 복제 요청...");
        setValidators(prev => prev.map(v =>
          v.role === "follower" ? { ...v, vote: "prepare" as const } : v
        ));
        setReplicatedCount(1);
        audio.playVote();
      } else if (step === 7) {
        setReplicatedCount(2);
        audio.playVote();
      } else if (step === 9) {
        setCurrentStep(4);
        setStepDescription("과반수(3/4) 복제 완료!");
        setReplicatedCount(3);
        setValidators(prev => prev.map(v =>
          v.role === "follower" ? { ...v, vote: "commit" as const } : v
        ));
        audio.playVote();
      } else if (step === 11) {
        setCurrentStep(5);
        setStepDescription("Commit! 블록이 확정되었습니다");
        audio.playFinalize();

        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-4 + chainBlocks.length * 1.5, -3, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
          txCount: Math.floor(Math.random() * 100) + 50,
        };
        chainBlocks.push(newBlock);
        setBlocks([...chainBlocks]);

        setValidators(prev => prev.map(v => ({ ...v, vote: "none" as const })));
        setReplicatedCount(0);
      } else if (step === 13) {
        // Second round
        setTransactions([{
          id: "tx-2",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 15) {
        setTransactions([]);
        log++;
        setLogEntries(log);
        setValidators(prev => prev.map(v =>
          v.role === "follower" ? { ...v, vote: "prepare" as const } : v
        ));
        setReplicatedCount(2);
      } else if (step === 17) {
        setReplicatedCount(3);
        setValidators(prev => prev.map(v =>
          v.role === "follower" ? { ...v, vote: "commit" as const } : v
        ));
        audio.playFinalize();

        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-4 + chainBlocks.length * 1.5, -3, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
          txCount: Math.floor(Math.random() * 100) + 50,
        };
        chainBlocks.push(newBlock);
        setBlocks([...chainBlocks]);

        setValidators(prev => prev.map(v => ({ ...v, vote: "none" as const })));
        setReplicatedCount(0);
      }
      // Third round - 3번째 블록
      else if (step === 19) {
        setTransactions([{
          id: "tx-3",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 21) {
        setTransactions([]);
        log++;
        setLogEntries(log);
        setValidators(prev => prev.map(v =>
          v.role === "follower" ? { ...v, vote: "prepare" as const } : v
        ));
        setReplicatedCount(2);
      } else if (step === 23) {
        setReplicatedCount(3);
        setValidators(prev => prev.map(v =>
          v.role === "follower" ? { ...v, vote: "commit" as const } : v
        ));
        audio.playFinalize();

        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-4 + chainBlocks.length * 1.5, -3, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
          txCount: Math.floor(Math.random() * 100) + 50,
        };
        chainBlocks.push(newBlock);
        setBlocks([...chainBlocks]);
        setStepDescription("Block #3 Committed! (Instant Finality)");
      } else if (step === 26) {
        clearInterval(interval);
        setPhase("complete");
      }
    }, 350);

    return () => clearInterval(interval);
  }, [audio, resetState]);

  // ==========================================
  // QBFT SIMULATION
  // ==========================================
  const runQbft = useCallback(() => {
    resetState();

    const vals: Validator[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      vals.push({
        id: i,
        position: new THREE.Vector3(Math.cos(angle) * 2.5, Math.sin(angle) * 1.8, 0),
        role: i === 0 ? "proposer" : "validator",
        vote: "none",
        active: true,
        name: `V${i}`,
      });
    }
    setValidators(vals);

    let step = 0;
    const chainBlocks: ChainBlock[] = [];
    const required = 3; // 2/3 of 4

    const interval = setInterval(() => {
      step++;

      if (step === 1) {
        setCurrentStep(1);
        setStepDescription("트랜잭션이 Proposer에게 도착합니다");
        setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[0].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 3) {
        setTransactions([]);
        setCurrentStep(2);
        setStepDescription("PRE-PREPARE: Proposer가 블록을 제안합니다");
        setCurrentBlock({
          id: "proposed-block",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 5) {
        setCurrentStep(3);
        setStepDescription("PREPARE: Validator들이 동의 투표 중...");
        setPrepareCount(1);
        setValidators(prev => prev.map((v, i) =>
          i === 1 ? { ...v, vote: "prepare" as const } : v
        ));
        audio.playVote();
      } else if (step === 6) {
        setPrepareCount(2);
        setValidators(prev => prev.map((v, i) =>
          i <= 2 ? { ...v, vote: "prepare" as const } : v
        ));
        audio.playVote();
      } else if (step === 7) {
        setPrepareCount(3);
        setValidators(prev => prev.map(v => ({ ...v, vote: "prepare" as const })));
        setStepDescription(`PREPARE 완료: ${required}/${vals.length} (2/3+ 달성!)`);
        audio.playVote();
      } else if (step === 9) {
        setCurrentStep(4);
        setStepDescription("COMMIT: 확정 투표 시작...");
        setCommitCount(1);
        setValidators(prev => prev.map((v, i) =>
          i === 0 ? { ...v, vote: "commit" as const } : v
        ));
        audio.playVote();
      } else if (step === 10) {
        setCommitCount(2);
        setValidators(prev => prev.map((v, i) =>
          i <= 1 ? { ...v, vote: "commit" as const } : v
        ));
        audio.playVote();
      } else if (step === 11) {
        setCommitCount(3);
        setValidators(prev => prev.map((v, i) =>
          i <= 2 ? { ...v, vote: "commit" as const } : v
        ));
        setStepDescription(`COMMIT 완료: ${required}/${vals.length} (2/3+ 달성!)`);
        audio.playVote();
      } else if (step === 13) {
        setCurrentStep(5);
        setStepDescription("Block #1 Finalized! 즉시 확정");
        audio.playFinalize();

        setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-3 + chainBlocks.length * 1.5, -2.5, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        setBlocks([...chainBlocks]);

        setValidators(prev => prev.map(v => ({ ...v, vote: "none" as const })));
        setPrepareCount(0);
        setCommitCount(0);
      }
      // Second block round
      else if (step === 15) {
        // Rotate proposer
        setValidators(prev => prev.map((v, i) => ({
          ...v,
          role: i === 1 ? "proposer" : "validator",
          vote: "none",
        })));
        setStepDescription("다음 라운드: Proposer 로테이션");
      } else if (step === 16) {
        setTransactions([{
          id: "tx-2",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[1].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 17) {
        setTransactions([]);
        setCurrentBlock({
          id: "proposed-block-2",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        setStepDescription("PRE-PREPARE: Block #2 제안");
        audio.playVote();
      } else if (step === 18) {
        setPrepareCount(2);
        setValidators(prev => prev.map((v, i) =>
          i !== 1 ? { ...v, vote: "prepare" as const } : v
        ));
        audio.playVote();
      } else if (step === 19) {
        setPrepareCount(3);
        setValidators(prev => prev.map(v => ({ ...v, vote: "prepare" as const })));
        setStepDescription("PREPARE 완료 (2/3+)");
        audio.playVote();
      } else if (step === 20) {
        setCommitCount(2);
        setValidators(prev => prev.map((v, i) =>
          i <= 1 ? { ...v, vote: "commit" as const } : v
        ));
        audio.playVote();
      } else if (step === 21) {
        setCommitCount(3);
        setValidators(prev => prev.map(v => ({ ...v, vote: "commit" as const })));
        setStepDescription("COMMIT 완료 (2/3+)");
        audio.playVote();
      } else if (step === 22) {
        setStepDescription("Block #2 Finalized! 즉시 확정 (Instant Finality)");
        audio.playFinalize();

        setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-3 + chainBlocks.length * 1.5, -2.5, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        setBlocks([...chainBlocks]);

        setValidators(prev => prev.map(v => ({ ...v, vote: "none" as const })));
        setPrepareCount(0);
        setCommitCount(0);
      }
      // Third block round
      else if (step === 24) {
        // Rotate proposer to V2
        setValidators(prev => prev.map((v, i) => ({
          ...v,
          role: i === 2 ? "proposer" : "validator",
          vote: "none",
        })));
        setStepDescription("Round-Robin: V2가 Proposer");
      } else if (step === 25) {
        setTransactions([{
          id: "tx-3",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[2].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 26) {
        setTransactions([]);
        setCurrentBlock({
          id: "proposed-block-3",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        setStepDescription("PRE-PREPARE: Block #3 제안");
        audio.playVote();
      } else if (step === 27) {
        setPrepareCount(3);
        setValidators(prev => prev.map(v => ({ ...v, vote: "prepare" as const })));
        setStepDescription("PREPARE 완료 (2f+1 = 3/4)");
        audio.playVote();
      } else if (step === 28) {
        setCommitCount(3);
        setValidators(prev => prev.map(v => ({ ...v, vote: "commit" as const })));
        setStepDescription("COMMIT 완료 (2f+1 = 3/4)");
        audio.playVote();
      } else if (step === 29) {
        setStepDescription("Block #3 Finalized! No Fork Possible (BFT)");
        audio.playFinalize();

        setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-3 + chainBlocks.length * 1.5, -2.5, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        setBlocks([...chainBlocks]);
      } else if (step === 32) {
        clearInterval(interval);
        setPhase("complete");
      }
    }, 400);

    return () => clearInterval(interval);
  }, [audio, resetState]);

  // Handle start
  const handleStart = () => {
    setPhase("running");

    setTimeout(() => {
      if (mode === "pow") runPoW();
      else if (mode === "pos") runPoS();
      else if (mode === "raft") runRaft();
      else if (mode === "qbft") runQbft();
    }, 300);
  };

  // Handle mode change
  const handleModeChange = (m: ConsensusMode) => {
    setMode(m);
    setPhase("idle");
    resetState();
  };

  // Complete handler
  useEffect(() => {
    if (phase === "complete") {
      const timer = setTimeout(() => {
        setTransitioning(true);
        setTimeout(() => onComplete(FINAL_BLOCK_HASH), 600);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }} gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={["#030308"]} />
        <fog attach="fog" args={["#030308", 10, 40]} />

        {mode === "pow" && (
          <PoWScene
            blocks={blocks}
            miners={validators}
            transactions={transactions}
            forkLengths={forkLengths}
            winningBranch={winningBranch}
            miningData={miningData}
          />
        )}
        {mode === "pos" && (
          <PoSScene
            blocks={blocks}
            validators={validators}
            transactions={transactions}
            currentSlot={currentSlot}
            currentEpoch={currentEpoch}
            attestations={attestations}
            stakeData={stakeData}
          />
        )}
        {mode === "raft" && (
          <RaftScene
            validators={validators}
            blocks={blocks}
            transactions={transactions}
            logEntries={logEntries}
            replicatedCount={replicatedCount}
          />
        )}
        {mode === "qbft" && (
          <QbftScene
            validators={validators}
            currentBlock={currentBlock}
            transactions={transactions}
            prepareCount={prepareCount}
            commitCount={commitCount}
            blocks={blocks}
          />
        )}
      </Canvas>

      <ModeSelector mode={mode} onModeChange={handleModeChange} disabled={phase === "running"} />

      {/* InfoPanel - idle과 running 모두에서 보여줌 */}
      <InfoPanel mode={mode} />

      {/* StartButton - AnimatePresence 제거로 초기 렌더링 버그 수정 */}
      {phase === "idle" && <StartButton onClick={handleStart} mode={mode} />}

      {phase === "running" && currentStep > 0 && (
        <StepIndicator step={currentStep} totalSteps={5} description={stepDescription} />
      )}

      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="absolute inset-0 z-[250]"
            style={{ backgroundColor: CONSENSUS_INFO[mode].color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {phase === "running" && !transitioning && (
        <motion.button
          className="absolute bottom-4 right-4 text-gray-600 hover:text-gray-400 text-xs uppercase tracking-widest z-20 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setTransitioning(true);
            setTimeout(() => onComplete(FINAL_BLOCK_HASH), 600);
          }}
        >
          Skip →
        </motion.button>
      )}
    </div>
  );
}
