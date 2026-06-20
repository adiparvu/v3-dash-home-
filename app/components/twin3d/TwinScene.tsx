"use client";

/**
 * TwinScene — the interactive 3D digital-twin diorama (demo).
 *
 * A floating-island model of the estate rendered with react-three-fiber:
 * glass house + greenhouse (transmission glass), a reflective lake, a solar
 * array, an orchard and the lake water-pump. Hotspots are clickable; a small
 * camera rig flies between framed views. Lighting is fully procedural
 * (Lightformer environment) so nothing is fetched at runtime.
 */
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Lightformer,
  Float,
  RoundedBox,
  MeshTransmissionMaterial,
  MeshReflectorMaterial,
  Html,
  Stars,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type HotspotId = "house" | "greenhouse" | "lake" | "solar" | "pump";
export type TwinView = "overview" | HotspotId;

export type Hotspot = {
  id: HotspotId;
  label: string;
  position: [number, number, number];
  color: string;
};

const VIEWS: Record<TwinView, { cam: [number, number, number]; target: [number, number, number] }> = {
  overview: { cam: [9.5, 7.5, 9.5], target: [0, 0.4, 0] },
  house: { cam: [2.4, 2.6, 4.6], target: [-1.6, 0.9, -1.2] },
  greenhouse: { cam: [4.8, 2.4, -1.4], target: [1.6, 0.7, 1.3] },
  lake: { cam: [-4.2, 2.6, 4.6], target: [-1.3, 0.2, 1.8] },
  solar: { cam: [5.0, 3.0, -4.2], target: [1.8, 0.4, -1.7] },
  pump: { cam: [-3.4, 2.0, 4.2], target: [-0.4, 0.5, 2.0] },
};

/* ── Camera rig: smoothly lerps to the active framed view ─────────────────── */
function Rig({ view, controls }: { view: TwinView; controls: React.MutableRefObject<OrbitControlsImpl | null> }) {
  const target = useMemo(() => new THREE.Vector3(...VIEWS[view].target), [view]);
  const camPos = useMemo(() => new THREE.Vector3(...VIEWS[view].cam), [view]);

  useFrame((state, delta) => {
    const k = 1 - Math.pow(0.0015, delta); // frame-rate-independent damping
    state.camera.position.lerp(camPos, k);
    if (controls.current) {
      controls.current.target.lerp(target, k);
      controls.current.update();
    }
  });
  return null;
}

/* ── Floating island ──────────────────────────────────────────────────────── */
function Island() {
  return (
    <group>
      {/* grass top */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[6, 6, 0.3, 64]} />
        <meshStandardMaterial color="#3f8f4f" roughness={0.95} metalness={0} />
      </mesh>
      {/* soil / rock underside (tapered) */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[6, 2.4, 2.6, 64]} />
        <meshStandardMaterial color="#5b4634" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, -2.9, 0]}>
        <coneGeometry args={[2.4, 1.6, 48]} />
        <meshStandardMaterial color="#48372a" roughness={1} />
      </mesh>
      {/* darker rim accent */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[6.02, 6.02, 0.06, 64]} />
        <meshStandardMaterial color="#2f6b3c" roughness={1} />
      </mesh>
    </group>
  );
}

