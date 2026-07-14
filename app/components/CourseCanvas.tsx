"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Line } from "@react-three/drei";
import * as THREE from "three";

export type CourseKind = "mobdev" | "gamedev" | "web" | "backend" | "harvard";

// Строго палитра «Полночный закат» — коралл остаётся основным.
const ACCENT = "#FF6B47";
const ACCENT_SOFT = "#FFB088";
const GRAPHITE = "#2A2A35"; // вторичный «холодный» из --muted (тёмная тема)
const CRIMSON = "#A51C30"; // фирменный Harvard-crimson — только на бейдже CS50

/** Текстовая текстура на прозрачной canvas (для бейджей внутри сцены). */
function makeTextTexture(text: string, bg: string, fg = "#ffffff") {
  const w = 512, h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const r = 40;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(8, 8, w - 16, h - 16, r);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.font = "bold 150px 'Bricolage Grotesque', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2 + 8);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ─────────────── 📱 Мобильная разработка — плавающий телефон ─────────────── */
function PhoneScene() {
  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
      <group rotation={[0.1, -0.35, 0.05]}>
        {/* Корпус */}
        <RoundedBox args={[1.15, 2.3, 0.16]} radius={0.16} smoothness={4}>
          <meshStandardMaterial color="#2A2A38" roughness={0.5} metalness={0.15} />
        </RoundedBox>
        {/* Экран */}
        <mesh position={[0, 0.06, 0.09]}>
          <planeGeometry args={[0.95, 1.95]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.45}
            roughness={0.6}
          />
        </mesh>
        {/* UI-полосы на экране */}
        {[0.6, 0.2, -0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.11]}>
            <planeGeometry args={[0.72, 0.14]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} toneMapped={false} />
          </mesh>
        ))}
        {/* Кнопка снизу */}
        <mesh position={[0, -0.72, 0.11]}>
          <circleGeometry args={[0.16, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─────────────── 🎮 Геймдев — низкополигональный мир ─────────────── */
function GameScene() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });
  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.4, 6]} />
        <meshStandardMaterial color={GRAPHITE} flatShading roughness={0.9} />
      </mesh>
      {/* Пики-«горы» */}
      {[
        [-0.7, 0.3, -0.4],
        [0.6, 0.1, 0.5],
        [0.1, 0.5, -0.7],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <coneGeometry args={[0.35, 0.9, 5]} />
          <meshStandardMaterial color={ACCENT_SOFT} flatShading roughness={0.8} />
        </mesh>
      ))}
      {/* Парящий кристалл-«монетка» */}
      <Float speed={3} floatIntensity={1.2}>
        <mesh position={[0, 0.95, 0]}>
          <icosahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.5}
            flatShading
          />
        </mesh>
      </Float>
    </group>
  );
}

/* ─────────────── 🌐 Веб — floating browser window ─────────────── */
function BrowserScene() {
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.6}>
      <group rotation={[0.08, 0.3, 0]}>
        <RoundedBox args={[2.6, 1.8, 0.12]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0.1} />
        </RoundedBox>
        {/* Адресная строка */}
        <mesh position={[0, 0.72, 0.07]}>
          <planeGeometry args={[2.4, 0.3]} />
          <meshBasicMaterial color="#F5E6D3" toneMapped={false} />
        </mesh>
        {/* Три «светофора» */}
        {[-1.05, -0.9, -0.75].map((x, i) => (
          <mesh key={i} position={[x, 0.72, 0.09]}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color={[ACCENT, ACCENT_SOFT, GRAPHITE][i]} toneMapped={false} />
          </mesh>
        ))}
        {/* Контент: hero-блок + карточки */}
        <mesh position={[-0.55, 0.15, 0.07]}>
          <planeGeometry args={[1.1, 0.65]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.3} />
        </mesh>
        {[
          [0.75, 0.32],
          [0.75, -0.05],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], p[1], 0.07]}>
            <planeGeometry args={[0.9, 0.22]} />
            <meshBasicMaterial color="#E8DDD0" toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, -0.55, 0.07]}>
          <planeGeometry args={[2.3, 0.35]} />
          <meshBasicMaterial color="#F5E6D3" toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─────────────── ⚙️ Бэкенд — соединяющиеся ноды и сервер ─────────────── */
