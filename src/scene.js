import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const COLORS = [0xd5e0ff, 0x5d78ff, 0x8b67ff, 0x52d5ff, 0xe5ff73, 0xff8066];

function buildings() {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  for (let z = -5; z <= 5; z += 1) {
    for (let x = -6; x <= 6; x += 1) {
      if ((x + z) % 3 === 0) continue;
      const height = 0.25 + ((Math.abs(x * 17 + z * 11) % 13) / 13) * 2.8;
      const material = new THREE.MeshBasicMaterial({
        color: COLORS[Math.abs(x + z) % COLORS.length],
        wireframe: true,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(0.62, height, 0.62);
      mesh.position.set(x * 1.15, height / 2 - 2.6, z * 1.15);
      group.add(mesh);
    }
  }
  return group;
}

function terrain() {
  const geometry = new THREE.PlaneGeometry(34, 34, 80, 80);
  const base = geometry.attributes.position.array.slice();
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0x456dff,
      wireframe: true,
      transparent: true,
      opacity: 0.11,
      blending: THREE.AdditiveBlending,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -2.7;
  return { mesh, base };
}

function particles(count) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 40;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xd5e0ff,
      size: 0.025,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
}

export function createScene(canvas, mode = "content") {
  const compact = matchMedia("(max-width: 800px)").matches;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020a19, 0.045);
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !compact, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.2 : 1.7));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), compact ? 0.55 : 0.95, 0.8, 0.16));

  const world = new THREE.Group();
  scene.add(world);
  const city = buildings();
  world.add(city);
  const { mesh: ground, base } = terrain();
  world.add(ground);
  const stars = particles(compact ? 900 : 2400);
  scene.add(stars);

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 3.4, 3.4, 5, 5, 5),
    new THREE.MeshBasicMaterial({
      color: 0xd5e0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.46,
      blending: THREE.AdditiveBlending,
    }),
  );
  core.position.y = 1;
  world.add(core);
  const coreInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.25, 3),
    new THREE.MeshBasicMaterial({ color: 0x163b83, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending }),
  );
  coreInner.position.copy(core.position);
  world.add(coreInner);

  const rings = new THREE.Group();
  [3.2, 4.6, 6.4].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.014 + index * 0.006, 6, 160),
      new THREE.MeshBasicMaterial({ color: COLORS[index + 1], transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending }),
    );
    ring.rotation.set(index * 0.7, index * 0.55, index * 0.22);
    rings.add(ring);
  });
  rings.position.y = 0.6;
  world.add(rings);

  const pointer = new THREE.Vector2();
  let targetProgress = 0;
  let progress = 0;
  const cameraModes = {
    home: [8.6, 5.2, 12.8],
    map: [0.01, 17.5, 0.01],
    content: [7.8, 4.5, 13.8],
  };
  camera.position.set(...cameraModes[mode]);
  camera.lookAt(0, 0, 0);

  addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / innerWidth - 0.5;
    pointer.y = event.clientY / innerHeight - 0.5;
  }, { passive: true });
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();
  const tick = () => {
    const time = clock.getElapsedTime();
    progress += (targetProgress - progress) * 0.035;
    core.rotation.x = time * 0.13 + progress * 4;
    core.rotation.y = time * 0.18 + progress * 7;
    coreInner.rotation.copy(core.rotation);
    rings.rotation.y = time * 0.035 + progress * 2.6;
    rings.rotation.x = progress * 1.8;
    stars.rotation.y = time * 0.007;
    city.rotation.y = progress * Math.PI * 1.5;
    world.position.x = mode === "home" ? Math.sin(progress * Math.PI * 3) * 2.3 : 0;
    world.position.z = mode === "home" ? Math.cos(progress * Math.PI * 2) * 1.5 : 0;

    const positions = ground.geometry.attributes.position.array;
    for (let index = 0; index < positions.length; index += 3) {
      positions[index + 2] =
        Math.sin(base[index] * 0.42 + time * 0.3) * 0.18 +
        Math.cos(base[index + 1] * 0.38 + time * 0.24) * 0.14;
    }
    ground.geometry.attributes.position.needsUpdate = true;

    if (mode !== "map") {
      const basePosition = cameraModes[mode];
      camera.position.x += (basePosition[0] + pointer.x * 1.4 - camera.position.x) * 0.02;
      camera.position.y += (basePosition[1] - pointer.y * 0.8 - camera.position.y) * 0.02;
      camera.lookAt(world.position.x * 0.25, 0, 0);
    } else {
      camera.lookAt(0, 0, 0);
      world.rotation.y = -0.18 + pointer.x * 0.05;
      world.rotation.z = pointer.y * 0.025;
    }
    composer.render();
    requestAnimationFrame(tick);
  };
  tick();

  return {
    setProgress(value) {
      targetProgress = Math.min(1, Math.max(0, value));
    },
  };
}

