import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const palette = ["#d6ff36", "#8a7cff", "#ff623e", "#62d9ff", "#f0ffb2"];

function createParticleCloud(count) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const radius = 5 + Math.random() * 26;
    const angle = Math.random() * Math.PI * 2;
    const spread = (Math.random() - 0.5) * 18;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = spread;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
    sizes[index] = Math.random() * 2 + 0.4;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: palette[0],
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
}

function createWaveGrid() {
  const geometry = new THREE.PlaneGeometry(28, 28, 72, 72);
  const base = geometry.attributes.position.array.slice();
  const material = new THREE.MeshBasicMaterial({
    color: palette[1],
    wireframe: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, -5.2, 2);
  return { mesh, base };
}

function createRibbon() {
  const points = [];
  for (let index = 0; index < 190; index += 1) {
    const t = index / 18;
    points.push(
      new THREE.Vector3(
        Math.sin(t * 0.72) * (2.6 + t * 0.1),
        (index - 95) * 0.045,
        Math.cos(t * 0.72) * (2.6 + t * 0.1),
      ),
    );
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 280, 0.018, 5, false);
  return new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: palette[4],
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    }),
  );
}

export function createScene(canvas) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 800px)").matches;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.036);

  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !compact, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    compact ? 0.65 : 1.05,
    0.75,
    0.18,
  );
  composer.addPass(bloom);

  const world = new THREE.Group();
  scene.add(world);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, compact ? 2 : 4),
    new THREE.MeshBasicMaterial({
      color: palette[0],
      wireframe: true,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    }),
  );
  world.add(core);

  const coreShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.65, 5),
    new THREE.MeshBasicMaterial({
      color: 0xf6ffe4,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
    }),
  );
  world.add(coreShell);

  const rings = new THREE.Group();
  [3.4, 4.6, 6.4].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.012 + index * 0.006, 8, 180),
      new THREE.MeshBasicMaterial({
        color: palette[(index + 1) % palette.length],
        transparent: true,
        opacity: 0.5 - index * 0.09,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring.rotation.set(index * 0.85, index * 0.45, index * 0.25);
    rings.add(ring);
  });
  world.add(rings);

  const particles = createParticleCloud(compact ? 1300 : 3200);
  world.add(particles);

  const ribbon = createRibbon();
  ribbon.rotation.z = Math.PI / 2;
  ribbon.position.x = -0.8;
  world.add(ribbon);

  const { mesh: wave, base: waveBase } = createWaveGrid();
  scene.add(wave);

  const mouse = new THREE.Vector2();
  let scrollProgress = 0;
  let targetProgress = 0;

  const handlePointer = (event) => {
    mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  const handleScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = max > 0 ? window.scrollY / max : 0;
  };

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("pointermove", handlePointer, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
  handleScroll();

  const clock = new THREE.Clock();
  let frame = 0;

  const animate = () => {
    const time = clock.getElapsedTime();
    scrollProgress += (targetProgress - scrollProgress) * 0.035;

    core.rotation.x = time * 0.08 + scrollProgress * 5;
    core.rotation.y = time * 0.13 + scrollProgress * 7;
    core.scale.setScalar(1 + Math.sin(time * 1.25) * 0.035);
    coreShell.rotation.copy(core.rotation);
    rings.rotation.x = time * 0.025 + scrollProgress * 2.2;
    rings.rotation.y = -time * 0.035 + scrollProgress * 3.5;
    particles.rotation.y = time * 0.008 + scrollProgress * 2.4;
    particles.rotation.z = scrollProgress * 0.7;
    ribbon.rotation.y = time * 0.05 + scrollProgress * 5;

    const colorPosition = scrollProgress * (palette.length - 1);
    const colorA = new THREE.Color(palette[Math.floor(colorPosition) % palette.length]);
    const colorB = new THREE.Color(palette[Math.ceil(colorPosition) % palette.length]);
    const color = colorA.lerp(colorB, colorPosition % 1);
    core.material.color.lerp(color, 0.025);
    particles.material.color.lerp(color, 0.018);

    camera.position.x += (mouse.x * 0.65 - camera.position.x) * 0.025;
    camera.position.y += (-mouse.y * 0.45 - camera.position.y) * 0.025;
    camera.position.z = 11.8 - Math.sin(scrollProgress * Math.PI * 4) * 1.6;
    camera.lookAt(0, 0, 0);
    world.position.x = Math.sin(scrollProgress * Math.PI * 6) * 2.2;
    world.position.y = Math.cos(scrollProgress * Math.PI * 5) * 1.2;

    if (!reducedMotion && frame % (compact ? 2 : 1) === 0) {
      const positions = wave.geometry.attributes.position.array;
      for (let index = 0; index < positions.length; index += 3) {
        const x = waveBase[index];
        const y = waveBase[index + 1];
        positions[index + 2] =
          Math.sin(x * 0.6 + time * 0.65) * 0.34 +
          Math.cos(y * 0.45 + time * 0.42) * 0.26;
      }
      wave.geometry.attributes.position.needsUpdate = true;
    }

    composer.render();
    frame += 1;
    requestAnimationFrame(animate);
  };

  animate();

  return {
    setEntered(entered) {
      bloom.strength = entered ? (compact ? 0.65 : 1.05) : 1.5;
    },
  };
}