/* ── Modern glass house ───────────────────────────────────────────────────── */
function House({ night }: { night: boolean }) {
  return (
    <group position={[-1.6, 0, -1.2]} rotation={[0, 0.35, 0]}>
      {/* base slab */}
      <RoundedBox args={[2.2, 0.18, 1.7]} radius={0.04} position={[0, 0.09, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#cfd6dd" roughness={0.7} />
      </RoundedBox>
      {/* white volume */}
      <RoundedBox args={[1.25, 1.0, 1.5]} radius={0.06} position={[-0.42, 0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f2f4f7" roughness={0.55} metalness={0.05} />
      </RoundedBox>
      {/* glass volume (transmission) */}
      <RoundedBox args={[1.05, 0.92, 1.42]} radius={0.05} position={[0.5, 0.58, 0]} castShadow>
        <MeshTransmissionMaterial
          thickness={0.5}
          roughness={0.05}
          transmission={1}
          ior={1.3}
          chromaticAberration={0.03}
          backside
          color="#cfeefe"
        />
      </RoundedBox>
      {/* warm interior glow seen through the glass at night */}
      <mesh position={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.6, 1.0]} />
        <meshStandardMaterial
          color={night ? "#ffd9a0" : "#fff4e0"}
          emissive={night ? "#ffb454" : "#000000"}
          emissiveIntensity={night ? 2.2 : 0}
          toneMapped={false}
        />
      </mesh>
      {/* wood accent + roof line */}
      <RoundedBox args={[1.3, 0.08, 1.55]} radius={0.03} position={[-0.42, 1.14, 0]} castShadow>
        <meshStandardMaterial color="#9a6a3c" roughness={0.8} />
      </RoundedBox>
      {/* wind/AC roof unit */}
      <mesh position={[-0.42, 1.26, 0.4]} castShadow>
        <boxGeometry args={[0.34, 0.16, 0.34]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ── Glass greenhouse (A-frame) ──────────────────────────────────────────── */
function Greenhouse({ night }: { night: boolean }) {
  return (
    <group position={[1.6, 0, 1.3]} rotation={[0, -0.5, 0]}>
      <RoundedBox args={[1.7, 0.12, 1.1]} radius={0.03} position={[0, 0.06, 0]} receiveShadow>
        <meshStandardMaterial color="#c7ccd2" roughness={0.8} />
      </RoundedBox>
      {/* glass body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.55, 0.85, 0.98]} />
        <MeshTransmissionMaterial thickness={0.3} roughness={0.08} transmission={1} ior={1.25} backside color="#d6fbe6" />
      </mesh>
      {/* gable roof glass */}
      <mesh position={[0, 1.12, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.05, 0.55, 4]} />
        <MeshTransmissionMaterial thickness={0.2} roughness={0.1} transmission={1} ior={1.25} backside color="#d6fbe6" />
      </mesh>
      {/* glowing plant rows inside */}
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.32, 0]}>
          <boxGeometry args={[0.22, 0.4, 0.8]} />
          <meshStandardMaterial
            color="#2fbf6a"
            emissive="#2fbf6a"
            emissiveIntensity={night ? 1.6 : 0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Reflective lake ─────────────────────────────────────────────────────── */
function Lake() {
  return (
    <group position={[-1.3, 0.02, 1.8]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35, 48]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.75}
          mixBlur={6}
          mixStrength={1.5}
          blur={[200, 60]}
          roughness={0.4}
          depthScale={0.6}
          color="#2b6c8f"
          metalness={0.2}
        />
      </mesh>
      {/* shoreline ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[1.33, 1.5, 48]} />
        <meshStandardMaterial color="#7c6b4a" roughness={1} />
      </mesh>
      <Sparkles count={26} scale={[2.4, 0.4, 2.4]} size={2} speed={0.3} color="#bfe9ff" position={[0, 0.15, 0]} />
    </group>
  );
}

/* ── Solar array ─────────────────────────────────────────────────────────── */
function SolarArray() {
  const panels = [-0.9, 0, 0.9];
  return (
    <group position={[1.8, 0, -1.7]} rotation={[0, 0.2, 0]}>
      {panels.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
            <meshStandardMaterial color="#7d858d" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.4, 0]} rotation={[-0.6, 0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.04, 0.5]} />
            <meshStandardMaterial color="#10243b" metalness={0.5} roughness={0.25} emissive="#0a2a5e" emissiveIntensity={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Water pump / tank ───────────────────────────────────────────────────── */
function WaterPump() {
  const blade = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (blade.current) blade.current.rotation.y += d * 0.8;
  });
  return (
    <group position={[-0.4, 0, 2.0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.9, 24]} />
        <meshStandardMaterial color="#9fb4c4" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 24]} />
        <meshStandardMaterial color="#6f8597" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* spinning impeller on top */}
      <group ref={blade} position={[0, 1.02, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0.12, 0, 0]} castShadow>
            <boxGeometry args={[0.24, 0.02, 0.06]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ── Low-poly orchard ────────────────────────────────────────────────────── */
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.4, 8]} />
        <meshStandardMaterial color="#7b5230" roughness={1} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#3aa856" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.12, 0.78, 0.05]} castShadow>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#43c267" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Orchard() {
  const trees = useMemo<{ p: [number, number, number]; s: number }[]>(() => {
    const out: { p: [number, number, number]; s: number }[] = [];
    const rng = (n: number) => (Math.sin(n * 99.13) * 0.5 + 0.5);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const r = 3.4 + rng(i) * 1.6;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      // keep trees off the structures (favor the open right/front arc)
      if (z < -2.6 && x < -0.5) continue;
      out.push({ p: [x, 0, z], s: 0.8 + rng(i + 7) * 0.5 });
    }
    return out;
  }, []);
  return (
    <group>
      {trees.map((t, i) => (
        <Tree key={i} position={t.p} scale={t.s} />
      ))}
    </group>
  );
}

/* ── Clickable hotspot pin ───────────────────────────────────────────────── */
function HotspotPin({
  spot,
  active,
  onSelect,
}: {
  spot: Hotspot;
  active: boolean;
  onSelect: (id: HotspotId) => void;
}) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.18;
      ring.current.scale.setScalar(active ? s * 1.3 : s);
    }
  });
  return (
    <group position={spot.position}>
      <Float speed={3} rotationIntensity={0} floatIntensity={0.6}>
        <mesh
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onSelect(spot.id);
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
          castShadow
        >
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color={spot.color} emissive={spot.color} emissiveIntensity={active ? 1.6 : 0.7} toneMapped={false} />
        </mesh>
        <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <ringGeometry args={[0.16, 0.2, 32]} />
          <meshBasicMaterial color={spot.color} transparent opacity={0.55} toneMapped={false} />
        </mesh>
        <Html center distanceFactor={9} position={[0, 0.34, 0]}>
          <div
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              color: "#06101c",
              background: active ? spot.color : "rgba(255,255,255,0.92)",
              border: `1px solid ${spot.color}`,
              boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
              pointerEvents: "none",
              transform: "translateY(-2px)",
            }}
          >
            {spot.label}
          </div>
        </Html>
      </Float>
    </group>
  );
}

