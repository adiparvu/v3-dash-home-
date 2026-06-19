"use client";

/**
 * Digital Twin 3D — estate scene (vanilla Three.js).
 *
 * Renders the property's modules as 3D nodes on a terrain (heleșteu, livadă,
 * greenhouse, casă, garaj, grădină), coloured by live status, with orbit
 * controls and tap-to-select → open module. Three is dynamically imported inside
 * the effect so it never runs during SSR / build. Reusable: drive `nodes` +
 * `statuses` from any live source; CesiumJS satellite terrain can replace the
 * ground plane later without changing the node model.
 */
import { useEffect, useRef, useState } from "react";
import type * as THREELIB from "three";
import { STATUS_COLOR, type MetricStatus } from "../../lib/monitor/types";

export type TwinNode = {
  id: string;
  label: string;
  route: string;
  kind: "box" | "water" | "trees" | "dome";
  pos: [number, number]; // x, z on the ground plane
  size?: [number, number, number];
};

const COLOR_HEX: Record<MetricStatus, number> = { ok: 0x4ade80, warn: 0xf59e0b, alert: 0xf97316 };

export default function EstateScene({
  nodes,
  statuses = {},
  height = 360,
}: {
  nodes: TwinNode[];
  statuses?: Record<string, MetricStatus>;
  height?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<TwinNode | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let raf = 0;
    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cleanup: () => void = () => {};

    (async () => {
      const THREE = (await import("three")) as typeof THREELIB;
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (disposed) return;

      const w = mount.clientWidth || 320;
      const h = height;
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x050a14, 22, 60);

      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
      camera.position.set(14, 13, 16);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.maxPolarAngle = Math.PI / 2.15;
      controls.minDistance = 8;
      controls.maxDistance = 44;
      controls.target.set(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.65));
      const sun = new THREE.DirectionalLight(0xffffff, 1.1);
      sun.position.set(10, 18, 8);
      scene.add(sun);

      // Ground + grid.
      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(20, 48),
        new THREE.MeshStandardMaterial({ color: 0x0c1626, roughness: 1 }),
      );
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);
      const grid = new THREE.GridHelper(40, 40, 0x1f2d44, 0x16203200);
      (grid.material as THREELIB.Material).opacity = 0.25;
      (grid.material as THREELIB.Material).transparent = true;
      scene.add(grid);

      // Label sprite from a canvas.
      const makeLabel = (text: string): THREELIB.Sprite => {
        const c = document.createElement("canvas");
        c.width = 256; c.height = 64;
        const ctx = c.getContext("2d")!;
        ctx.font = "bold 30px system-ui, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 128, 32);
        const tex = new THREE.CanvasTexture(c);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
        sprite.scale.set(4, 1, 1);
        return sprite;
      };

      const pickables: THREELIB.Object3D[] = [];
      for (const n of nodes) {
        const status = statuses[n.id] ?? "ok";
        const color = COLOR_HEX[status];
        const group = new THREE.Group();
        group.position.set(n.pos[0], 0, n.pos[1]);
        group.userData = { node: n };

        if (n.kind === "water") {
          const disk = new THREE.Mesh(
            new THREE.CylinderGeometry(2.2, 2.2, 0.25, 32),
            new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.8, roughness: 0.2, metalness: 0.3 }),
          );
          disk.position.y = 0.12;
          group.add(disk);
        } else if (n.kind === "trees") {
          const pad = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 3.4), new THREE.MeshStandardMaterial({ color: 0x1a2e12 }));
          pad.position.y = 0.1; group.add(pad);
          for (let i = 0; i < 6; i++) {
            const tree = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 8), new THREE.MeshStandardMaterial({ color }));
            tree.position.set(-1.4 + (i % 3) * 1.4, 0.9, -0.8 + Math.floor(i / 3) * 1.6);
            group.add(tree);
          }
        } else if (n.kind === "dome") {
          const base = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2.4), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }));
          base.position.y = 0.5; group.add(base);
          const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 16, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.55 }));
          roof.rotation.z = Math.PI / 2; roof.position.y = 1; group.add(roof);
        } else {
          const [sx, sy, sz] = n.size ?? [2.6, 2, 2.6];
          const box = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshStandardMaterial({ color, roughness: 0.6 }));
          box.position.y = sy / 2; group.add(box);
        }

        const label = makeLabel(n.label);
        label.position.set(0, 3, 0);
        group.add(label);
        scene.add(group);
        pickables.push(group);
      }

      // Pointer picking.
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let downX = 0, downY = 0;
      const onDown = (e: PointerEvent) => { downX = e.clientX; downY = e.clientY; };
      const onUp = (e: PointerEvent) => {
        if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) return; // drag, not tap
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(pickables, true);
        if (hits.length) {
          let o: THREELIB.Object3D | null = hits[0].object;
          while (o && !o.userData?.node) o = o.parent;
          if (o?.userData?.node) setSelected(o.userData.node as TwinNode);
        } else {
          setSelected(null);
        }
      };
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointerup", onUp);

      const onResize = () => {
        const nw = mount.clientWidth || w;
        camera.aspect = nw / h;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, h);
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointerup", onUp);
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, [nodes, statuses, height]);

  return (
    <div className="relative">
      <div ref={mountRef} className="w-full rounded-2xl overflow-hidden liquid-glass" style={{ height }} />
      {selected && (
        <a
          href={selected.route}
          className="absolute left-3 bottom-3 right-3 flex items-center justify-between rounded-2xl px-4 py-3 liquid-glass"
          style={{ background: "rgba(8,17,30,0.85)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{selected.label}</p>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>Atinge pentru a deschide modulul</p>
          </div>
          <span className="text-sm" style={{ color: STATUS_COLOR[statuses[selected.id] ?? "ok"] }}>→</span>
        </a>
      )}
    </div>
  );
}
