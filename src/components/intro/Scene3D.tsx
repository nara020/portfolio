/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// 시드 기반 랜덤
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ==========================================
// PHASE 1: 특이점 (Singularity)
// ==========================================
function Singularity({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 1;
      meshRef.current.scale.setScalar(pulse * (hovered ? 1.3 : 1));
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (glowRef.current) {
      const glowPulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1;
      glowRef.current.scale.setScalar(glowPulse * 2 * (hovered ? 1.5 : 1));
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>
      {[0.5, 0.7, 0.9].map((size, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size - 0.02, size, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.2 - i * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <pointLight position={[0, 0, 2]} intensity={2} color="#22d3ee" />
    </group>
  );
}

// ==========================================
// PHASE 2: 빅뱅 폭발 파티클
// ==========================================
function BigBangExplosion({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const count = 2000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      const theta = seededRandom(i * 1.1) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 2.2) - 1);
      const speed = seededRandom(i * 3.3) * 30 + 10;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;

      const color = new THREE.Color();
      color.setHSL(0.5 + seededRandom(i * 4.4) * 0.3, 1, 0.6);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    velocitiesRef.current = vel;
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (particlesRef.current && active && velocitiesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocitiesRef.current[i * 3] * delta;
        positions[i * 3 + 1] += velocitiesRef.current[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocitiesRef.current[i * 3 + 2] * delta;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ==========================================
// PHASE 2: 웜홀 터널
// ==========================================
function WormholeTunnel({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const tunnelRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const { camera } = useThree();

  const rings = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      z: -i * 2,
      radius: 3 + Math.sin(i * 0.3) * 0.5,
      rotation: i * 0.1,
      color: i % 2 === 0 ? "#22d3ee" : "#a855f7",
    }));
  }, []);

  const dataStreams = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const angle = (i / 50) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 2.5,
        y: Math.sin(angle) * 2.5,
        speed: seededRandom(i) * 2 + 1,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (active && tunnelRef.current) {
      progressRef.current += delta * 50;
      camera.position.z -= delta * 80;
      tunnelRef.current.rotation.z += delta * 0.5;
      if (progressRef.current > 100) {
        onComplete();
      }
    }
  });

  if (!active) return null;

  return (
    <group ref={tunnelRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[0, 0, ring.rotation]}>
          <torusGeometry args={[ring.radius, 0.02, 8, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.6} />
        </mesh>
      ))}
      {dataStreams.map((stream, i) => (
        <mesh key={`stream-${i}`} position={[stream.x, stream.y, -100]}>
          <boxGeometry args={[0.1, 0.1, 200]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// PHASE 3: 블록체인 큐브
// ==========================================
function BlockchainCube({
  position,
  scale = 1,
  delay = 0,
  color = "#22d3ee"
}: {
  position: [number, number, number];
  scale?: number;
  delay?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state) => {
    if (meshRef.current && visible) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (!visible) return null;

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position} scale={scale}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.02, 1.02, 1.02)]} />
          <lineBasicMaterial color={color} transparent opacity={0.8} />
        </lineSegments>
        <mesh scale={0.5}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function ConnectionLine({
  start,
  end,
  delay = 0
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((_, delta) => {
    if (visible && progress < 1) {
      setProgress((prev) => Math.min(prev + delta * 2, 1));
    }
  });

  if (!visible) return null;

  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(
      start[0] + (end[0] - start[0]) * progress,
      start[1] + (end[1] - start[1]) * progress,
      start[2] + (end[2] - start[2]) * progress
    ),
  ];

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0.6} />
    </line>
  );
}