/* ── Scene root ──────────────────────────────────────────────────────────── */
export default function TwinScene({
  view,
  night,
  hotspots,
  selected,
  onSelect,
}: {
  view: TwinView;
  night: boolean;
  hotspots: Hotspot[];
  selected: HotspotId | null;
  onSelect: (id: HotspotId) => void;
}) {
  const controls = useRef<OrbitControlsImpl | null>(null);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: VIEWS.overview.cam, fov: 38 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={[night ? "#070b18" : "#cfe6ff"]} />
      <fog attach="fog" args={[night ? "#070b18" : "#cfe6ff", 16, 34]} />

      {/* key sun */}
      <directionalLight
        castShadow
        position={night ? [-6, 9, -4] : [6, 11, 5]}
        intensity={night ? 0.5 : 2.1}
        color={night ? "#9bb6ff" : "#fff2dc"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <ambientLight intensity={night ? 0.35 : 0.6} />
      <hemisphereLight args={[night ? "#22305e" : "#bfe0ff", "#2c4a30", night ? 0.4 : 0.7]} />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.35}>
          <group>
            <Island />
            <House night={night} />
            <Greenhouse night={night} />
            <Lake />
            <SolarArray />
            <WaterPump />
            <Orchard />

            {hotspots.map((h) => (
              <HotspotPin key={h.id} spot={h} active={selected === h.id} onSelect={onSelect} />
            ))}
          </group>
        </Float>

        {/* contact shadow under the island */}
        <ContactShadows position={[0, -3.7, 0]} opacity={0.5} scale={20} blur={3} far={8} color="#000814" />

        {/* procedural reflections — no network fetch */}
        <Environment resolution={256}>
          <Lightformer intensity={night ? 0.6 : 2.2} position={[5, 6, 5]} scale={6} color="#fff3df" />
          <Lightformer intensity={night ? 0.8 : 1.2} position={[-6, 3, -4]} scale={5} color={night ? "#5f7bff" : "#bfe0ff"} />
          <Lightformer intensity={1} position={[0, -4, 0]} scale={8} color="#1b3a2a" />
        </Environment>

        {night && <Stars radius={60} depth={30} count={1200} factor={3} fade speed={0.6} />}
      </Suspense>

      <Rig view={view} controls={controls} />
      <OrbitControls
        ref={controls}
        enablePan={false}
        minDistance={5}
        maxDistance={16}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate={view === "overview"}
        autoRotateSpeed={0.45}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
