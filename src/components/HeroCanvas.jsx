import { useEffect, useRef } from 'react';

/**
 * Three.js neural graph background — dynamically imported inside useEffect
 * to avoid module-level TDZ issues with bundler namespace renaming.
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
      const NODE_COUNT = 80;
      const EDGE_DIST = 2.8;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.set(0, 0, 12);

      const positions = [];
      const nodeGeo = new THREE.BufferGeometry();
      const posArr = new Float32Array(NODE_COUNT * 3);
      const nodeData = [];

      for (let i = 0; i < NODE_COUNT; i++) {
        const x = (Math.random() - 0.5) * 18;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 6;
        posArr[i * 3] = x;
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = z;
        positions.push({ x, y, z });
        nodeData.push({ x, y, oz: z, vx: (Math.random() - 0.5) * 0.002, vy: (Math.random() - 0.5) * 0.002 });
      }

      nodeGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      const nodeMat = new THREE.PointsMaterial({
        size: 0.055, color: 0xAF994D, transparent: true, opacity: 0.65, sizeAttenuation: true,
      });
      const nodesMesh = new THREE.Points(nodeGeo, nodeMat);
      scene.add(nodesMesh);

      const edgePositions = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dz = positions[i].z - positions[j].z;
          if (Math.sqrt(dx * dx + dy * dy + dz * dz) < EDGE_DIST) {
            edgePositions.push(positions[i].x, positions[i].y, positions[i].z);
            edgePositions.push(positions[j].x, positions[j].y, positions[j].z);
          }
        }
      }

      const edgeGeo = new THREE.BufferGeometry();
      edgeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePositions), 3));
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xAF994D, transparent: true, opacity: 0.12 });
      scene.add(new THREE.LineSegments(edgeGeo, edgeMat));

      const accentCount = Math.floor(NODE_COUNT * 0.2);
      const accentGeo = new THREE.BufferGeometry();
      const accentPos = new Float32Array(accentCount * 3);
      for (let i = 0; i < accentCount; i++) {
        accentPos[i * 3] = (Math.random() - 0.5) * 18;
        accentPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        accentPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPos, 3));
      const accentMat = new THREE.PointsMaterial({ size: 0.035, color: 0xFF6B2C, transparent: true, opacity: 0.35, sizeAttenuation: true });
      scene.add(new THREE.Points(accentGeo, accentMat));

      let mouseX = 0, mouseY = 0;
      const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      let time = 0;
      let lastFrame = 0;
      const FRAME_MS = 1000 / 24;

      function animate(ts) {
        raf = requestAnimationFrame(animate);
        if (ts - lastFrame < FRAME_MS) return;
        lastFrame = ts;
        time += 0.001;

        const pos = nodeGeo.attributes.position;
        for (let i = 0; i < NODE_COUNT; i++) {
          nodeData[i].x += nodeData[i].vx;
          nodeData[i].y += nodeData[i].vy;
          if (Math.abs(nodeData[i].x) > 9) nodeData[i].vx *= -1;
          if (Math.abs(nodeData[i].y) > 5) nodeData[i].vy *= -1;
          pos.setXYZ(i, nodeData[i].x, nodeData[i].y, nodeData[i].oz + Math.sin(time * 0.5 + i * 0.4) * 0.3);
        }
        pos.needsUpdate = true;

        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.025;
        camera.position.y += (mouseY * 0.7 - camera.position.y) * 0.025;
        camera.lookAt(0, 0, 0);

        scene.rotation.y = time * 0.03;
        scene.rotation.z = Math.sin(time * 0.08) * 0.04;

        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);

      const onResize = () => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize, { passive: true });

      el._heroCleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
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
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}