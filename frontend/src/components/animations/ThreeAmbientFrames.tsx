import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Lightweight, selective Three.js interactive ambient showcase:
 * Composite multi-part gilded brass photography frames & golden lantern dust particles
 * gently responding to pointer parallax.
 *
 * Implements mandatory Three.js skill standards:
 * - GPU renderer string probe (`isSoftwareGl`)
 * - RoomEnvironment PBR reflection map
 * - Composite 4-part gilded frames (outer bevel, gold fillet, passe-partout, backing)
 * - Software-WebGL `afterDraw` pacing & complete GPU resource disposal on unmount
 */
export default function ThreeAmbientFrames() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount || prefersReduced) return;

    // Software WebGL probe
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = mount.clientWidth || 640;
    const height = mount.clientHeight || 400;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio environment reflection for metallic antique gold bevels
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 8.2);

    // Warm/cool 3-point studio lighting
    const hemi = new THREE.HemisphereLight(0xf7f2e9, 0x2a1419, 0.9);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffdfb0, 1.9);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc5a46d, 1.1);
    rimLight.position.set(-6, -2, 4);
    scene.add(rimLight);

    // Shared materials with varied roughness/metalness
    const antiqueGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xc5a46d,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.4,
    });
    const burgundyVelvetMat = new THREE.MeshStandardMaterial({
      color: 0x57252f,
      metalness: 0.08,
      roughness: 0.85,
    });
    const warmIvoryMat = new THREE.MeshStandardMaterial({
      color: 0xf7f2e9,
      metalness: 0.02,
      roughness: 0.72,
    });
    const darkWalnutMat = new THREE.MeshStandardMaterial({
      color: 0x1e1917,
      metalness: 0.15,
      roughness: 0.52,
    });

    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [
      antiqueGoldMat,
      burgundyVelvetMat,
      warmIvoryMat,
      darkWalnutMat,
    ];

    /**
     * Build a composite 4-part architectural photography frame group
     * (outer walnut mould + inner antique gold fillet + ivory passe-partout + recessed burgundy velvet canvas)
     */
    function createGalleryFrame(w: number, h: number): THREE.Group {
      const group = new THREE.Group();
      const border = 0.12;
      const depth = 0.14;

      // 1. Outer bevelled frame rails (4 pieces)
      const topRailGeo = new THREE.BoxGeometry(w + border * 2, border, depth);
      const sideRailGeo = new THREE.BoxGeometry(border, h, depth);
      disposables.push(topRailGeo, sideRailGeo);

      const topRail = new THREE.Mesh(topRailGeo, darkWalnutMat);
      topRail.position.set(0, h / 2 + border / 2, 0);
      const bottomRail = new THREE.Mesh(topRailGeo, darkWalnutMat);
      bottomRail.position.set(0, -h / 2 - border / 2, 0);
      const leftRail = new THREE.Mesh(sideRailGeo, darkWalnutMat);
      leftRail.position.set(-w / 2 - border / 2, 0, 0);
      const rightRail = new THREE.Mesh(sideRailGeo, darkWalnutMat);
      rightRail.position.set(w / 2 + border / 2, 0, 0);

      // 2. Inner antique gold fillet rails
      const goldTopGeo = new THREE.BoxGeometry(w + 0.04, 0.045, depth + 0.02);
      const goldSideGeo = new THREE.BoxGeometry(0.045, h, depth + 0.02);
      disposables.push(goldTopGeo, goldSideGeo);

      const gTop = new THREE.Mesh(goldTopGeo, antiqueGoldMat);
      gTop.position.set(0, h / 2 - 0.01, 0.01);
      const gBot = new THREE.Mesh(goldTopGeo, antiqueGoldMat);
      gBot.position.set(0, -h / 2 + 0.01, 0.01);
      const gLeft = new THREE.Mesh(goldSideGeo, antiqueGoldMat);
      gLeft.position.set(-w / 2 + 0.01, 0, 0.01);
      const gRight = new THREE.Mesh(goldSideGeo, antiqueGoldMat);
      gRight.position.set(w / 2 - 0.01, 0, 0.01);

      // 3. Ivory archival passe-partout mat
      const matGeo = new THREE.BoxGeometry(w - 0.04, h - 0.04, 0.03);
      disposables.push(matGeo);
      const matMesh = new THREE.Mesh(matGeo, warmIvoryMat);
      matMesh.position.set(0, 0, -0.02);

      // 4. Inner recessed burgundy fine-art centre plate
      const innerGeo = new THREE.BoxGeometry(w * 0.72, h * 0.74, 0.032);
      disposables.push(innerGeo);
      const innerMesh = new THREE.Mesh(innerGeo, burgundyVelvetMat);
      innerMesh.position.set(0, 0, -0.012);

      group.add(topRail, bottomRail, leftRail, rightRail, gTop, gBot, gLeft, gRight, matMesh, innerMesh);
      return group;
    }

    const rig = new THREE.Group();
    scene.add(rig);

    const frameSpecs = [
      { w: 1.9, h: 2.5, x: -3.2, y: 0.45, z: -0.6, ry: 0.28, rx: 0.05 },
      { w: 2.3, h: 1.65, x: 0.0, y: -0.15, z: 0.35, ry: -0.08, rx: 0.02 },
      { w: 1.75, h: 2.35, x: 3.15, y: 0.35, z: -0.8, ry: -0.32, rx: -0.04 },
    ];

    const frames = frameSpecs.map((spec) => {
      const f = createGalleryFrame(spec.w, spec.h);
      f.position.set(spec.x, spec.y, spec.z);
      f.rotation.set(spec.rx, spec.ry, 0);
      rig.add(f);
      return { mesh: f, base: spec };
    });

    // Subtle instanced warm antique gold motes (36 particles)
    const moteCount = 36;
    const moteGeo = new THREE.OctahedronGeometry(0.035, 0);
    disposables.push(moteGeo);
    const motes = new THREE.InstancedMesh(moteGeo, antiqueGoldMat, moteCount);
    const dummy = new THREE.Object3D();
    const moteSeeds = Array.from({ length: moteCount }, (_, i) => ({
      x: (Math.sin(i * 19.3) * 5.2),
      y: (Math.cos(i * 11.7) * 2.6),
      z: (Math.sin(i * 7.1) * 2.2) - 0.5,
      speed: 0.3 + (i % 5) * 0.12,
      phase: i * 0.7,
      scale: 0.65 + (i % 4) * 0.25,
    }));
    motes.frustumCulled = false;
    scene.add(motes);

    // Smooth pointer parallax tracking
    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetPointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetPointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth || 640;
      const h = mount.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      currentPointer.x = THREE.MathUtils.damp(currentPointer.x, targetPointer.x, 3.2, dt);
      currentPointer.y = THREE.MathUtils.damp(currentPointer.y, targetPointer.y, 3.2, dt);

      rig.rotation.y = currentPointer.x * 0.16;
      rig.rotation.x = currentPointer.y * 0.08;

      frames.forEach(({ mesh, base }, i) => {
        mesh.position.y = base.y + Math.sin(elapsed * 0.75 + i * 1.9) * 0.14;
        mesh.rotation.y = base.ry + Math.sin(elapsed * 0.45 + i) * 0.06;
      });

      for (let i = 0; i < moteCount; i++) {
        const s = moteSeeds[i];
        dummy.position.set(
          s.x + Math.sin(elapsed * s.speed + s.phase) * 0.2,
          s.y + Math.cos(elapsed * s.speed + s.phase) * 0.25,
          s.z
        );
        dummy.rotation.set(elapsed * 0.4 + s.phase, elapsed * 0.5, 0);
        dummy.scale.setScalar(s.scale);
        dummy.updateMatrix();
        motes.setMatrixAt(i, dummy.matrix);
      }
      motes.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      envRT.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced]);

  if (prefersReduced) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-75"
    />
  );
}
