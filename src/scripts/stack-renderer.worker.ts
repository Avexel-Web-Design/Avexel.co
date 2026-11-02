import * as THREE from 'three';
// oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape is Three.js's public class for geometric extrusion outlines.
import { Shape as ExtrusionOutline } from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
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
  renderer.transmissionResolutionScale = .8;
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const world = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, .05, 10.5);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x09060e);
  function reflectionPanel(width: number, height: number, position: number[], color: number, strength: number) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide }));
    panel.position.set(position[0], position[1], position[2]); panel.lookAt(0, 0, 0); room.add(panel);
  }
  reflectionPanel(3, 6, [-4, 2, 5], 0xeee7ff, 1.8);
  reflectionPanel(.5, 5, [3, .5, 2], 0xc0a1e8, 2.8);
  reflectionPanel(.3, 4.5, [-3.5, -.25, 5], 0xe5ccff, 2.5);
  reflectionPanel(5, .6, [0, 5, -1], 0xf2eaff, 1.4);
  reflectionPanel(4, .35, [0, -2, -4], 0x9264c4, 2);
  const environment = pmrem.fromScene(room, .06);
  world.environment = environment.texture;
  room.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); object.material.dispose(); } });
  pmrem.dispose();

  const material = new THREE.MeshPhysicalMaterial({ color: 0xbca4d4, metalness: 0, roughness: .07, transmission: .95, thickness: .28, ior: 1.46, clearcoat: .6, clearcoatRoughness: .12, envMapIntensity: 1.05, attenuationColor: new THREE.Color(0x9b6bc9), attenuationDistance: .85, transparent: true, opacity: .52, depthWrite: false });
  const rimMaterial = material.clone(); rimMaterial.color.setHex(0xd6bbed); rimMaterial.transmission = .72; rimMaterial.thickness = .4; rimMaterial.attenuationDistance = .9; rimMaterial.opacity = .9; rimMaterial.envMapIntensity = 1.8; rimMaterial.roughness = .06;
  const body = new THREE.Group();
  world.add(body);
  const pose = new THREE.Group(); body.add(pose);
  function buildOutline(points: number[][], radius = .11) {
    const outline = new ExtrusionOutline();
    const corners = points.map(([x, y], index) => {
      const previous = points[(index + points.length - 1) % points.length];
      const next = points[(index + 1) % points.length];
      const before = Math.hypot(previous[0] - x, previous[1] - y);
      const after = Math.hypot(next[0] - x, next[1] - y);
      const tangent = Math.min(radius, before * .2, after * .2);
      return { x, y, entry: [x + (previous[0] - x) / before * tangent, y + (previous[1] - y) / before * tangent], exit: [x + (next[0] - x) / after * tangent, y + (next[1] - y) / after * tangent] };
    });
    corners.forEach((corner, index) => {
      if (index === 0) outline.moveTo(corner.entry[0], corner.entry[1]);
      else outline.lineTo(corner.entry[0], corner.entry[1]);
      outline.quadraticCurveTo(corner.x, corner.y, corner.exit[0], corner.exit[1]);
    });
    outline.closePath(); return outline;
  }
  function layer(outline: ExtrusionOutline) {
    const raw = new THREE.ExtrudeGeometry(outline, { depth: .22, bevelEnabled: true, bevelThickness: .045, bevelSize: .035, bevelSegments: 7, steps: 1, curveSegments: 20 });
    const geometry = toCreasedNormals(raw, Math.PI / 3);
    raw.dispose(); geometry.translate(0, 0, -.11);
    const part = new THREE.Group();
    part.add(new THREE.Mesh(geometry, [material, rimMaterial]));
    pose.add(part); return part;
  }
  const hex = [[0, 2.25], [1.95, 1.125], [1.95, -1.125], [0, -2.25], [-1.95, -1.125], [-1.95, 1.125]];
  const frameOutline = buildOutline(hex, .16);
  frameOutline.holes.push(buildOutline([...hex].reverse().map(([x, y]) => [x * .85, y * .85]), .12));
  const frame = layer(frameOutline);
  const diamondOutline = buildOutline([[0, 1.42], [1.28, .68], [0, -.06], [-1.28, .68]], .11);
  diamondOutline.holes.push(buildOutline([[-.81, .68], [0, .21], [.81, .68], [0, 1.15]], .07));
  const diamond = layer(diamondOutline);
  const chevron = layer(buildOutline([[-1.28, .02], [0, -.72], [1.28, .02], [1.28, -.42], [0, -1.16], [-1.28, -.42]], .07));
  const key = new THREE.DirectionalLight(0xeee2ff, 1.2); key.position.set(-3, 5, 4); world.add(key);
  const rim = new THREE.PointLight(0xb26bff, 10, 14); rim.position.set(3, 1, -1); world.add(rim);
  world.add(new THREE.HemisphereLight(0xcab2e8, 0x12091c, .3));
  let visible = !config.hidden;
  let reducedMotion = config.reducedMotion;
  let announced = false;
  let renderQueued = false;
  const draw = () => {
    if (!visible) return;
    renderer.render(world, camera);
    if (!announced) { announced = true; reply({ type: 'ready' }); }
  };
  // Coalesce all moving layers into one draw per frame; never render once per tween.
  const render = () => {
    if (!visible || renderQueued) return;
    renderQueued = true;
    setTimeout(() => {
      renderQueued = false;
      draw();
    }, 16);
  };
  const resize = (width: number, height: number) => {
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = Math.max(10.5, 4.9 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
    camera.updateProjectionMatrix(); draw();
  };

  const states = {
    home: { rotation: [.28, -.58, -.035], frame: [0, 0, -.18], diamond: [0, 0, .16], chevron: [0, 0, .02], scale: 1 },
    services: { rotation: [.32, -.62, -.025], frame: [0, -.22, -.55], diamond: [0, .38, .85], chevron: [0, -.12, .4], scale: .92 },
    studio: { rotation: [.22, -.5, -.015], frame: [0, -.12, -.45], diamond: [0, .25, .6], chevron: [0, -.2, .28], scale: .92 },
    work: { rotation: [.2, -.55, -.025], frame: [0, -.15, -.5], diamond: [0, .3, .7], chevron: [0, -.15, .35], scale: .9 },
    contact: { rotation: [.27, -.54, -.01], frame: [0, -.1, -.4], diamond: [0, .18, .5], chevron: [0, -.15, .7], scale: .92 },
  };
  const views = new Map(Object.entries(states));
  function setView(view: string, immediate: boolean, reduceMotion: boolean) {
    reducedMotion = reduceMotion;
    const state = views.get(view) ?? states.home;
    const duration = immediate || reducedMotion ? 0 : .95;
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
    pointer: (x, y) => { if (!reducedMotion) gsap.to(pose.rotation, { x: -y * .09, y: x * .13, duration: .65, overwrite: true, onUpdate: render }); },
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
