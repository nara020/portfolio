/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { BlendFunction } from "postprocessing";

// ==========================================
// CONSTANTS
// ==========================================
const CHAIN_DATA = [
  { id: 0, hash: "0x000...000", data: "GENESIS", isSpecial: false, prevHash: "0x000...000" },
  { id: 1, hash: "0xa3f...2b1", data: "Block #1", isSpecial: false, prevHash: "0x000...000" },
  { id: 2, hash: "0xb7c...9d4", data: "Block #2", isSpecial: false, prevHash: "0xa3f...2b1" },
  { id: 3, hash: "0xc2e...5f8", data: "JINHYEOK", isSpecial: true, prevHash: "0xb7c...9d4" },
  { id: 4, hash: "0xd8a...1c3", data: "Block #4", isSpecial: false, prevHash: "0xc2e...5f8" },
  { id: 5, hash: "0xe4f...7a6", data: "Block #5", isSpecial: false, prevHash: "0xd8a...1c3" },
  { id: 6, hash: "0xf1b...3e9", data: "Block #6", isSpecial: false, prevHash: "0xe4f...7a6" },
  { id: 7, hash: "0x92d...8b2", data: "Block #7", isSpecial: false, prevHash: "0xf1b...3e9" },
];

// ==========================================
// GENESIS BLOCK - 세련된 시작점
// ==========================================
function GenesisBlock({
  visible,
  onClick,
  isHovered,
  onHover,
}: {
  visible: boolean;
  onClick: () => void;
  isHovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    const t = state.clock.elapsedTime;

    // 메인 블록 회전
    groupRef.current.rotation.y = t * 0.2;

    // 내부 코어 펄스
    if (innerRef.current) {
      const scale = 0.12 + Math.sin(t * 2) * 0.02;
      innerRef.current.scale.setScalar(scale);
    }

    // 링 회전
    if (ringsRef.current) {
      ringsRef.current.rotation.x = t * 0.5;
      ringsRef.current.rotation.z = t * 0.3;
    }
  });

  if (!visible) return null;

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* 클릭 영역 */}
        <mesh
          onClick={onClick}
          onPointerEnter={() => {
            onHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={() => {
            onHover(false);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* 외부 큐브 - 유리 효과 */}
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.4}
            chromaticAberration={0.15}
            anisotropy={0.2}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.05}
            metalness={0.1}
            roughness={0}
            color={isHovered ? "#2a2a4e" : "#1a1a2e"}
          />
        </mesh>

        {/* 외부 엣지 글로우 */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.52, 0.52, 0.52)]} />
          <lineBasicMaterial
            color={isHovered ? "#ffd700" : "#b8860b"}
            transparent
            opacity={isHovered ? 1 : 0.7}
            linewidth={2}
          />
        </lineSegments>

        {/* 회전하는 링들 */}
        <group ref={ringsRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.35, 0.008, 16, 64]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.4, 0.005, 16, 64]} />
            <meshBasicMaterial color="#daa520" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* 내부 빛나는 코어 */}
        <mesh ref={innerRef} scale={0.12}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>

        {/* 라이트 소스 */}
        <pointLight
          position={[0, 0, 0]}
          intensity={isHovered ? 4 : 2}
          color="#ffd700"
          distance={4}
        />

        {/* 해시 텍스트 */}
        <Text
          position={[0, -0.45, 0]}
          fontSize={0.05}
          color={isHovered ? "#ffd700" : "#8b7355"}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          GENESIS BLOCK
        </Text>

        {/* 해시 값 */}
        <Text
          position={[0, -0.55, 0]}
          fontSize={0.025}
          color="#4a4a6a"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          0x0000...0000
        </Text>
      </group>
    </Float>
  );
}