function BlockchainChains() {
  const chains = [
    { cubes: [
      { pos: [-2, 1.5, 0] as [number, number, number], delay: 0.5 },
      { pos: [-0.5, 0.5, 0.5] as [number, number, number], delay: 0.8 },
      { pos: [1, -0.5, 0] as [number, number, number], delay: 1.1 },
      { pos: [2.5, -1.5, 0.5] as [number, number, number], delay: 1.4 },
    ]},
    { cubes: [
      { pos: [3, 2, -2] as [number, number, number], delay: 1.0, scale: 0.7, color: "#a855f7" },
      { pos: [4, 1, -1.5] as [number, number, number], delay: 1.3, scale: 0.7, color: "#a855f7" },
      { pos: [5, 0, -1] as [number, number, number], delay: 1.6, scale: 0.7, color: "#a855f7" },
    ]},
    { cubes: [
      { pos: [-4, -1, -1] as [number, number, number], delay: 1.2, scale: 0.6, color: "#3b82f6" },
      { pos: [-3.5, -2, -0.5] as [number, number, number], delay: 1.5, scale: 0.6, color: "#3b82f6" },
      { pos: [-3, -3, 0] as [number, number, number], delay: 1.8, scale: 0.6, color: "#3b82f6" },
    ]},
  ];

  return (
    <group>
      {chains.map((chain, chainIndex) => (
        <group key={chainIndex}>
          {chain.cubes.map((cube: any, i: number) => (
            <BlockchainCube
              key={`${chainIndex}-${i}`}
              position={cube.pos}
              scale={cube.scale || 1}
              delay={cube.delay}
              color={cube.color || "#22d3ee"}
            />
          ))}
          {chain.cubes.slice(1).map((cube: any, i: number) => (
            <ConnectionLine
              key={`line-${chainIndex}-${i}`}
              start={chain.cubes[i].pos}
              end={cube.pos}
              delay={cube.delay + 0.2}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 1.1) - 0.5) * 20;
      pos[i * 3 + 1] = (seededRandom(i * 2.2) - 0.5) * 20;
      pos[i * 3 + 2] = (seededRandom(i * 3.3) - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(0.5 + seededRandom(i * 4.4) * 0.2, 0.8, 0.6);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} />
    </points>
  );
}

function CameraController({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0, z: 8 });

  useEffect(() => {
    camera.position.set(0, 0, 8);
    targetRef.current = { x: 0, y: 0, z: 8 };
  }, [camera]);

  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled]);

  useFrame(() => {
    if (!enabled) return;
    targetRef.current.x = mouseRef.current.x * 2;
    targetRef.current.y = -mouseRef.current.y * 1.5;

    camera.position.x += (targetRef.current.x - camera.position.x) * 0.02;
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.02;
    camera.position.z += (targetRef.current.z - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene({
  phase,
  onSingularityClick,
  onWormholeComplete
}: {
  phase: "singularity" | "bigbang" | "wormhole" | "universe";
  onSingularityClick: () => void;
  onWormholeComplete: () => void;
}) {
  return (
    <>
      <ambientLight intensity={0.1} />
      {phase === "universe" && (
        <>
          <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        </>
      )}

      {phase === "singularity" && <Singularity onClick={onSingularityClick} />}
      <BigBangExplosion active={phase === "bigbang"} />
      <WormholeTunnel active={phase === "wormhole"} onComplete={onWormholeComplete} />

      {phase === "universe" && (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ParticleField />
          <BlockchainChains />
        </>
      )}

      <CameraController enabled={phase === "universe"} />

      <EffectComposer>
        <Bloom
          intensity={phase === "bigbang" ? 3 : 1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(phase === "wormhole" ? 0.01 : 0.002, phase === "wormhole" ? 0.01 : 0.002)}
        />
      </EffectComposer>
    </>
  );
}

export default function Scene3D({
  phase,
  onSingularityClick,
  onWormholeComplete
}: {
  phase: "singularity" | "bigbang" | "wormhole" | "universe";
  onSingularityClick: () => void;
  onWormholeComplete: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene
          phase={phase}
          onSingularityClick={onSingularityClick}
          onWormholeComplete={onWormholeComplete}
        />
      </Suspense>
    </Canvas>
  );
}
