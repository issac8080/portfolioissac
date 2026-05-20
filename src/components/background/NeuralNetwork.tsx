"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useHeroBackgroundMotion } from "@/context/HeroBackgroundMotion";

/** Tuned for smooth 60fps — fewer points, no per-vertex CPU writes each frame. */
const PARTICLE_COUNT = 72;
const CONNECTION_DISTANCE = 1.72;
const MAX_SEGMENTS = 520;

/** Smooth camera drift — hero springs when wrapped in provider; else canvas pointer */
function CameraRig() {
  const motionCtx = useHeroBackgroundMotion();

  useFrame((state) => {
    const { camera, pointer } = state;
    let tx: number;
    let ty: number;
    if (motionCtx) {
      tx = motionCtx.springX.get() * 10;
      ty = motionCtx.springY.get() * 7;
    } else {
      tx = pointer.x * 5;
      ty = pointer.y * 3.5;
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.08);
    camera.position.z = 8;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.038;
    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.035;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#38f9d7"
        transparent
        opacity={0.78}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Connections() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 9
        )
      );
    }
    return pts;
  }, []);

  const { segments, positions } = useMemo(() => {
    const segments: [number, number][] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (segments.length >= MAX_SEGMENTS) break;
        if (points[i].distanceTo(points[j]) < CONNECTION_DISTANCE) {
          segments.push([i, j]);
        }
      }
      if (segments.length >= MAX_SEGMENTS) break;
    }
    const pos = new Float32Array(segments.length * 2 * 3);
    segments.forEach(([a, b], i) => {
      points[a].toArray(pos, i * 6);
      points[b].toArray(pos, i * 6 + 3);
    });
    return { segments, positions: pos };
  }, [points]);

  useFrame((state) => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y = state.clock.elapsedTime * 0.045;
    lineRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.14 + Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={segments.length * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#a78bfa"
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function Scene() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime;
    lightRef.current.position.x = Math.sin(t * 0.25) * 6;
    lightRef.current.position.y = Math.cos(t * 0.2) * 4 + 2;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={lightRef} position={[5, 5, 6]} color="#38f9d7" intensity={1.05} />
      <pointLight position={[-4, -3, 4]} color="#7dd3fc" intensity={0.5} />
      <pointLight position={[2, -4, 2]} color="#f0abfc" intensity={0.35} />
      <CameraRig />
      <Particles />
      <Connections />
    </>
  );
}

export default function NeuralNetwork() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 58 }}
        dpr={[1, 1.35]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