function BackendScene() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.4;
  });

  const nodes = useMemo(
    () =>
      [
        [1.3, 0.6, 0.2],
        [-1.2, 0.4, -0.5],
        [0.9, -0.9, 0.6],
        [-0.9, -0.7, 0.4],
        [0.1, 1.2, -0.3],
      ] as [number, number, number][],
    []
  );

  return (
    <group ref={group}>
      {/* Центральный «сервер» */}
      <group>
        {[0.35, 0, -0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.9, 0.26, 0.9]} />
            <meshStandardMaterial color="#33333f" roughness={0.55} metalness={0.15} />
          </mesh>
        ))}
        {[0.35, 0, -0.35].map((y, i) => (
          <mesh key={`led-${i}`} position={[0.32, y, 0.46]}>
            <circleGeometry args={[0.04, 12]} />
            <meshBasicMaterial color={ACCENT} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* Ноды + связи */}
      {nodes.map((p, i) => (
        <group key={i}>
          <Line points={[[0, 0, 0], p]} color={ACCENT} lineWidth={1.5} transparent opacity={0.5} />
          <Float speed={2 + i * 0.3} floatIntensity={0.6}>
            <mesh position={p}>
              <sphereGeometry args={[0.16, 20, 20]} />
              <meshStandardMaterial
                color={i % 2 ? ACCENT_SOFT : ACCENT}
                emissive={i % 2 ? ACCENT_SOFT : ACCENT}
                emissiveIntensity={0.6}
              />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  );
}

/* ─────────────── 🎓 Гарвардский курс CS50 — конфедератка + бейдж ─────────────── */
function HarvardScene() {
  const cap = useRef<THREE.Group>(null);
  const badgeTex = useMemo(() => makeTextTexture("CS50", CRIMSON), []);
  useFrame((state) => {
    if (cap.current) cap.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.4;
  });
  return (
    <group>
      {/* Конфедератка (mortarboard) */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
        <group ref={cap} position={[0, 0.55, 0]} rotation={[0.15, 0, 0]}>
          {/* Плоская квадратная доска */}
          <mesh position={[0, 0.32, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[1.7, 0.07, 1.7]} />
            <meshStandardMaterial color={GRAPHITE} roughness={0.5} metalness={0.15} />
          </mesh>
          {/* Тулья */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.42, 0.5, 0.42, 24]} />
            <meshStandardMaterial color="#1f1f2b" roughness={0.6} />
          </mesh>
          {/* Пуговка */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.5} />
          </mesh>
          {/* Кисточка */}
          <Line
            points={[[0, 0.4, 0], [0.62, 0.42, 0.62], [0.7, -0.35, 0.7]]}
            color={ACCENT}
            lineWidth={2}
          />
          <mesh position={[0.7, -0.4, 0.7]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.4} />
          </mesh>
        </group>
      </Float>
      {/* Парящий бейдж CS50 */}
      <Float speed={2.2} floatIntensity={1.1}>
        <mesh position={[0, -1.15, 0.4]} rotation={[0, -0.15, 0]}>
          <planeGeometry args={[1.5, 0.75]} />
          <meshBasicMaterial map={badgeTex} transparent toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene({ kind }: { kind: CourseKind }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <pointLight position={[-4, -2, 3]} intensity={30} color={ACCENT} />
      <pointLight position={[4, 3, 4]} intensity={12} color="#ffffff" />
      {kind === "mobdev" && <PhoneScene />}
      {kind === "gamedev" && <GameScene />}
      {kind === "web" && <BrowserScene />}
      {kind === "backend" && <BackendScene />}
      {kind === "harvard" && <HarvardScene />}
    </>
  );
}

/**
 * Одна 3D-сцена под конкретное направление. Монтируется из page.tsx только
 * когда карточка во вьюпорте и только на десктопе — WebGL-контекст не висит
 * впустую и не грузится на мобильных.
 */
export default function CourseCanvas({ kind }: { kind: CourseKind }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene kind={kind} />
    </Canvas>
  );
}
