"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function WireBox({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * speed * 0.35;
    mesh.current.rotation.x += delta * speed * 0.12;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.45}>
      <mesh ref={mesh} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
      </mesh>
    </Float>
  );
}

function Scene() {
  const boxes = useMemo(
    () => [
      { position: [-2.2, 0.4, -1.2] as [number, number, number], color: "#38f9d7", scale: 0.55, speed: 0.7 },
      { position: [2.4, -0.2, -1.6] as [number, number, number], color: "#a78bfa", scale: 0.42, speed: 0.55 },
      { position: [0.6, 1.1, -2.4] as [number, number, number], color: "#f0abfc", scale: 0.32, speed: 0.9 },
    ],
    []
  );
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#030508", 6, 18]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 6, 4]} intensity={0.85} color="#38f9d7" />
      <pointLight position={[-5, 2, 3]} intensity={0.45} color="#7dd3fc" />
      <pointLight position={[0, -3, 5]} intensity={0.28} color="#f0abfc" />
      {boxes.map((b, i) => (
        <WireBox key={i} {...b} />
      ))}
    </>
  );
}

export default function HeroR3FFloaters() {
  return (
    <div className="absolute inset-0 z-[13] pointer-events-none" aria-hidden>
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0.35, 6.2], fov: 42, near: 0.1, far: 40 }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