// ==========================================
// HASH FLOW - 블록 간 데이터 흐름 시각화
// ==========================================
function HashFlow({
  start,
  end,
  active,
  delay,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  active: boolean;
  delay: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 15;
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setStarted(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [active, delay]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      pos[i * 3] = start.x + (end.x - start.x) * t;
      pos[i * 3 + 1] = start.y + (end.y - start.y) * t;
      pos[i * 3 + 2] = start.z + (end.z - start.z) * t;
    }
    return pos;
  }, [start, end]);

  useFrame((state) => {
    if (!particlesRef.current || !started) return;
    const t = state.clock.elapsedTime;

    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const progress = ((t * 0.5 + i / count) % 1);
      posArray[i * 3] = start.x + (end.x - start.x) * progress;
      posArray[i * 3 + 1] = start.y + (end.y - start.y) * progress + Math.sin(progress * Math.PI) * 0.1;
      posArray[i * 3 + 2] = start.z + (end.z - start.z) * progress;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!started) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#22d3ee" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ==========================================
// CHAIN BLOCK - 개별 블록 (3D 나선형)
// ==========================================
function ChainBlock({
  index,
  data,
  position,
  delay,
  phase,
  isHovered,
  onHover,
  onClick,
  prevPosition,
}: {
  index: number;
  data: typeof CHAIN_DATA[0];
  position: THREE.Vector3;
  delay: number;
  phase: string;
  isHovered: boolean;
  onHover: (h: boolean) => void;
  onClick?: () => void;
  prevPosition?: THREE.Vector3;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const blockRef = useRef<THREE.Mesh>(null);
  const hashRef = useRef<THREE.Group>(null);
  const [appeared, setAppeared] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [scale, setScale] = useState(0);
  const [miningHash, setMiningHash] = useState("0x???...???");

  // 마이닝 애니메이션
  useEffect(() => {
    if (phase === "building") {
      const timer = setTimeout(() => {
        // 마이닝 시작
        let progress = 0;
        const miningInterval = setInterval(() => {
          progress += 0.1;
          setMiningProgress(progress);
          // 랜덤 해시 생성 (마이닝 효과)
          const chars = "0123456789abcdef";
          let hash = "0x";
          for (let i = 0; i < 3; i++) hash += chars[Math.floor(Math.random() * 16)];
          hash += "...";
          for (let i = 0; i < 3; i++) hash += chars[Math.floor(Math.random() * 16)];
          setMiningHash(hash);

          if (progress >= 1) {
            clearInterval(miningInterval);
            setMiningHash(data.hash);
            setAppeared(true);
          }
        }, 50);
        return () => clearInterval(miningInterval);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, delay, data.hash]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 스케일 애니메이션
    if (appeared && scale < 1) {
      setScale((s) => Math.min(s + delta * 4, 1));
    }

    // 마이닝 중 회전
    if (miningProgress > 0 && miningProgress < 1 && blockRef.current) {
      blockRef.current.rotation.y += delta * 10;
      blockRef.current.rotation.x += delta * 5;
    }

    // 부유 효과
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position.y + Math.sin(t * 1.2 + index * 0.7) * 0.03;

    // 스케일 적용
    if (data.isSpecial) {
      const pulse = 1 + Math.sin(t * 3) * 0.05;
      groupRef.current.scale.setScalar(scale * pulse);
    } else {
      groupRef.current.scale.setScalar(scale);
    }

    // 해시 텍스트 페이드
    if (hashRef.current) {
      hashRef.current.rotation.y = -groupRef.current.parent?.rotation.y || 0;
    }
  });

  const blockSize = data.isSpecial ? 0.4 : 0.32;
  const blockColor = data.id === 0 ? "#ffd700" : data.isSpecial ? "#a855f7" : "#22d3ee";

  // 마이닝 중일 때 색상
  const currentColor = miningProgress > 0 && miningProgress < 1 ? "#ff6b6b" : blockColor;

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]} scale={0}>
      {/* 연결선 & 데이터 흐름 */}
      {prevPosition && scale > 0.3 && (
        <>
          {/* 물리적 연결선 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  prevPosition.x - position.x, prevPosition.y - position.y, prevPosition.z - position.z,
                  0, 0, 0
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#22d3ee" transparent opacity={0.4} />
          </line>
        </>
      )}

      {/* 블록 본체 */}
      <mesh
        ref={blockRef}
        onClick={onClick}
        onPointerEnter={() => {
          onHover(true);
          if (onClick) document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          onHover(false);
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[blockSize, blockSize, blockSize]} />
        <meshStandardMaterial
          color={isHovered ? "#ffffff" : currentColor}
          emissive={currentColor}
          emissiveIntensity={isHovered ? 1 : data.isSpecial ? 0.6 : 0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* 엣지 글로우 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(blockSize + 0.01, blockSize + 0.01, blockSize + 0.01)]} />
        <lineBasicMaterial color={currentColor} transparent opacity={isHovered ? 1 : 0.7} />
      </lineSegments>

      {/* 블록 정보 텍스트 */}
      <group ref={hashRef}>
        {/* 블록 이름/데이터 */}
        <Text
          position={[0, -blockSize / 2 - 0.12, 0]}
          fontSize={data.isSpecial ? 0.08 : 0.05}
          color={isHovered ? "#ffffff" : currentColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {data.data}
        </Text>

        {/* 해시 값 (마이닝 중에는 변하는 값) */}
        <Text
          position={[0, -blockSize / 2 - 0.22, 0]}
          fontSize={0.025}
          color={miningProgress > 0 && miningProgress < 1 ? "#ff6b6b" : "#4a6a8a"}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.03}
        >
          {miningProgress > 0 && miningProgress < 1 ? `Mining: ${miningHash}` : data.hash}
        </Text>

        {/* 이전 해시 연결 표시 */}
        {index > 0 && scale > 0.5 && (
          <Text
            position={[0, blockSize / 2 + 0.08, 0]}
            fontSize={0.018}
            color="#3a5a7a"
            anchorX="center"
            anchorY="middle"
          >
            prev: {data.prevHash}
          </Text>
        )}
      </group>

      {/* 스페셜 블록 추가 효과 */}
      {data.isSpecial && (
        <>
          <pointLight position={[0, 0, 0]} intensity={3} color="#a855f7" distance={3} />

          {/* 클릭 안내 */}
          <Text
            position={[0, blockSize / 2 + 0.2, 0]}
            fontSize={0.04}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            ▶ CLICK TO EXPLORE
          </Text>

          {/* 회전 링 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[blockSize * 0.8, 0.008, 16, 64]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ==========================================
// BLOCKCHAIN - 3D 나선형 체인 구조
// ==========================================
function Blockchain({
  visible,
  phase,
  onJinhyeokClick,
}: {
  visible: boolean;
  phase: string;
  onJinhyeokClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  // 3D 나선형 위치 계산
  const blockPositions = useMemo(() => {
    return CHAIN_DATA.map((_, index) => {
      // 나선형 구조
      const angle = index * 0.6; // 각도
      const radius = 1.5 + index * 0.15; // 점점 커지는 반경
      const height = index * 0.25 - 1; // 높이

      return new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    // 전체 체인 천천히 회전
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {CHAIN_DATA.map((block, index) => (
        <ChainBlock
          key={block.id}
          index={index}
          data={block}
          position={blockPositions[index]}
          delay={index * 0.4}
          phase={phase}
          isHovered={hoveredBlock === block.id}
          onHover={(h) => setHoveredBlock(h ? block.id : null)}
          onClick={block.isSpecial ? onJinhyeokClick : undefined}
          prevPosition={index > 0 ? blockPositions[index - 1] : undefined}
        />
      ))}

      {/* 해시 흐름 파티클 */}
      {phase === "complete" && blockPositions.map((pos, index) => (
        index > 0 && (
          <HashFlow
            key={`flow-${index}`}
            start={blockPositions[index - 1]}
            end={pos}
            active={true}
            delay={index * 0.4 + 1}
          />
        )
      ))}
    </group>
  );
}

// ==========================================
// NETWORK NODES - 주변 검증 노드들
// ==========================================
function NetworkNodes({ visible }: { visible: boolean }) {
  const nodesRef = useRef<THREE.Group>(null);
  const nodeCount = 12;

  const nodeData = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 5 + Math.random() * 2;

      return {
        position: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi) * 0.5,
          radius * Math.cos(phi)
        ),
        size: 0.03 + Math.random() * 0.02,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    if (!nodesRef.current || !visible) return;
    const t = state.clock.elapsedTime;

    nodesRef.current.children.forEach((node, i) => {
      const data = nodeData[i];
      // 각 노드 펄스
      const scale = data.size * (1 + Math.sin(t * data.speed + data.phase) * 0.3);
      node.scale.setScalar(scale);
    });
  });

  if (!visible) return null;

  return (
    <group ref={nodesRef}>
      {nodeData.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// EXPLOSION PARTICLES
// ==========================================
function ExplosionParticles({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;
  const startTime = useRef(0);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // 구형 분포
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const speed = 2 + Math.random() * 3;

      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      vel[i * 3] = Math.sin(theta) * Math.cos(phi) * speed;
      vel[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * speed;
      vel[i * 3 + 2] = Math.cos(theta) * speed;
    }
    return [pos, vel];
  }, []);

  useEffect(() => {
    if (active) {
      startTime.current = 0;
    }
  }, [active]);

  useFrame((state, delta) => {
    if (!particlesRef.current || !active) return;

    startTime.current += delta;
    const t = startTime.current;

    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3] = velocities[i * 3] * t;
      posArray[i * 3 + 1] = velocities[i * 3 + 1] * t;
      posArray[i * 3 + 2] = velocities[i * 3 + 2] * t;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // 페이드 아웃
    const material = particlesRef.current.material as THREE.PointsMaterial;
    material.opacity = Math.max(0, 1 - t * 0.8);
    material.size = 0.03 + t * 0.02;
  });

  if (!active) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffd700" transparent opacity={1} sizeAttenuation />
    </points>
  );
}

// ==========================================
// AMBIENT PARTICLES - 우주 먼지
// ==========================================
function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#4a5568" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ==========================================
// GRID FLOOR - 사이버 그리드
// ==========================================
function CyberGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // 그리드 펄스
      const t = state.clock.elapsedTime;
      gridRef.current.children.forEach((line, i) => {
        const material = line.material as THREE.LineBasicMaterial;
        material.opacity = 0.1 + Math.sin(t * 0.5 + i * 0.1) * 0.05;
      });
    }
  });

  const lines = useMemo(() => {
    const result = [];
    const size = 20;
    const divisions = 30;
    const step = size / divisions;

    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      // X 방향 라인
      result.push({
        points: [
          new THREE.Vector3(-size / 2, -3, i * step),
          new THREE.Vector3(size / 2, -3, i * step),
        ],
      });
      // Z 방향 라인
      result.push({
        points: [
          new THREE.Vector3(i * step, -3, -size / 2),
          new THREE.Vector3(i * step, -3, size / 2),
        ],
      });
    }
    return result;
  }, []);

  return (
    <group ref={gridRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line.points[0].x, line.points[0].y, line.points[0].z,
                line.points[1].x, line.points[1].y, line.points[1].z,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#0f172a" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  );
}

// ==========================================
// CAMERA CONTROLLER
// ==========================================
function CameraController({ phase }: { phase: string }) {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0, z: 5, lookX: 0, lookY: 0 });

  useFrame(() => {
    switch (phase) {
      case "genesis":
        targetRef.current = { x: 0, y: 0, z: 3, lookX: 0, lookY: 0 };
        break;
      case "exploding":
        targetRef.current = { x: 0, y: 0.5, z: 4, lookX: 0, lookY: 0 };
        break;
      case "building":
        targetRef.current = { x: 2, y: 1, z: 5, lookX: 0, lookY: 0 };
        break;
      case "complete":
        targetRef.current = { x: 3, y: 1.5, z: 6, lookX: 0, lookY: 0.5 };
        break;
    }

    // 부드러운 카메라 이동
    camera.position.x += (targetRef.current.x - camera.position.x) * 0.02;
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.02;
    camera.position.z += (targetRef.current.z - camera.position.z) * 0.02;

    camera.lookAt(targetRef.current.lookX, targetRef.current.lookY, 0);
  });

  return null;
}

