"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = "#FF6B47";
const ACCENT_SOFT = "#FFB088";

// 4 направления школы. z-глубина задаёт слой parallax: чем ближе к камере
// (z больше), тем сильнее иконка реагирует на курсор.
// Все иконки живут в открытой правой зоне hero (слева — текстовая колонка),
// вертикальной диагональю на разной глубине parallax.
const ICONS = [
  { glyph: "📱", pos: [2.0, 1.75, 0.6], depth: 1.1, size: 0.95, speed: 0.9 },
  { glyph: "🎮", pos: [3.25, 0.5, 0.2], depth: 0.85, size: 1.05, speed: 1.15 },
  { glyph: "⚙️", pos: [3.5, -0.6, -0.3], depth: 0.55, size: 0.8, speed: 0.75 },
  { glyph: "🌐", pos: [2.4, -1.35, 0.9], depth: 1.3, size: 0.9, speed: 1.0 },
] as const;

/** Рисуем эмодзи на прозрачной canvas-текстуре для грани «чипа». */
function useGlyphTexture(glyph: string) {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    ctx.font = `${size * 0.62}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, size / 2, size / 2 + size * 0.04);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [glyph]);
}

function FloatingIcon({
  glyph,
  pos,
  depth,
  size,
  speed,
  pointer,
}: {
  glyph: string;
  pos: readonly [number, number, number];
  depth: number;
  size: number;
  speed: number;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const tex = useGlyphTexture(glyph);
  // Разводим фазы, чтобы иконки не колыхались синхронно.
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Мягкое парение + параллакс от курсора, пропорциональный глубине слоя.
    g.position.x = pos[0] + pointer.current.x * depth * 0.9;
    g.position.y =
      pos[1] + Math.sin(t * speed + phase) * 0.22 + pointer.current.y * depth * 0.6;
    g.rotation.x = Math.sin(t * speed * 0.7 + phase) * 0.28 - pointer.current.y * 0.35;
    g.rotation.y = Math.cos(t * speed * 0.5 + phase) * 0.4 + pointer.current.x * 0.5;
  });

  return (
    <group ref={group} position={pos as unknown as THREE.Vector3} scale={size}>
      <RoundedBox args={[1, 1, 0.32]} radius={0.14} smoothness={4}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.35}
          metalness={0.1}
          emissive={ACCENT}
          emissiveIntensity={0.06}
        />
      </RoundedBox>
      {/* Грань с эмодзи чуть выдвинута вперёд. */}
      <mesh position={[0, 0, 0.17]}>
        <planeGeometry args={[0.82, 0.82]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  // Лёгкое «дыхание» камеры вслед за курсором — усиливает ощущение глубины.
  useFrame(() => {
    camera.position.x += (pointer.current.x * 0.4 - camera.position.x) * 0.04;
    camera.position.y += (pointer.current.y * 0.3 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 3]} intensity={40} color={ACCENT} />
      <pointLight position={[4, 3, 2]} intensity={18} color={ACCENT_SOFT} />
      {ICONS.map((icon) => (
        <FloatingIcon key={icon.glyph} {...icon} pointer={pointer} />
      ))}
    </>
  );
}

/**
 * Прозрачный WebGL-слой поверх hero: 4 плавающие 3D-иконки направлений
 * с параллаксом от движения мыши. Монтируется только на десктопе (см. гейт в
 * page.tsx), поэтому на мобильных телефонах three.js не грузится вовсе.
 */
export default function HeroCanvas() {
  const pointer = useRef({ x: 0, y: 0 });

  // Трекаем курсор на window: слой сам pointer-events:none, чтобы не
  // перехватывать клики по CTA и ссылкам под ним.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="absolute inset-0 z-[15]" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene pointer={pointer} />
      </Canvas>
    </div>
  );
}
