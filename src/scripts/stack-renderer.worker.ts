import * as THREE from 'three';
// oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape is Three.js's public class for geometric extrusion outlines.
import { Shape as ExtrusionOutline } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { gsap } from 'gsap';
import type { StackCommand, StackInit, StackReply } from './stack-protocol';

interface WorkerRenderer {
  setView: (view: string, immediate: boolean, reducedMotion: boolean) => void;
  resize: (width: number, height: number) => void;
  pointer: (x: number, y: number) => void;
  visibility: (hidden: boolean) => void;
}
const reply = (message: StackReply) => self.postMessage(message);

function createRenderer(config: StackInit): WorkerRenderer | undefined {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: config.canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(config.pixelRatio);
  renderer.transmissionResolutionScale = .65;
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const world = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, .05, 10.5);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  world.environment = environment.texture;
  room.dispose(); pmrem.dispose();

  const material = new THREE.MeshPhysicalMaterial({ color: 0x7546ac, metalness: .025, roughness: .12, transmission: .94, thickness: 1.2, ior: 1.48, clearcoat: 1, clearcoatRoughness: .09, envMapIntensity: 1.5, attenuationColor: new THREE.Color(0x54217d), attenuationDistance: 1.6 });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xd7b2ff, transparent: true, opacity: .12 });
  const body = new THREE.Group();
  world.add(body);
  const pose = new THREE.Group(); body.add(pose);
  function buildOutline(points: number[][]) {
    const outline = new ExtrusionOutline();
    points.forEach(([x, y], index) => { if (index === 0) outline.moveTo(x, y); else outline.lineTo(x, y); });
    outline.closePath(); return outline;
  }
  function layer(outline: ExtrusionOutline) {
    const geometry = new THREE.ExtrudeGeometry(outline, { depth: .36, bevelEnabled: true, bevelThickness: .08, bevelSize: .06, bevelSegments: 6, steps: 1, curveSegments: 12 });
    geometry.computeVertexNormals();
    const part = new THREE.Group();
    part.add(new THREE.Mesh(geometry, material));
    const edges = new THREE.EdgesGeometry(geometry, 32);
    part.add(new THREE.LineSegments(edges, edgeMaterial));
    pose.add(part); return part;
  }
  const hex = [[0, 2.35], [2.03, 1.17], [2.03, -1.17], [0, -2.35], [-2.03, -1.17], [-2.03, 1.17]];
  const frameOutline = buildOutline(hex);
  const frameHole = new THREE.Path();
  [...hex].reverse().forEach(([x, y], index) => { if (index === 0) frameHole.moveTo(x * .82, y * .82); else frameHole.lineTo(x * .82, y * .82); });
  frameHole.closePath(); frameOutline.holes.push(frameHole);
  const frame = layer(frameOutline);
  const diamondOutline = buildOutline([[0, 1.42], [1.34, .65], [0, -.12], [-1.34, .65]]);
  const diamondHole = new THREE.Path();
  diamondHole.moveTo(-.83, .65); diamondHole.lineTo(0, .17); diamondHole.lineTo(.83, .65); diamondHole.lineTo(0, 1.13); diamondHole.closePath();
  diamondOutline.holes.push(diamondHole);
  const diamond = layer(diamondOutline);
  const chevron = layer(buildOutline([[-1.34, .03], [0, -.74], [1.34, .03], [1.34, -.48], [0, -1.25], [-1.34, -.48]]));
  const key = new THREE.DirectionalLight(0xf6eaff, 1.8); key.position.set(-3, 5, 6); world.add(key);
  const rim = new THREE.PointLight(0xa744ff, 15, 18); rim.position.set(3, 2, 3); world.add(rim);
  const cool = new THREE.PointLight(0x7964ff, 8, 16); cool.position.set(-3, -2, 2); world.add(cool);
  RectAreaLightUniformsLib.init();
  const softbox = new THREE.RectAreaLight(0xf4eaff, 6, 4, .7); softbox.position.set(-1.8, 3.4, 4); softbox.lookAt(0, 0, 0); world.add(softbox);
  const strip = new THREE.RectAreaLight(0xd0b0ff, 5, .45, 4.5); strip.position.set(3.2, .5, 3.2); strip.lookAt(0, 0, 0); world.add(strip);
  let visible = !config.hidden;
  let reducedMotion = config.reducedMotion;
  let announced = false;
  let renderQueued = false;
  // Coalesce all moving layers into one draw per frame; never render once per tween.
  const render = () => {
    if (!visible || renderQueued) return;
    renderQueued = true;
    setTimeout(() => {
      renderQueued = false;
      if (!visible) return;
      renderer.render(world, camera);
      if (!announced) { announced = true; reply({ type: 'ready' }); }
    }, 16);
  };
  const resize = (width: number, height: number) => {
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = Math.max(10.5, 4.9 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
    camera.updateProjectionMatrix(); render();
  };

  const states = {
    home: { rotation: [-.1, -.3, -.03], frame: [0, 0, -.24], diamond: [0, .08, .3], chevron: [0, -.06, .06], scale: 1 },
    services: { rotation: [.1, -.4, -.05], frame: [-.18, -.55, -.45], diamond: [.08, 1.1, .6], chevron: [.16, -.05, 1], scale: .94 },
    studio: { rotation: [.12, .28, .06], frame: [-.1, -.3, -.5], diamond: [-.2, .95, .75], chevron: [.25, -.6, .35], scale: .94 },
    work: { rotation: [-.12, -.45, -.08], frame: [-.12, -.5, -.6], diamond: [.2, 1.05, .55], chevron: [.3, -.05, 1], scale: .9 },
    contact: { rotation: [.13, .35, .04], frame: [-.15, -.6, -.5], diamond: [.02, 1, .75], chevron: [.1, -.12, 1.15], scale: .94 },
  };
  const views = new Map(Object.entries(states));
  function setView(view: string, immediate: boolean, reduceMotion: boolean) {
    reducedMotion = reduceMotion;
    const state = views.get(view) ?? states.home;
    const duration = immediate || reducedMotion ? 0 : 1.15;
    const options = { duration, ease: 'power3.inOut', onUpdate: render, overwrite: true };
    gsap.to(body.rotation, { x: state.rotation[0], y: state.rotation[1], z: state.rotation[2], ...options });
    gsap.to(body.scale, { x: state.scale, y: state.scale, z: state.scale, ...options });
    for (const [part, position] of [[frame, state.frame], [diamond, state.diamond], [chevron, state.chevron]] as const) gsap.to(part.position, { x: position[0], y: position[1], z: position[2], ...options });
    render();
  }
  config.canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); reply({ type: 'fallback' }); });
  config.canvas.addEventListener('webglcontextrestored', () => { announced = false; render(); });
  setView(config.view, true, reducedMotion); resize(config.width, config.height);
  return {
    setView, resize,
    pointer: (x, y) => { if (!reducedMotion) gsap.to(pose.rotation, { x: -y * .13, y: x * .19, duration: .7, overwrite: true, onUpdate: render }); },
    visibility: hidden => { visible = !hidden; gsap.globalTimeline.paused(hidden); if (visible) render(); },
  };
}

let renderer: WorkerRenderer | undefined;
self.addEventListener('message', (event: MessageEvent<StackCommand>) => {
  const command = event.data;
  if (command.type === 'init') {
    try { renderer = createRenderer(command); }
    catch { renderer = undefined; }
    if (!renderer) reply({ type: 'fallback' });
  } else if (command.type === 'view') renderer?.setView(command.view, command.immediate, command.reducedMotion);
  else if (command.type === 'resize') renderer?.resize(command.width, command.height);
  else if (command.type === 'pointer') renderer?.pointer(command.x, command.y);
  else if (command.type === 'visibility') renderer?.visibility(command.hidden);
});
