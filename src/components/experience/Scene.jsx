import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const colors = [0xbb65ff, 0xb4f6ff, 0xffe45b, 0x79ff8a];
export default function Scene({ section, selection, progress, project }) {
  const host = useRef(null);
  const state = useRef({ section, selection, progress, project });
  state.current = { section, selection, progress, project };
  useEffect(() => {
    const element = host.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    element.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 160);
    camera.position.set(0, 1.4, 8.8);
    const scene = new THREE.Scene();
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.6, 0.5, 0.8);
    composer.addPass(bloom);
    const textureLoader = new THREE.TextureLoader();
    const textures = new Map();
    const texture = (path) => {
      if (!textures.has(path)) {
        const t = textureLoader.load(`/experience/textures/${path}`);
        t.colorSpace = THREE.SRGBColorSpace;
        textures.set(path, t);
      }
      return textures.get(path);
    };
    const decoder = new DRACOLoader();
    decoder.setDecoderPath("/experience/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(decoder);
    const worlds = new Map();
    const mixers = [];
    let alive = true;
    function model(name, group, size, position, material) {
      loader.load(`/experience/models/${name}.glb`, (gltf) => {
        if (!alive) return;
        const object = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(object);
        const dimensions = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        object.position.sub(center);
        const wrapper = new THREE.Group();
        wrapper.add(object);
        wrapper.scale.setScalar(
          size / Math.max(dimensions.x, dimensions.y, dimensions.z),
        );
        wrapper.position.set(...position);
        group.add(wrapper);
        object.traverse((child) => {
          if (child.isMesh && material) child.material = material;
        });
        if (gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(object);
          mixer.clipAction(gltf.animations[0]).play();
          mixers.push(mixer);
        }
      });
    }
    const floor = new Reflector(new THREE.PlaneGeometry(120, 120), {
      textureWidth: 768,
      textureHeight: 768,
      color: 0x555555,
    });
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    floor.material.fragmentShader = floor.material.fragmentShader.replace(
      "vec4 base = texture2DProj( tDiffuse, vUv );",
      "vec4 ripple=vUv; ripple.x+=sin(vUv.y*220.0)*0.0015*vUv.w; vec4 base=texture2DProj(tDiffuse,ripple);",
    );
    const ambient = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 4);
    sun.position.set(3, 8, 5);
    scene.add(sun);
    const portal = (group, kind, color, x, y, z, size) => {
      const geometry =
        kind === "circle"
          ? new THREE.TorusGeometry(size * 0.5, 0.035, 10, 100)
          : new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(
                kind === "triangle"
                  ? [
                      new THREE.Vector3(0, size * 0.55, 0),
                      new THREE.Vector3(-size * 0.55, -size * 0.45, 0),
                      new THREE.Vector3(size * 0.55, -size * 0.45, 0),
                      new THREE.Vector3(0, size * 0.55, 0),
                    ]
                  : [
                      new THREE.Vector3(-size * 0.5, -size * 0.5, 0),
                      new THREE.Vector3(size * 0.5, -size * 0.5, 0),
                      new THREE.Vector3(size * 0.5, size * 0.5, 0),
                      new THREE.Vector3(-size * 0.5, size * 0.5, 0),
                      new THREE.Vector3(-size * 0.5, -size * 0.5, 0),
                    ],
                false,
                "catmullrom",
                0,
              ),
              80,
              0.025,
              8,
              false,
            );
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(color).multiplyScalar(3),
        }),
      );
      mesh.position.set(x, y, z);
      if (kind === "diamond") mesh.rotation.z = Math.PI / 4;
      group.add(mesh);
      return mesh;
    };
    const root = new THREE.Group();
    root.add(floor);
    scene.add(root);
    worlds.set("home", root);
    const cubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        noise: { value: texture("cube/cube_noise.png") },
        background: { value: texture("cube/cube_background.png") },
        tint: { value: new THREE.Color(0xa3bdff) },
      },
      vertexShader:
        "varying vec2 uvp; varying vec3 np; void main(){uvp=uv;np=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "uniform sampler2D noise; uniform sampler2D background; uniform float time; uniform vec3 tint; varying vec2 uvp; varying vec3 np; void main(){vec2 uv=uvp; float n=texture2D(noise,uv+vec2(time*.015,0.)).r;vec3 c=texture2D(background,uv+vec2(n*.06,time*.006)).rgb;float center=pow(max(0.,1.-length(uv-.5)*1.6),2.);c=c*.7+tint*(center*.7+n*.13);gl_FragColor=vec4(c*(.7+np.y*.18+np.z*.2),1.);}",
    });
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.8, 1.8),
      cubeMaterial,
    );
    root.add(cube);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.25, 1.25),
      new THREE.MeshBasicMaterial({
        map: texture("cube/rectangle.png"),
        blending: THREE.AdditiveBlending,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    );
    face.position.z = 0.905;
    cube.add(face);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(cube.geometry),
      new THREE.LineBasicMaterial({
        color: 0xabc8ff,
        transparent: true,
        opacity: 0.4,
      }),
    );
    cube.add(edge);
    const symbols = ["rectangle", "rhombus", "triangle", "circle"];
    function makeWorld(name) {
      const group = new THREE.Group();
      scene.add(group);
      worlds.set(name, group);
      if (name === "about") {
        const groundGeometry = new THREE.PlaneGeometry(70, 70, 120, 120);
        groundGeometry.rotateX(-Math.PI / 2);
        const points = groundGeometry.attributes.position;
        for (let i = 0; i < points.count; i++) {
          const x = points.getX(i),
            z = points.getZ(i);
          points.setY(
            i,
            Math.sin(x * 0.35) * Math.cos(z * 0.28) * 0.6 +
              Math.sin(x * 0.8 + z * 0.5) * 0.12 -
              2,
          );
        }
        groundGeometry.computeVertexNormals();
        const grassTexture = texture("who_we_are/texture_grass.png");
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(30, 30);
        group.add(
          new THREE.Mesh(
            groundGeometry,
            new THREE.MeshStandardMaterial({ color: 0x223c30, roughness: 1 }),
          ),
        );
        for (let i = 0; i < 15; i++)
          model(
            "grass",
            group,
            0.7,
            [Math.sin(i * 7) * 12, -1.8, -4 - i * 0.8],
            new THREE.MeshStandardMaterial({
              color: 0x446239,
              side: THREE.DoubleSide,
              roughness: 1,
            }),
          );
        portal(group, "rectangle", colors[0], 2.6, 1, -3, 4.3);
        const mountains = new THREE.Mesh(
          new THREE.PlaneGeometry(100, 25),
          new THREE.ShaderMaterial({
            uniforms: { map: { value: texture("who_we_are/background.png") } },
            vertexShader:
              "varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
            fragmentShader:
              "uniform sampler2D map;varying vec2 v;void main(){vec4 c=texture2D(map,v);gl_FragColor=vec4(c.rgb,max(c.r,max(c.g,c.b))>.018?1.:0.);}",
            transparent: true,
          }),
        );
        mountains.position.set(0, 6, -35);
        group.add(mountains);
        for (let i = 0; i < 12; i++)
          model(
            "rock",
            group,
            1.8 + Math.sin(i) * 0.7,
            [Math.sin(i * 7) * 9, -1.1, -i * 1.3],
            new THREE.MeshStandardMaterial({
              color: 0x414d48,
              normalMap: texture("contact/rocks_normal.jpg"),
              roughness: 1,
            }),
          );
      }
      if (name === "services") {
        model(
          "ocean_bottom",
          group,
          45,
          [0, -4, -13],
          new THREE.MeshStandardMaterial({
            map: texture("how_we_do_it/ground.png"),
            color: 0x4b7e87,
            roughness: 1,
          }),
        );
        const water = new THREE.Mesh(
          new THREE.PlaneGeometry(100, 100),
          new THREE.MeshStandardMaterial({
            color: 0x3598aa,
            normalMap: texture("how_we_do_it/water_normal.png"),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65,
            metalness: 0.3,
            roughness: 0.2,
          }),
        );
        water.rotation.x = Math.PI / 2;
        water.position.y = 5;
        group.add(water);
        const diamond = portal(group, "diamond", colors[1], 2.8, 1, -3, 3.6);
        diamond.rotation.y = -0.15;
        for (let i = 0; i < 7; i++)
          model(
            "fish",
            group,
            1.2,
            [Math.sin(i * 5) * 7, Math.cos(i) * 2, -i * 2],
            new THREE.MeshStandardMaterial({
              color: i % 2 ? 0xd4a577 : 0x9bbdc1,
              metalness: 0.2,
              roughness: 0.6,
            }),
          );
      }
      if (name === "projects") {
        model(
          "desert",
          group,
          65,
          [0, -3, -14],
          new THREE.MeshStandardMaterial({ color: 0xbca98a, roughness: 1 }),
        );
        portal(group, "rectangle", colors[2], 2.5, 1, -3, 4);
        for (let i = 0; i < 4; i++)
          model(
            "pyramid",
            group,
            6 + i * 2,
            [-7 + i * 5, 0, -15 - i * 4],
            new THREE.MeshStandardMaterial({ color: 0xab8b72, roughness: 1 }),
          );
        const sunset = new THREE.Mesh(
          new THREE.CircleGeometry(3.5, 64),
          new THREE.MeshBasicMaterial({ color: 0xffccc5 }),
        );
        sunset.position.set(0, 4, -38);
        group.add(sunset);
      }
      if (name === "contact") {
        model(
          "contact_scene",
          group,
          20,
          [0, 0, -4],
          new THREE.MeshStandardMaterial({
            color: 0x141b1c,
            roughness: 0.28,
            metalness: 0.5,
          }),
        );
        portal(group, "circle", colors[3], -3, 1, -1, 5);
        model(
          "astronaut_walking",
          group,
          3.1,
          [-2, -0.2, 0],
          new THREE.MeshStandardMaterial({
            color: 0xd1d7d6,
            metalness: 0.45,
            roughness: 0.4,
          }),
        );
        for (let i = 0; i < 5; i++)
          model(
            "rock",
            group,
            0.5 + i * 0.1,
            [Math.sin(i) * 5, 1 + i * 0.4, -3 - i],
            new THREE.MeshStandardMaterial({ color: 0x666970, roughness: 0.9 }),
          );
      }
      return group;
    }
    const skyPaths = {
      about: "who_we_are/background_gradient.png",

      projects: "our_work/desert_gradient.png",
    };
    let pointerX = 0,
      pointerY = 0,
      current = "";
    const move = (e) => {
      pointerX = (e.clientX / innerWidth - 0.5) * 0.5;
      pointerY = (e.clientY / innerHeight - 0.5) * 0.25;
    };
    window.addEventListener("pointermove", move);
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const clock = new THREE.Clock();
    let frame;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function draw() {
      const { section, selection, progress } = state.current;
      const mode = section || "home";
      if (current !== mode) {
        current = mode;
        if (!worlds.has(mode)) makeWorld(mode);
        worlds.forEach((g, k) => {
          g.visible = k === mode;
        });
        scene.background = skyPaths[mode]
          ? texture(skyPaths[mode])
          : new THREE.Color(mode === "services" ? 0x225977 : 0x000000);
        if (mode === "projects") {
          scene.background.center.set(0.5, 0.5);
          scene.background.rotation = Math.PI / 2;
        }
        scene.fog =
          mode === "services"
            ? new THREE.FogExp2(0x28526a, 0.028)
            : mode === "about"
              ? new THREE.FogExp2(0x007d78, 0.018)
              : null;
      }
      const delta = clock.getDelta(),
        time = clock.elapsedTime;
      mixers.forEach((m) => m.update(reduced ? 0 : delta));
      const mobile = camera.aspect < 0.8;
      if (mode !== "home") {
        worlds.get(mode).position.x = mobile
          ? { about: -2.6, services: -2.8, projects: -2.5, contact: 2.3 }[mode]
          : 0;
      }
      const target = new THREE.Vector3(
        mode === "home" || mobile
          ? 0
          : mode === "about"
            ? progress * 5
            : progress * 3,
        mode === "home" ? 1.4 : 1.3,
        mode === "home" ? (mobile ? 12.8 : 8.8) : mobile ? 12 : 8,
      );
      target.x += pointerX;
      target.y += pointerY;
      camera.position.lerp(target, 0.045);
      camera.lookAt(0, mode === "home" ? -0.3 : 0, -2 - progress * 2);
      cube.position.x = selection === null ? 0 : mobile ? 0 : 2.1;
      cube.position.y = selection === null ? 0 : mobile ? 0.8 : 0.6;
      cube.rotation.y = selection === null ? -0.5 + pointerX : -0.35 + pointerX;
      cube.rotation.x = 0.07 + pointerY;
      cubeMaterial.uniforms.time.value = reduced ? 0 : time;
      cubeMaterial.uniforms.tint.value.set(
        selection === null ? 0xa3bdff : colors[selection],
      );
      face.visible = selection !== null;
      if (selection !== null)
        face.material.map = texture(`cube/${symbols[selection]}.png`);
      ambient.intensity = mode === "contact" ? 0.45 : 1.1;
      sun.intensity = mode === "contact" ? 1.2 : 2;
      bloom.strength = mode === "home" ? 0.65 : 0.8;
      composer.render();
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          const list = Array.isArray(o.material) ? o.material : [o.material];
          list.forEach((m) => m.dispose());
        }
      });
      textures.forEach((t) => t.dispose());
      floor.getRenderTarget().dispose();
      composer.dispose();
      decoder.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div className="experience-canvas" ref={host} aria-hidden="true" />;
}
