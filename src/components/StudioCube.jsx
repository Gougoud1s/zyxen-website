import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

export default function StudioCube() {
  const host = useRef(null);
  useEffect(() => {
    const element = host.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 8, 19);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    element.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 2.7, 8.8);
    camera.lookAt(0, 0.7, 0);
    const geometry = new THREE.BoxGeometry(2.25, 2.25, 2.25, 24, 24, 24);
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `varying vec3 p; varying vec3 n; void main(){p=position;n=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform float time; varying vec3 p; varying vec3 n;
      void main(){
        float wave=sin(p.x*5.+sin(p.y*6.+time*.4)*1.8)+sin(p.z*7.-p.y*4.+time*.3)+sin(p.y*11.+p.x*3.);
        float cloud=wave*.12+.42;
        float center=pow(max(0.,1.-length(p.xy)*.58),3.);
        float light=max(.0,dot(normalize(n),normalize(vec3(-.4,1.,1.))));
        vec3 color=mix(vec3(.018,.026,.09),vec3(.42,.48,.72),cloud)*(.35+light*.65);
        color+=vec3(.65,.76,1.)*center*(.7+cloud*.9);
        gl_FragColor=vec4(color,1.);
      }`
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 1.5;
    scene.add(cube);
    const edgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.255, 2.255, 2.255));
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x697fdd, transparent: true, opacity: 0.55 });
    cube.add(new THREE.LineSegments(edgesGeometry, edgesMaterial));
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floor = new Reflector(floorGeometry, { textureWidth: 512, textureHeight: 512, color: 0x666875 });
    floor.material.fragmentShader = floor.material.fragmentShader.replace('vec4 base = texture2DProj( tDiffuse, vUv );', 'vec4 ripple = vUv; ripple.x += sin(vUv.y * 180.0) * 0.002 * vUv.w; ripple.y += sin(vUv.x * 130.0) * 0.001 * vUv.w; vec4 base = texture2DProj(tDiffuse, ripple);');
    floor.material.vertexShader = floor.material.vertexShader.replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec3 floorPosition;').replace('vUv = textureMatrix', 'floorPosition = position; vUv = textureMatrix');
    floor.material.fragmentShader = floor.material.fragmentShader.replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec3 floorPosition;').replace('blendOverlay( base.rgb, color )', 'blendOverlay( base.rgb, color ) * exp(-abs(floorPosition.y) * 0.65) * 0.7');
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.08;
    scene.add(floor);
    let pointerX = 0, pointerY = 0;
    const move = (event) => {
      const bounds = element.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.7;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.25;
    };
    const reset = () => { pointerX = 0; pointerY = 0; };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame;
    const clock = new THREE.Clock();
    const draw = () => {
      const t = reduced ? 0 : clock.getElapsedTime();
      material.uniforms.time.value = t;
      cube.rotation.y += ((0.65 + pointerX + Math.sin(t * .16) * .15) - cube.rotation.y) * .04;
      cube.rotation.x += ((.12 + pointerY) - cube.rotation.x) * .04;
      cube.position.y = 1.5 + Math.sin(t * .65) * .08;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      geometry.dispose(); material.dispose(); edgesGeometry.dispose(); edgesMaterial.dispose();
      floor.getRenderTarget().dispose(); floor.material.dispose(); floorGeometry.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="studio-cube" role="img" aria-label="An illuminated blue cube suspended above a reflective dark floor, responding to pointer movement" />;
}