// ==========================================
// MAIN SCENE
// ==========================================
function Scene({
  phase,
  onGenesisClick,
  onJinhyeokClick,
}: {
  phase: "genesis" | "exploding" | "building" | "complete";
  onGenesisClick: () => void;
  onJinhyeokClick: () => void;
}) {
  const [genesisHovered, setGenesisHovered] = useState(false);

  const showGenesis = phase === "genesis";
  const showExplosion = phase === "exploding";
  const showChain = phase === "building" || phase === "complete";

  return (
    <>
      {/* 배경 조명 */}
      <ambientLight intensity={0.1} />

      {/* 메인 키 라이트 */}
      <spotLight
        position={[8, 8, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />

      {/* 푸른 보조광 */}
      <pointLight position={[-8, 3, -5]} intensity={0.6} color="#3b82f6" />

      {/* 시안 림라이트 */}
      <pointLight position={[0, -5, 8]} intensity={0.4} color="#22d3ee" />

      {/* 보라색 액센트 */}
      <pointLight position={[5, -2, -8]} intensity={0.3} color="#a855f7" />

      {/* 사이버 그리드 */}
      <CyberGrid />

      {/* 우주 먼지 */}
      <AmbientParticles />

      {/* 네트워크 노드 */}
      <NetworkNodes visible={showChain} />

      {/* Genesis Block */}
      <GenesisBlock
        visible={showGenesis}
        onClick={onGenesisClick}
        isHovered={genesisHovered}
        onHover={setGenesisHovered}
      />

      {/* 폭발 파티클 */}
      <ExplosionParticles active={showExplosion} />

      {/* Blockchain */}
      <Blockchain
        visible={showChain}
        phase={phase}
        onJinhyeokClick={onJinhyeokClick}
      />

      {/* Camera */}
      <CameraController phase={phase} />

      {/* Post Processing */}
      <EffectComposer>
        <Bloom
          intensity={1}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0005, 0.0005)}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.7} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// EXPORT
// ==========================================
export default function Scene3D({
  phase,
  onGenesisClick,
  onJinhyeokClick,
}: {
  phase: "genesis" | "exploding" | "building" | "complete";
  onGenesisClick: () => void;
  onJinhyeokClick: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#030308"]} />
      <fog attach="fog" args={["#030308", 5, 20]} />
      <Scene phase={phase} onGenesisClick={onGenesisClick} onJinhyeokClick={onJinhyeokClick} />
    </Canvas>
  );
}
