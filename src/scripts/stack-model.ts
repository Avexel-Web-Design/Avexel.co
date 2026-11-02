import type { StackCommand, StackReply } from './stack-protocol';

export interface StackModel { setView: (view: string, immediate?: boolean) => void; }

// Keep WebGL initialization, shader compilation, and rendering off the UI thread.
export async function createStackModel(host: HTMLElement, initialView = 'home'): Promise<StackModel | undefined> {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  let worker: Worker;
  let offscreen: OffscreenCanvas;
  try {
    offscreen = canvas.transferControlToOffscreen();
    worker = new Worker(new URL('./stack-renderer.worker.ts', import.meta.url), { type: 'module', name: 'avexel-glass-stack' });
  } catch { return; }
  host.append(canvas);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const send = (message: StackCommand) => worker.postMessage(message);
  const resize = () => {
    // CSS camera transforms must not resize (and clear) the drawing buffer.
    if (host.clientWidth && host.clientHeight) send({ type: 'resize', width: host.clientWidth, height: host.clientHeight });
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  host.addEventListener('pointermove', event => {
    if (reduce.matches || event.pointerType === 'touch') return;
    const rect = host.getBoundingClientRect();
    send({ type: 'pointer', x: (event.clientX - rect.left) / rect.width - .5, y: (event.clientY - rect.top) / rect.height - .5 });
  });
  host.addEventListener('pointerleave', () => send({ type: 'pointer', x: 0, y: 0 }));
  document.addEventListener('visibilitychange', () => send({ type: 'visibility', hidden: document.hidden }));
  window.addEventListener('pageshow', () => { resize(); send({ type: 'visibility', hidden: document.hidden }); });
  window.addEventListener('pagehide', event => { if (!event.persisted) { observer.disconnect(); worker.terminate(); } });
  const controller: StackModel = { setView: (view, immediate = false) => {
    send({ type: 'view', view, immediate, reducedMotion: reduce.matches });
  } };
  return new Promise(resolve => {
    let readyOnce = false;
    const fallback = () => { host.parentElement?.removeAttribute('data-rendered'); host.parentElement?.setAttribute('data-fallback', 'true'); };
    worker.onmessage = (event: MessageEvent<StackReply>) => {
      if (event.data.type === 'ready') {
        readyOnce = true;
        host.parentElement?.setAttribute('data-rendered', 'true');
        host.parentElement?.removeAttribute('data-fallback');
        resolve(controller);
      } else {
        fallback();
        if (!readyOnce) { observer.disconnect(); worker.terminate(); canvas.remove(); }
        resolve(undefined);
      }
    };
    worker.onerror = () => { fallback(); observer.disconnect(); worker.terminate(); canvas.remove(); resolve(undefined); };
    const command: StackCommand = { type: 'init', canvas: offscreen, width: host.clientWidth || 600, height: host.clientHeight || 600, pixelRatio: Math.min(devicePixelRatio, 1.5), view: initialView, reducedMotion: reduce.matches, hidden: document.hidden };
    worker.postMessage(command, [offscreen]);
  });
}
