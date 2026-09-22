import { useEffect, useRef } from 'react';

/**
 * Three.js Architectural Studio 3D Canvas — Inspired by high-end design agencies.
 * Features a centered floating sculpture with satin porcelain outer ring, champagne gold core,
 * and orbital ring nodes illuminated by multi-point studio lighting.
 * Designed with dynamic bounds checking so geometry is never clipped or truncated.
 */
export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    if (window.innerWidth < 768) return;

    let raf;

    import('three').then((THREE) => {
      const W = el.offsetWidth;
      const H = el.offsetHeight;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0xffffff, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);

      // Adjust camera distance adaptively to prevent clipping on narrow screens
      const adjustCamera = (w, h) => {
        const aspect = w / h;
        camera.aspect = aspect;
        camera.position.set(0, 0, aspect < 1.1 ? 10.5 : 8.5);
        camera.updateProjectionMatrix();
      };
      adjustCamera(W, H);

      // Studio Lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
      keyLight.position.set(6, 8, 6);
      keyLight.castShadow = true;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xaf994d, 1.2);
      fillLight.position.set(-6, -4, -2);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(0xd4af37, 2.0, 15);
      rimLight.position.set(0, 3, -3);
      scene.add(rimLight);

      // Root Sculptural Group (Centered safely at 0, 0, 0)
      const group = new THREE.Group();
      scene.add(group);

      // 1. Primary Outer Torus Knot — Satin Porcelain / Clearcoat Clay
      const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.42, 128, 32, 2, 3);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0xf2f2f4,
        roughness: 0.18,
        metalness: 0.08,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        reflectivity: 0.9,
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      knotMesh.castShadow = true;
      knotMesh.receiveShadow = true;
      group.add(knotMesh);

      // 2. Inner Floating Core — Champagne Metallic Gold Orb
      const coreGeo = new THREE.IcosahedronGeometry(0.85, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xaf994d,
        roughness: 0.15,
        metalness: 0.85,
        wireframe: false,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.castShadow = true;
      group.add(coreMesh);

      // 3. Precision Wireframe Cage — Architectural Geometry
      const cageGeo = new THREE.IcosahedronGeometry(1.0, 1);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0x121212,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);
      group.add(cageMesh);

      // 4. Orbital Ring Accent
      const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xaf994d,
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      group.add(ringMesh);

      let mouseX = 0, mouseY = 0;
      const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 1.2;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      let clock = new THREE.Clock();

      function animate() {
        raf = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Organic fluid rotations
        knotMesh.rotation.y = elapsedTime * 0.22;
        knotMesh.rotation.x = Math.sin(elapsedTime * 0.18) * 0.25;

        coreMesh.rotation.y = -elapsedTime * 0.35;
        coreMesh.rotation.z = Math.cos(elapsedTime * 0.25) * 0.2;

        cageMesh.rotation.x = elapsedTime * 0.15;
        cageMesh.rotation.y = elapsedTime * 0.12;

        ringMesh.rotation.z = elapsedTime * 0.1;

        // Smooth Mouse Parallax Easing
        group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.05;
        group.rotation.x += (-mouseY * 0.4 - group.rotation.x) * 0.05;

        renderer.render(scene, camera);
      }
      animate();

      const onResize = () => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        renderer.setSize(w, h);
        adjustCamera(w, h);
      };
      window.addEventListener('resize', onResize, { passive: true });

      el._heroCleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        knotGeo.dispose();
        knotMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        cageGeo.dispose();
        cageMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    });

    return () => {
      if (el._heroCleanup) el._heroCleanup();
      else cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[450px] relative pointer-events-none"
      aria-hidden="true"
    />
  );
}
